package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {

    List<UserBadge> findByUserId(UUID userId);

    List<UserBadge> findByUserIdIn(Collection<UUID> userIds);

    boolean existsByUserIdAndBadgeCodeAndTier(UUID userId, String badgeCode, int tier);

    List<UserBadge> findByUserIdAndSeenFalse(UUID userId);

    /**
     * Inserts the badge unless the user already has it. Returns 1 if it was inserted, 0 otherwise.
     * ON CONFLICT instead of exists-then-save, so two requests racing for the same badge
     * can't hit the unique constraint and roll back the quiz/question that triggered them.
     */
    @Modifying
    @Query(value = """
            INSERT INTO user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
            VALUES (gen_random_uuid(), :userId, :badgeCode, :tier, :unlockedAt, false)
            ON CONFLICT (user_id, badge_code, tier) DO NOTHING
            """, nativeQuery = true)
    int insertIfAbsent(@Param("userId") UUID userId, @Param("badgeCode") String badgeCode,
                       @Param("tier") int tier, @Param("unlockedAt") Instant unlockedAt);
}
