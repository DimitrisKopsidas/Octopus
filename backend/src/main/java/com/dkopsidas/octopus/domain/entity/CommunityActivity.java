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
@Table(name = "community_activities")
public class CommunityActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "type", nullable = false, length = 32)
    private String type; // 'RANK_UP', 'BADGE_UNLOCK', 'MEMBER_JOINED'

    @Column(name = "badge_code", length = 32)
    private String badgeCode;

    @Column(name = "tier")
    private Integer tier;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public CommunityActivity(User user, String type, String badgeCode, Integer tier, Instant createdAt) {
        this.user = user;
        this.type = type;
        this.badgeCode = badgeCode;
        this.tier = tier;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
