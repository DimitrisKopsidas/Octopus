package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.UUID;

/**
 * A single-use invite code that upgrades a registration from STUDENT to HELPER.
 * <p>
 * Availability is derived from {@code usedAt} rather than a separate boolean
 * flag: one field cannot contradict itself. {@code usedAt == null} means the
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
