--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Homebrew)
-- Dumped by pg_dump version 16.9 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attachments; Type: TABLE; Schema: public; Owner: Bartek
--

CREATE TABLE public.attachments (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    ticket_id uuid NOT NULL,
    comment_id uuid,
    file_url text NOT NULL,
    file_name text,
    mime_type text,
    size_bytes bigint,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.attachments OWNER TO "Bartek";

--
-- Name: email_messages; Type: TABLE; Schema: public; Owner: Bartek
--

CREATE TABLE public.email_messages (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    ticket_id uuid NOT NULL,
    message_id text,
    in_reply_to text,
    raw_headers text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.email_messages OWNER TO "Bartek";

--
-- Name: nessie_migrations; Type: TABLE; Schema: public; Owner: Bartek
--

CREATE TABLE public.nessie_migrations (
    id bigint NOT NULL,
    file_name character varying(100),
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.nessie_migrations OWNER TO "Bartek";

--
-- Name: nessie_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: Bartek
--

CREATE SEQUENCE public.nessie_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nessie_migrations_id_seq OWNER TO "Bartek";

--
-- Name: nessie_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Bartek
--

ALTER SEQUENCE public.nessie_migrations_id_seq OWNED BY public.nessie_migrations.id;


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: Bartek
--

CREATE TABLE public.tenants (
    id uuid NOT NULL,
    name text NOT NULL,
    domain text,
    email_alias text,
    ticket_prefix text DEFAULT 'TCK'::text,
    plan text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tenants OWNER TO "Bartek";

--
-- Name: ticket_comments; Type: TABLE; Schema: public; Owner: Bartek
--

CREATE TABLE public.ticket_comments (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    ticket_id uuid NOT NULL,
    created_by uuid,
    body text,
    is_internal boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ticket_comments OWNER TO "Bartek";

--
-- Name: tickets; Type: TABLE; Schema: public; Owner: Bartek
--

CREATE TABLE public.tickets (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    public_id bigint NOT NULL,
    subject text NOT NULL,
    description text,
    status text DEFAULT 'open'::text,
    priority text DEFAULT 'medium'::text,
    created_by uuid,
    assigned_to uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT tickets_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))),
    CONSTRAINT tickets_status_check CHECK ((status = ANY (ARRAY['open'::text, 'pending'::text, 'resolved'::text, 'closed'::text])))
);


ALTER TABLE public.tickets OWNER TO "Bartek";

--
-- Name: users; Type: TABLE; Schema: public; Owner: Bartek
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name text,
    email text NOT NULL,
    role text DEFAULT 'customer'::text NOT NULL,
    password_hash text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['customer'::text, 'agent'::text, 'admin'::text])))
);


ALTER TABLE public.users OWNER TO "Bartek";

--
-- Name: nessie_migrations id; Type: DEFAULT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.nessie_migrations ALTER COLUMN id SET DEFAULT nextval('public.nessie_migrations_id_seq'::regclass);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: email_messages email_messages_message_id_key; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.email_messages
    ADD CONSTRAINT email_messages_message_id_key UNIQUE (message_id);


--
-- Name: email_messages email_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.email_messages
    ADD CONSTRAINT email_messages_pkey PRIMARY KEY (id);


--
-- Name: nessie_migrations nessie_migrations_file_name_key; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.nessie_migrations
    ADD CONSTRAINT nessie_migrations_file_name_key UNIQUE (file_name);


--
-- Name: nessie_migrations nessie_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.nessie_migrations
    ADD CONSTRAINT nessie_migrations_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_domain_key; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_domain_key UNIQUE (domain);


--
-- Name: tenants tenants_email_alias_key; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_email_alias_key UNIQUE (email_alias);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: ticket_comments ticket_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT ticket_comments_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_tenant_id_public_id_key; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_tenant_id_public_id_key UNIQUE (tenant_id, public_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_tenant_id_email_key; Type: CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tenant_id_email_key UNIQUE (tenant_id, email);


--
-- Name: idx_attachments_ticket; Type: INDEX; Schema: public; Owner: Bartek
--

CREATE INDEX idx_attachments_ticket ON public.attachments USING btree (ticket_id);


--
-- Name: idx_comments_ticket; Type: INDEX; Schema: public; Owner: Bartek
--

CREATE INDEX idx_comments_ticket ON public.ticket_comments USING btree (ticket_id);


--
-- Name: idx_email_message_id; Type: INDEX; Schema: public; Owner: Bartek
--

CREATE INDEX idx_email_message_id ON public.email_messages USING btree (message_id);


--
-- Name: idx_tickets_tenant; Type: INDEX; Schema: public; Owner: Bartek
--

CREATE INDEX idx_tickets_tenant ON public.tickets USING btree (tenant_id);


--
-- Name: attachments attachments_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.ticket_comments(id) ON DELETE CASCADE;


--
-- Name: attachments attachments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: attachments attachments_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: email_messages email_messages_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.email_messages
    ADD CONSTRAINT email_messages_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: email_messages email_messages_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.email_messages
    ADD CONSTRAINT email_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: ticket_comments ticket_comments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT ticket_comments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: ticket_comments ticket_comments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT ticket_comments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: ticket_comments ticket_comments_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT ticket_comments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: tickets tickets_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tickets tickets_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tickets tickets_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: users users_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Bartek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

