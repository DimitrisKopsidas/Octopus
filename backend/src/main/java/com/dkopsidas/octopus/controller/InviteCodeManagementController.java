package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.CreateInviteCodeRequestDto;
import com.dkopsidas.octopus.domain.dto.InviteCodeResponseDto;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.service.InviteCodeManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/invite-codes")
@PreAuthorize("hasRole('ADMIN')")
public class InviteCodeManagementController {

    private final InviteCodeManagementService inviteCodeManagementService;

    @GetMapping
    public ResponseEntity<Page<InviteCodeResponseDto>> getInviteCodes(
            @RequestParam(required = false) UserRole targetRole,
            @RequestParam(required = false) Boolean used,
            @RequestParam(required = false) String query,
            @PageableDefault(size = 20, sort = "created", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<InviteCodeResponseDto> page = inviteCodeManagementService.getInviteCodes(targetRole, used, query, pageable);
        return ResponseEntity.ok(page);
    }

    @PostMapping
    public ResponseEntity<InviteCodeResponseDto> generateInviteCode(
            @Valid @RequestBody CreateInviteCodeRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID actorId = jwt != null ? UUID.fromString(jwt.getSubject()) : null;
        String actorUsername = jwt != null ? jwt.getClaimAsString("username") : null;
        InviteCodeResponseDto response = inviteCodeManagementService.generateInviteCode(requestDto, actorId, actorUsername);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * The role no longer appears in the path: one table means the id is enough
     * to find the row, and keeping the role there would let a caller pass one
     * that contradicts the stored code.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInviteCode(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID actorId = jwt != null ? UUID.fromString(jwt.getSubject()) : null;
        String actorUsername = jwt != null ? jwt.getClaimAsString("username") : null;
        inviteCodeManagementService.deleteInviteCode(id, actorId, actorUsername);
        return ResponseEntity.noContent().build();
    }
}
