-- Ids are uuid, generated in Java (@GeneratedValue(strategy = GenerationType.UUID)), so no sequences.
-- Attempt ids must be unguessable: guests own an attempt only by knowing its id.

CREATE TABLE quizzes (
    id        uuid PRIMARY KEY,
    course_id bigint  NOT NULL REFERENCES courses(id),
    set_num   integer NOT NULL,
    created   timestamp(6) with time zone NOT NULL,
    updated   timestamp(6) with time zone NOT NULL,
    CONSTRAINT uk_quizzes_course_set UNIQUE (course_id, set_num)
);

CREATE TABLE quiz_questions (
    quiz_id     uuid    NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id bigint  NOT NULL REFERENCES questions(id),
    position    integer NOT NULL,
    PRIMARY KEY (quiz_id, position),
    -- deferred: shifting positions after removing a question briefly puts one question at two positions
    CONSTRAINT uk_quiz_questions_quiz_question UNIQUE (quiz_id, question_id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE quiz_attempts (
    id             uuid   PRIMARY KEY,
    user_id        uuid   REFERENCES users(id),                       -- null = guest
    course_id      bigint NOT NULL REFERENCES courses(id),
    quiz_id        uuid   REFERENCES quizzes(id) ON DELETE SET NULL,  -- null = custom size quiz / quiz that no longer exists
    set_num        integer,                                           -- copy of quizzes.set_num, survives quiz deletion; null = custom
    question_count integer NOT NULL,
    correct_count  integer,                                           -- null until submitted
    started_at     timestamp(6) with time zone NOT NULL,
    finished_at    timestamp(6) with time zone,                       -- null = in progress / abandoned
    CONSTRAINT ck_attempt_submitted CHECK ((finished_at IS NULL) = (correct_count IS NULL)),
    CONSTRAINT ck_attempt_score     CHECK (correct_count BETWEEN 0 AND question_count)
);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_course_id ON quiz_attempts(course_id);

-- Every question served in an attempt, answered or not
CREATE TABLE attempt_questions (
    id          uuid    PRIMARY KEY,
    attempt_id  uuid    NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,  -- deleting abandoned attempts removes their rows
    question_id bigint  NOT NULL REFERENCES questions(id),
    position    integer NOT NULL,
    is_correct  boolean,                            -- null until submitted
    CONSTRAINT uk_attempt_questions_attempt_question UNIQUE (attempt_id, question_id),
    CONSTRAINT uk_attempt_questions_attempt_position UNIQUE (attempt_id, position)
);
CREATE INDEX idx_attempt_questions_question_id ON attempt_questions(question_id);

-- Answers the user picked
CREATE TABLE attempt_answers (
    attempt_question_id uuid   NOT NULL REFERENCES attempt_questions(id) ON DELETE CASCADE,
    answer_id           bigint NOT NULL REFERENCES answers(id),
    PRIMARY KEY (attempt_question_id, answer_id)
);

-- false = answer replaced by an edit; kept so attempt history still points at it
ALTER TABLE answers ADD COLUMN is_active boolean NOT NULL DEFAULT true;
