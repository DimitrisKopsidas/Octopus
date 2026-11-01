-- V2: User Badges and Community Activities

-- 1. Table: user_badges (State of earned badges and tiers)
CREATE TABLE public.user_badges (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    badge_code character varying(32) NOT NULL,
    tier integer NOT NULL DEFAULT 1,
    unlocked_at timestamp(6) with time zone NOT NULL DEFAULT NOW(),
    seen boolean NOT NULL DEFAULT false,
    CONSTRAINT user_badges_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user_badges_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_badge_tier UNIQUE (user_id, badge_code, tier)
);

CREATE INDEX idx_user_badges_user ON public.user_badges (user_id);
CREATE INDEX idx_user_badges_unlocked_at ON public.user_badges (unlocked_at DESC);

-- 2. Table: community_activities (Stream of user milestones)
CREATE TABLE public.community_activities (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    type character varying(32) NOT NULL, -- 'RANK_UP', 'BADGE_UNLOCK', 'MEMBER_JOINED'
    badge_code character varying(32),
    tier integer,
    created_at timestamp(6) with time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT community_activities_pkey PRIMARY KEY (id),
    CONSTRAINT fk_community_activities_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_community_activities_created_at ON public.community_activities (created_at DESC);
CREATE INDEX idx_community_activities_type ON public.community_activities (type, created_at DESC);

-- 3. Backfill Initial Badges

-- OG Badges (first 30 users)
INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), u.id, 'OG', 1, u.created, true
FROM (SELECT id, created FROM public.users ORDER BY created, id LIMIT 30) u
ON CONFLICT DO NOTHING;

-- FOUNDER Badges
INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), u.id, 'FOUNDER', 1, u.created, true
FROM public.users u
-- μόνο με username, ίδια λίστα με το FOUNDERS στο frontend (lib/badges.js)
WHERE lower(u.username) IN ('dimitriskopsidas', 'rets')
ON CONFLICT DO NOTHING;

-- CREATOR Badges (25, 50, 100, 300)
INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), q.created_by, 'CREATOR', 1, MIN(q.created), true
FROM (
    SELECT created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created ASC) as rn
    FROM public.questions
    WHERE is_active = true AND created_by IS NOT NULL
) q
WHERE q.rn >= 25
GROUP BY q.created_by
ON CONFLICT DO NOTHING;

INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), q.created_by, 'CREATOR', 2, MIN(q.created), true
FROM (
    SELECT created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created ASC) as rn
    FROM public.questions
    WHERE is_active = true AND created_by IS NOT NULL
) q
WHERE q.rn >= 50
GROUP BY q.created_by
ON CONFLICT DO NOTHING;

INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), q.created_by, 'CREATOR', 3, MIN(q.created), true
FROM (
    SELECT created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created ASC) as rn
    FROM public.questions
    WHERE is_active = true AND created_by IS NOT NULL
) q
WHERE q.rn >= 100
GROUP BY q.created_by
ON CONFLICT DO NOTHING;

INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), q.created_by, 'CREATOR', 4, MIN(q.created), true
FROM (
    SELECT created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created ASC) as rn
    FROM public.questions
    WHERE is_active = true AND created_by IS NOT NULL
) q
WHERE q.rn >= 300
GROUP BY q.created_by
ON CONFLICT DO NOTHING;

-- QUIZZES Badges (25, 50, 100, 300)
INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), b.created_by, 'QUIZZES', 1, MIN(b.created), true
FROM (
    SELECT created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created ASC) as rn
    FROM public.bundles
    WHERE created_by IS NOT NULL
) b
WHERE b.rn >= 25
GROUP BY b.created_by
ON CONFLICT DO NOTHING;

INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), b.created_by, 'QUIZZES', 2, MIN(b.created), true
FROM (
    SELECT created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created ASC) as rn
    FROM public.bundles
    WHERE created_by IS NOT NULL
) b
WHERE b.rn >= 50
GROUP BY b.created_by
ON CONFLICT DO NOTHING;

-- QUIZZES tiers 3-4, PERFECT και NIGHT_OWL (ίδια όρια και κανόνες με BadgeEvaluationServiceImpl
-- και CommunityRepository.findStats). unlocked_at = το quiz που πέρασε το όριο.
WITH b AS (
    SELECT b.id, b.created_by, b.created, b.score, COUNT(ba.answer_id) AS answered
    FROM public.bundles b LEFT JOIN public.bundle_answers ba ON ba.bundle_id = b.id
    WHERE b.created_by IS NOT NULL
    GROUP BY b.id
),
counted AS (
    SELECT 'QUIZZES' AS code, created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created) AS rn
    FROM b
    UNION ALL
    SELECT 'PERFECT', created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created)
    FROM b WHERE answered >= 1 AND score >= answered
    UNION ALL
    SELECT 'NIGHT_OWL', created_by, created,
           ROW_NUMBER() OVER (PARTITION BY created_by ORDER BY created)
    FROM b WHERE EXTRACT(HOUR FROM created AT TIME ZONE 'Europe/Athens') BETWEEN 2 AND 4
),
thresholds (code, tier, min_count) AS (
    VALUES ('QUIZZES', 3, 100), ('QUIZZES', 4, 300),
           ('PERFECT', 1, 25), ('PERFECT', 2, 50), ('PERFECT', 3, 100), ('PERFECT', 4, 300),
           ('NIGHT_OWL', 1, 10), ('NIGHT_OWL', 2, 30), ('NIGHT_OWL', 3, 100), ('NIGHT_OWL', 4, 200)
)
INSERT INTO public.user_badges (id, user_id, badge_code, tier, unlocked_at, seen)
SELECT gen_random_uuid(), c.created_by, t.code, t.tier, c.created, true
FROM counted c
JOIN thresholds t ON t.code = c.code AND c.rn = t.min_count
ON CONFLICT DO NOTHING;

-- 4. Backfill Initial Community Activities
-- Member Joined
INSERT INTO public.community_activities (id, user_id, type, badge_code, tier, created_at)
SELECT gen_random_uuid(), u.id, 'MEMBER_JOINED', NULL, NULL, u.created
FROM public.users u
WHERE u.active = true
  -- οι OG έχουν ως εγγραφή εισόδου το OG unlock παρακάτω, όχι δεύτερη εγγραφή την ίδια στιγμή
  AND NOT EXISTS (SELECT 1 FROM public.user_badges ub WHERE ub.user_id = u.id AND ub.badge_code = 'OG');

-- Badge Unlocks and Rank-ups
INSERT INTO public.community_activities (id, user_id, type, badge_code, tier, created_at)
SELECT gen_random_uuid(), ub.user_id,
       CASE WHEN ub.tier > 1 THEN 'RANK_UP' ELSE 'BADGE_UNLOCK' END,
       ub.badge_code, ub.tier, ub.unlocked_at
FROM public.user_badges ub;
