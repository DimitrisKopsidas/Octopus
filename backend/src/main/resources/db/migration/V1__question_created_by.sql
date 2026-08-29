-- Question.createdBy for databases that already hold questions.
--
-- On a fresh database this file does nothing: Hibernate creates `questions`
-- from the entity with created_by NOT NULL already in place, and Flyway runs
-- before Hibernate, so the table does not exist yet when this executes.
--
-- It only has work to do on a database that already has rows, where ddl-auto
-- cannot add a NOT NULL column because it has no value for the existing ones.
-- That failure is logged as a warning and the application still starts, which
-- is how it reached production unnoticed.
--
-- Every step is guarded, so the file is a no-op on production, where these
-- exact statements were applied by hand during the incident.

DO $$
DECLARE
    fallback_author uuid;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = current_schema() AND table_name = 'questions'
    ) THEN
        RETURN;
    END IF;

    ALTER TABLE questions ADD COLUMN IF NOT EXISTS created_by uuid;

    -- Existing questions predate the column, so they are credited to the oldest
    -- admin of whatever database this runs against. Looked up rather than
    -- hardcoded: a UUID from one environment does not exist in the others.
    IF EXISTS (SELECT 1 FROM questions WHERE created_by IS NULL) THEN
        SELECT id INTO fallback_author
        FROM users
        WHERE role = 'ADMIN'
        ORDER BY created
        LIMIT 1;

        IF fallback_author IS NULL THEN
            RAISE EXCEPTION
                'Cannot backfill questions.created_by: this database has questions but no ADMIN user';
        END IF;

        EXECUTE 'UPDATE questions SET created_by = $1 WHERE created_by IS NULL'
            USING fallback_author;
    END IF;

    EXECUTE 'ALTER TABLE questions ALTER COLUMN created_by SET NOT NULL';

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_questions_created_by'
    ) THEN
        ALTER TABLE questions
            ADD CONSTRAINT fk_questions_created_by
            FOREIGN KEY (created_by) REFERENCES users(id);
    END IF;
END $$;
