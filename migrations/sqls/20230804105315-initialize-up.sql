-- Table: public.migrationdb

-- DROP TABLE IF EXISTS public.migrationdb;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer,
    name character varying(100) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;