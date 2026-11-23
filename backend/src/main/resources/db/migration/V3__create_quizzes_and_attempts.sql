-- noinspection SqlNoDataSourceInspectionForFile

-- Ids are uuid, generated in Java (@GeneratedValue(strategy = GenerationType.UUID)), so no sequences.
-- Attempt ids must be unguessable: guests own an attempt only by knowing its id.

CREATE TABLE quizzes (
    id        uuid PRIMARY KEY,
    course_id bigint  NOT NULL REFERENCES courses(id),
    exam_type varchar(16) NOT NULL,
    set_num   integer NOT NULL,
    created   timestamp(6) with time zone NOT NULL,
    updated   timestamp(6) with time zone NOT NULL,
    CONSTRAINT ck_quizzes_exam_type CHECK (exam_type IN ('EXAM', 'MIDTERM')),
    CONSTRAINT uk_quizzes_course_type_set UNIQUE (course_id, exam_type, set_num)
);

CREATE TABLE quiz_questions (
    quiz_id     uuid    NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id bigint  NOT NULL REFERENCES questions(id),
    position    integer NOT NULL,
    PRIMARY KEY (quiz_id, position),
    -- deferred: shifting positions after removing a question briefly puts one question at two positions
    CONSTRAINT uk_quiz_questions_quiz_question UNIQUE (quiz_id, question_id) DEFERRABLE INITIALLY DEFERRED
);
CREATE INDEX idx_quiz_questions_question_id ON quiz_questions(question_id);

CREATE TABLE quiz_attempts (
    id             uuid   PRIMARY KEY,
    user_id        uuid   REFERENCES users(id),                       -- null = guest
    course_id      bigint NOT NULL REFERENCES courses(id),
    quiz_id        uuid   REFERENCES quizzes(id) ON DELETE SET NULL,  -- null = custom size quiz / quiz that no longer exists
    exam_type      varchar(16) NOT NULL,                              -- question pool used; set for custom quizzes too
    set_num        integer,                                           -- copy of quizzes.set_num, survives quiz deletion; null = custom
    question_count integer NOT NULL,
    correct_count  integer,                                           -- null until submitted
    started_at     timestamp(6) with time zone NOT NULL,
    finished_at    timestamp(6) with time zone,                       -- null = in progress / abandoned
    expires_at     timestamp(6) with time zone,                       -- submit deadline, set at start; null = no timer
    CONSTRAINT ck_attempt_expires   CHECK (expires_at > started_at),
    CONSTRAINT ck_attempt_exam_type CHECK (exam_type IN ('EXAM', 'MIDTERM')),
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

-- Every answer option served with a question; is_selected = the user picked it
CREATE TABLE attempt_answers (
    attempt_question_id uuid    NOT NULL REFERENCES attempt_questions(id) ON DELETE CASCADE,
    answer_id           bigint  NOT NULL REFERENCES answers(id),
    is_selected         boolean NOT NULL DEFAULT false,
    PRIMARY KEY (attempt_question_id, answer_id)
);

-- false = answer replaced by an edit; kept so attempt history still points at it
ALTER TABLE answers ADD COLUMN is_active boolean NOT NULL DEFAULT true;

-- EXAM = final exam question, MIDTERM = proodos question; existing rows become EXAM
ALTER TABLE questions
    ADD COLUMN exam_type varchar(16) NOT NULL DEFAULT 'EXAM',
    ADD CONSTRAINT ck_questions_exam_type CHECK (exam_type IN ('EXAM', 'MIDTERM'));
CREATE INDEX idx_questions_course_exam_type ON questions (course_id, exam_type);

-- V1 left is_active nullable; queries already count only is_active = true, so null means inactive
UPDATE questions SET is_active = false WHERE is_active IS NULL;
ALTER TABLE questions ALTER COLUMN is_active SET NOT NULL;
