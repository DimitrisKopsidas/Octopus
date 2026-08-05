package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.UUID;

/**
 * A single-use invite code that upgrades a registration above STUDENT.
 * <p>
 * The code itself carries the role it grants, so HELPER and ADMIN invites live
 * in one table instead of two parallel ones: the claim path is identical for
 * both and only the granted role differs.
 * <p>
 * Availability is derived from {@code used} rather than a separate boolean
 * flag: one field cannot contradict itself. {@code used == null} means the
 * code is still available, and nothing else needs to be kept in sync.
 */
@Getter
@Setter
@ToString(exclude = "code")
@Entity
@Table(
        name = "user_codes",
        uniqueConstraints = @UniqueConstraint(name = "uk_user_codes_code", columnNames = "code")
)
public class UserCode {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "code", nullable = false, length = 100)
    private String code;

    /**
     * The role a successful claim grants. STUDENT is never stored here — a
     * student registration carries no code at all.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    /** Null while the code is unused. Set atomically the moment it is claimed. */
    @Column(name = "used")
    private Instant used;

    /** Which account claimed it. Filled in right after the user row is created. */
    @Column(name = "used_by")
    private UUID usedBy;

    @Column(name = "created", updatable = false, nullable = false)
    private Instant created;

    @PrePersist
    protected void onCreate() {
        created = Instant.now();
    }

    public boolean isUsed() {
        return used != null;
    }
}
