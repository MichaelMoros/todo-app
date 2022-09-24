CREATE DATABASE "Testdb"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
    
CREATE TABLE public.paths
(
    path character varying(10) NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    requireauth boolean NOT NULL DEFAULT false,
    password character varying(256),
    PRIMARY KEY (path),
    CONSTRAINT unique_path UNIQUE (path)
);

ALTER TABLE IF EXISTS public.paths
    OWNER to postgres;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.todos
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    text character varying(256) NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    path_id character varying(10) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_id UNIQUE (id),
    CONSTRAINT fk_path_id FOREIGN KEY (path_id)
        REFERENCES public.paths (path) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.todos
    OWNER to postgres;