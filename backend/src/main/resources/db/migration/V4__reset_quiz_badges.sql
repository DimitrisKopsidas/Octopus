-- Quiz badges restart on quiz_attempts (CommunityRepository.findStats).
-- Bundles don't store skipped questions, so their scores can't be trusted.
DELETE FROM community_activities WHERE badge_code IN ('QUIZZES', 'PERFECT', 'NIGHT_OWL');
DELETE FROM user_badges WHERE badge_code IN ('QUIZZES', 'PERFECT', 'NIGHT_OWL');
