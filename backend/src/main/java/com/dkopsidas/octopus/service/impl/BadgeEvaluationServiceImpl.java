package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.entity.CommunityActivity;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.repository.CommunityActivityRepository;
import com.dkopsidas.octopus.repository.CommunityRepository;
import com.dkopsidas.octopus.repository.UserBadgeRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.service.BadgeEvaluationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class BadgeEvaluationServiceImpl implements BadgeEvaluationService {

    private static final int[] CREATOR_TIERS = {25, 50, 100, 300};
    private static final int[] QUIZ_TIERS = {25, 50, 100, 300};
    private static final int[] PERFECT_TIERS = {25, 50, 100, 300};
    private static final int[] NIGHT_OWL_TIERS = {10, 30, 100, 200};

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final CommunityActivityRepository communityActivityRepository;

    @Override
    @Transactional
    public void evaluateQuestionMilestones(UUID userId) {
        if (userId == null) return;
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.isActive()) return;

        List<CommunityRepository.StatsRow> statsList = communityRepository.findStats(List.of(userId));
        if (statsList.isEmpty()) return;
        CommunityRepository.StatsRow stats = statsList.getFirst();

        long questions = stats.getQuestions() != null ? stats.getQuestions() : 0L;
        checkAndAwardTiers(user, "CREATOR", CREATOR_TIERS, questions);
    }

    @Override
    @Transactional
    public void evaluateQuizMilestones(UUID userId) {
        if (userId == null) return;
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.isActive()) return;

        List<CommunityRepository.StatsRow> statsList = communityRepository.findStats(List.of(userId));
        if (statsList.isEmpty()) return;
        CommunityRepository.StatsRow stats = statsList.getFirst();

        long quizzes = stats.getQuizzes() != null ? stats.getQuizzes() : 0L;
        checkAndAwardTiers(user, "QUIZZES", QUIZ_TIERS, quizzes);

        long perfect = stats.getPerfect() != null ? stats.getPerfect() : 0L;
        checkAndAwardTiers(user, "PERFECT", PERFECT_TIERS, perfect);

        long nightOwl = stats.getNightOwl() != null ? stats.getNightOwl() : 0L;
        checkAndAwardTiers(user, "NIGHT_OWL", NIGHT_OWL_TIERS, nightOwl);
    }

    @Override
    @Transactional
    public void recordNewMember(UUID userId) {
        if (userId == null) return;
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.isActive()) return;

        // Ένας OG (πρώτοι 30 χρήστες) έχει μόνο το OG unlock στο feed, αλλιώς θα
        // εμφανιζόταν δύο φορές την ίδια στιγμή: μία ως νέο μέλος και μία ως OG.
        List<CommunityRepository.StatsRow> statsList = communityRepository.findStats(List.of(userId));
        if (!statsList.isEmpty() && Boolean.TRUE.equals(statsList.getFirst().getOg())) {
            awardSingleBadge(user, "OG", 1, user.getCreated());
            return;
        }

        CommunityActivity joinActivity = new CommunityActivity(user, "MEMBER_JOINED", null, null, user.getCreated());
        communityActivityRepository.save(joinActivity);
    }

    /**
     * Δίνει όλα τα tiers που έχουν καλυφθεί, αλλά γράφει μία εγγραφή στο feed για το ψηλότερο νέο tier,
     * ώστε π.χ. ένα import 300 ερωτήσεων να μη γεμίζει το feed με τέσσερις εγγραφές.
     */
    private void checkAndAwardTiers(User user, String badgeCode, int[] thresholds, long currentCount) {
        Instant now = Instant.now();
        int highestNewTier = 0;
        for (int i = 0; i < thresholds.length; i++) {
            int tier = i + 1;
            if (currentCount >= thresholds[i]
                    && userBadgeRepository.insertIfAbsent(user.getId(), badgeCode, tier, now) == 1) {
                highestNewTier = tier;
            }
        }
        if (highestNewTier > 0) {
            recordActivity(user, badgeCode, highestNewTier, now);
        }
    }

    private void awardSingleBadge(User user, String badgeCode, int tier, Instant timestamp) {
        if (userBadgeRepository.insertIfAbsent(user.getId(), badgeCode, tier, timestamp) == 1) {
            recordActivity(user, badgeCode, tier, timestamp);
        }
    }

    private void recordActivity(User user, String badgeCode, int tier, Instant timestamp) {
        String activityType = tier > 1 ? "RANK_UP" : "BADGE_UNLOCK";
        CommunityActivity activity = new CommunityActivity(user, activityType, badgeCode, tier, timestamp);
        communityActivityRepository.save(activity);

        log.info("Awarded badge {} (tier {}) to user {} ({})", badgeCode, tier, user.getId(), user.getUsername());
    }
}
