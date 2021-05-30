\set ON_ERROR_STOP on

DO
$do$
BEGIN
  IF NOT EXISTS(
    SELECT FROM pg_catalog.pg_roles
    WHERE rolname = 'mintbean') 
  THEN
    CREATE USER mintbean WITH PASSWORD 'password';
  END IF;
END
$do$;

ALTER USER mintbean CREATEDB;
ALTER USER mintbean SUPERUSER;

DROP DATABASE IF EXISTS mintbean_v4;
CREATE DATABASE mintbean_v4;
\c mintbean_v4;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER DATABASE mintbean_v4 OWNER TO mintbean;
GRANT ALL PRIVILEGES ON DATABASE mintbean_v4 TO mintbean;

DROP DATABASE IF EXISTS mintbean_v4_test;
CREATE DATABASE mintbean_v4_test;
\c mintbean_v4_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER DATABASE mintbean_v4_test OWNER TO mintbean;
GRANT ALL PRIVILEGES ON DATABASE mintbean_v4_test TO mintbean;
