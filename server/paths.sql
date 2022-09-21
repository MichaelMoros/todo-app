CREATE TABLE public.paths
(
    path character varying(10) NOT NULL,
    requireauth boolean NOT NULL DEFAULT false,
    password character varying(256) NOT NULL,
    PRIMARY KEY (path)
    CONSTRAINT uniquePath UNIQUE (path)
);

CREATE TABLE public.todos
(
    id bigserial NOT NULL,
    text character varying(256) NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    path_id character varying NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_path_id FOREIGN KEY (path_id)
        REFERENCES public.paths (path) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
    
);

ALTER TABLE IF EXISTS public.todos
    OWNER to postgres;

ALTER TABLE IF EXISTS public.paths
    OWNER to postgres;