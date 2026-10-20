-- Sequence note:
-- Rows need unique ID, sequence is the counter that keeps track of them and makes sure 2 writes don't add the same id.
-- 50 is the reserves it makes at a time and keeps them in memory.

CREATE TABLE quizzes (
    id        bigint PRIMARY KEY,
    course_id bigint  NOT NULL REFERENCES courses(id),
    set_num   integer NOT NULL,
    created   timestamp(6) with time zone NOT NULL,
    updated   timestamp(6) with time zone NOT NULL,
    CONSTRAINT uk_quizzes_course_set UNIQUE (course_id, set_num)
);

CREATE SEQUENCE quizzes_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE quiz_questions (
    quiz_id     bigint  NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id bigint  NOT NULL REFERENCES questions(id),
    position    integer NOT NULL,
    PRIMARY KEY (quiz_id, position)
);

CREATE TABLE quiz_attempts (
    id             bigint PRIMARY KEY,
    user_id        uuid   REFERENCES users(id),
    course_id      bigint NOT NULL REFERENCES courses(id),
    quiz_id        bigint REFERENCES quizzes(id) ON DELETE SET NULL,   -- null = custom size quizes / quizes that no longer exist
    question_count integer NOT NULL,
    correct_count  integer,                                            -- null until submitted
    started_at     timestamp(6) with time zone NOT NULL,
    finished_at    timestamp(6) with time zone                         -- null = in progress / abandoned
);
CREATE SEQUENCE quiz_attempts_seq START WITH 1 INCREMENT BY 50;
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_course_id ON quiz_attempts(course_id);

-- Every question served in an attempt, answered or not
CREATE TABLE attempt_questions (
    id          bigint PRIMARY KEY,
    attempt_id  bigint  NOT NULL REFERENCES quiz_attempts(id),
    question_id bigint  NOT NULL REFERENCES questions(id),
    position    integer NOT NULL,
    is_correct  boolean,                            -- null until submitted
    CONSTRAINT uk_attempt_questions_attempt_question UNIQUE (attempt_id, question_id)
);
CREATE SEQUENCE attempt_questions_seq START WITH 1 INCREMENT BY 50;
CREATE INDEX idx_attempt_questions_question_id ON attempt_questions(question_id);

-- Answers the user picked
CREATE TABLE attempt_answers (
    attempt_question_id bigint NOT NULL REFERENCES attempt_questions(id),
    answer_id           bigint NOT NULL REFERENCES answers(id),
    PRIMARY KEY (attempt_question_id, answer_id)
);

-- When a question is inactive, it's answers should also become inactive
ALTER TABLE answers ADD COLUMN is_active boolean NOT NULL DEFAULT true;