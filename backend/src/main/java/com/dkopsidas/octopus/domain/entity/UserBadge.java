package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "user_badges",
        uniqueConstraints = @UniqueConstraint(name = "uq_user_badge_tier", columnNames = {"user_id", "badge_code", "tier"})
)
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "badge_code", nullable = false, length = 32)
    private String badgeCode;

    @Column(name = "tier", nullable = false)
    private int tier = 1;

    @Column(name = "unlocked_at", nullable = false)
    private Instant unlockedAt;

    @Column(name = "seen", nullable = false)
    private boolean seen = false;

    public UserBadge(User user, String badgeCode, int tier, Instant unlockedAt) {
        this.user = user;
        this.badgeCode = badgeCode;
        this.tier = tier;
        this.unlockedAt = unlockedAt != null ? unlockedAt : Instant.now();
        this.seen = false;
    }

    @PrePersist
    protected void onCreate() {
        if (unlockedAt == null) {
            unlockedAt = Instant.now();
        }
    }
}
