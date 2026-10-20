-- noinspection SqlNoDataSourceInspectionForFile

--
-- PostgreSQL database dump
--


-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answers (
    id bigint NOT NULL,
    is_correct boolean NOT NULL,
    title character varying(255) NOT NULL,
    question_id bigint NOT NULL
);


--
-- Name: answers_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.answers_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    action character varying(255) NOT NULL,
    actor_id uuid,
    actor_username character varying(255),
    details text,
    ip_address character varying(255),
    resource_id character varying(255),
    resource_type character varying(255),
    status character varying(255) NOT NULL,
    "timestamp" timestamp(6) with time zone NOT NULL,
    user_agent character varying(255)
);


--
-- Name: bundle_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bundle_answers (
    bundle_id bigint NOT NULL,
    answer_id bigint NOT NULL
);


--
-- Name: bundles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bundles (
    id bigint NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    score integer NOT NULL,
    set_num integer,
    time_for_completion integer NOT NULL,
    created_by uuid
);


--
-- Name: bundles_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bundles_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_progress (
    id bigint NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    is_favorite boolean NOT NULL,
    is_passed boolean NOT NULL,
    updated timestamp(6) with time zone NOT NULL,
    course_id bigint NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: course_progress_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_progress_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id bigint NOT NULL,
    default_timer_minutes integer NOT NULL,
    name character varying(255) NOT NULL,
    question_set_size integer NOT NULL,
    semester integer NOT NULL,
    updated_at timestamp(6) with time zone
);


--
-- Name: courses_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: crash_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.crash_logs (
    id uuid NOT NULL,
    actor_id uuid,
    actor_username character varying(100),
    exception_class character varying(255) NOT NULL,
    http_method character varying(10),
    ip_address character varying(45),
    message character varying(2000),
    request_uri character varying(500),
    resolved boolean NOT NULL,
    stack_trace text,
    status_code integer,
    "timestamp" timestamp(6) with time zone NOT NULL,
    user_agent character varying(500)
);


--
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.players (
    id uuid NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    updated timestamp(6) with time zone NOT NULL,
    year integer,
    CONSTRAINT players_type_check CHECK (((type)::text = ANY ((ARRAY['STANDARD'::character varying, 'ADMIN'::character varying])::text[])))
);


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id bigint NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    title character varying(510) NOT NULL,
    updated timestamp(6) with time zone NOT NULL,
    course_id bigint NOT NULL,
    image_url character varying(255),
    is_active boolean,
    created_by uuid NOT NULL
);


--
-- Name: questions_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.questions_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id uuid NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    expires_at timestamp(6) with time zone NOT NULL,
    revoked_at timestamp(6) with time zone,
    token_hash character varying(64) NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: user_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_codes (
    id bigint NOT NULL,
    code character varying(100) NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    role character varying(20) NOT NULL,
    used timestamp(6) with time zone,
    used_by uuid,
    CONSTRAINT user_codes_role_check CHECK (((role)::text = ANY ((ARRAY['STUDENT'::character varying, 'HELPER'::character varying, 'ADMIN'::character varying])::text[])))
);


--
-- Name: user_codes_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_codes_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    active boolean NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    display_name character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    updated timestamp(6) with time zone NOT NULL,
    username character varying(255) NOT NULL,
    year integer,
    discord_name character varying(255),
    display_preference character varying(255),
    CONSTRAINT users_display_preference_check CHECK (((display_preference)::text = ANY ((ARRAY['DISPLAY_NAME'::character varying, 'DISCORD_NAME'::character varying])::text[]))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['STUDENT'::character varying, 'HELPER'::character varying, 'ADMIN'::character varying])::text[])))
);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bundles bundles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundles
    ADD CONSTRAINT bundles_pkey PRIMARY KEY (id);


--
-- Name: course_progress course_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: crash_logs crash_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crash_logs
    ADD CONSTRAINT crash_logs_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: course_progress uk_course_progress_user_course; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT uk_course_progress_user_course UNIQUE (user_id, course_id);


--
-- Name: refresh_tokens uk_refresh_tokens_token_hash; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT uk_refresh_tokens_token_hash UNIQUE (token_hash);


--
-- Name: user_codes uk_user_codes_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_codes
    ADD CONSTRAINT uk_user_codes_code UNIQUE (code);


--
-- Name: users uk_users_username; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_users_username UNIQUE (username);


--
-- Name: user_codes user_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_codes
    ADD CONSTRAINT user_codes_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_logs_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_action ON public.audit_logs USING btree (action);


--
-- Name: idx_audit_logs_actor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs USING btree (actor_id);


--
-- Name: idx_audit_logs_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs USING btree ("timestamp");


--
-- Name: idx_crash_logs_exception_class; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_crash_logs_exception_class ON public.crash_logs USING btree (exception_class);


--
-- Name: idx_crash_logs_resolved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_crash_logs_resolved ON public.crash_logs USING btree (resolved);


--
-- Name: idx_crash_logs_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_crash_logs_timestamp ON public.crash_logs USING btree ("timestamp");


--
-- Name: idx_refresh_tokens_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_tokens_expires_at ON public.refresh_tokens USING btree (expires_at);


--
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id);


--
-- Name: refresh_tokens fk1lih5y2npsf8u5o3vhdb9y0os; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT fk1lih5y2npsf8u5o3vhdb9y0os FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: answers fk3erw1a3t0r78st8ty27x6v3g1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk3erw1a3t0r78st8ty27x6v3g1 FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: course_progress fk3h5cnaawt3y91eeaaloat1swr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT fk3h5cnaawt3y91eeaaloat1swr FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: questions fk6y78pbrt5dxp12ljsa8r1ey82; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk6y78pbrt5dxp12ljsa8r1ey82 FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: questions fk_questions_created_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_questions_created_by FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: bundle_answers fka4v8fqq42g6cquywr2ewqaoiq; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_answers
    ADD CONSTRAINT fka4v8fqq42g6cquywr2ewqaoiq FOREIGN KEY (bundle_id) REFERENCES public.bundles(id);


--
-- Name: bundles fkhmds4sr61tu12wpmx5jwe0cnl; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundles
    ADD CONSTRAINT fkhmds4sr61tu12wpmx5jwe0cnl FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: course_progress fkmootcccgd4bqe8cjtma7stkp1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT fkmootcccgd4bqe8cjtma7stkp1 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: bundle_answers fknq65rb6o2vvkq5wx11c5ptosg; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_answers
    ADD CONSTRAINT fknq65rb6o2vvkq5wx11c5ptosg FOREIGN KEY (answer_id) REFERENCES public.answers(id);


--
-- PostgreSQL database dump complete
--


