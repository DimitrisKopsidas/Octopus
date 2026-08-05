package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CreateInviteCodeRequestDto;
import com.dkopsidas.octopus.domain.dto.InviteCodeResponseDto;
import com.dkopsidas.octopus.domain.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface InviteCodeManagementService {

    Page<InviteCodeResponseDto> getInviteCodes(UserRole targetRole, Boolean used, String query, Pageable pageable);

    InviteCodeResponseDto generateInviteCode(CreateInviteCodeRequestDto requestDto, UUID actorId, String actorUsername);

    /**
     * The id alone identifies a code now that helper and admin invites share one
     * table; the old signature needed the role to pick which table to look in.
     */
    void deleteInviteCode(Long id, UUID actorId, String actorUsername);
}
