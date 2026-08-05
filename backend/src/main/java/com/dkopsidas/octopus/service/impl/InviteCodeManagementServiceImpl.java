package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CreateInviteCodeRequestDto;
import com.dkopsidas.octopus.domain.dto.InviteCodeResponseDto;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.domain.entity.UserCode;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.exception.InviteCodeNotFoundException;
import com.dkopsidas.octopus.repository.UserCodeRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import com.dkopsidas.octopus.service.InviteCodeManagementService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Admin-side management of invite codes.
 * <p>
 * Helper and admin codes used to live in two tables, which forced this class to
 * read both in full, merge them in memory and slice the result by hand. With one
 * table carrying the granted role, filtering and paging are a single query.
 */
@RequiredArgsConstructor
@Service
public class InviteCodeManagementServiceImpl implements InviteCodeManagementService {

    /**
     * No I, O, 0 or 1: these codes get read off a screen and typed by hand, and
     * the pairs are indistinguishable in most fonts.
     */
    private static final String ALPHANUM = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final int GENERATED_BODY_LENGTH = 6;

    private final UserCodeRepository userCodeRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final SecureRandom secureRandom;

    @Override
    @Transactional(readOnly = true)
    public Page<InviteCodeResponseDto> getInviteCodes(
            UserRole targetRole,
            Boolean used,
            String query,
            Pageable pageable
    ) {
        Specification<UserCode> spec = (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (targetRole != null) {
                predicates.add(cb.equal(root.get("role"), targetRole));
            }
            if (used != null) {
                // Availability lives in the timestamp, so this is a null check
                // rather than a comparison against a boolean column.
                predicates.add(used
                        ? cb.isNotNull(root.get("used"))
                        : cb.isNull(root.get("used")));
            }
            if (query != null && !query.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("code")),
                        "%" + query.trim().toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<UserCode> page = userCodeRepository.findAll(spec, pageable);

        // One lookup for the whole page instead of one per row, and only for the
        // codes that were actually claimed.
        List<UUID> claimerIds = page.getContent().stream()
                .map(UserCode::getUsedBy)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        Map<UUID, String> usernamesById = claimerIds.isEmpty()
                ? Map.of()
                : userRepository.findAllById(claimerIds).stream()
                .collect(Collectors.toMap(User::getId, User::getUsername));

        return page.map(userCode -> toDto(userCode, usernamesById::get));
    }

    @Override
    @Transactional
    public InviteCodeResponseDto generateInviteCode(
            CreateInviteCodeRequestDto requestDto,
            UUID actorId,
            String actorUsername
    ) {
        UserRole role = requestDto.targetRole();
        if (role == UserRole.STUDENT) {
            throw new IllegalArgumentException("Invite codes can only grant HELPER or ADMIN");
        }

        String code = resolveCode(requestDto, role);
        if (userCodeRepository.existsByCode(code)) {
            throw new IllegalArgumentException("Invite code already exists: " + code);
        }

        UserCode userCode = new UserCode();
        userCode.setCode(code);
        userCode.setRole(role);
        UserCode saved = userCodeRepository.save(userCode);

        eventPublisher.publishEvent(AuditEvent.success(
                actorId,
                actorUsername,
                AuditAction.INVITE_CODE_GENERATED,
                "INVITE_CODE",
                saved.getId().toString(),
                "Generated new " + role + " code: " + code
        ));

        return toDto(saved, id -> null);
    }

    @Override
    @Transactional
    public void deleteInviteCode(Long id, UUID actorId, String actorUsername) {
        UserCode userCode = userCodeRepository.findById(id)
                .orElseThrow(() -> new InviteCodeNotFoundException(id));
        UserRole role = userCode.getRole();

        userCodeRepository.delete(userCode);

        eventPublisher.publishEvent(AuditEvent.success(
                actorId,
                actorUsername,
                AuditAction.INVITE_CODE_DELETED,
                "INVITE_CODE",
                id.toString(),
                "Deleted " + role + " code #" + id
        ));
    }

    private String resolveCode(CreateInviteCodeRequestDto requestDto, UserRole role) {
        String customCode = requestDto.customCode();
        if (customCode != null && !customCode.isBlank()) {
            return customCode.trim().toUpperCase();
        }
        String prefix = role == UserRole.ADMIN ? "ADM-" : "HLP-";
        return prefix + generateRandomString(GENERATED_BODY_LENGTH);
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUM.charAt(secureRandom.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
    }

    private InviteCodeResponseDto toDto(UserCode userCode, Function<UUID, String> usernameLookup) {
        UUID usedBy = userCode.getUsedBy();
        return new InviteCodeResponseDto(
                userCode.getId(),
                userCode.getCode(),
                userCode.getRole(),
                userCode.getUsed(),
                usedBy,
                usedBy != null ? usernameLookup.apply(usedBy) : null,
                userCode.getCreated()
        );
    }
}
