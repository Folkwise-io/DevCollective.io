CREATE USER mintbean WITH PASSWORD 'password';
ALTER USER mintbean CREATEDB;
ALTER USER mintbean SUPERUSER;

DROP DATABASE IF EXISTS mintbean_v4;
CREATE DATABASE mintbean_v4;
\c mintbean_v4;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER DATABASE mintbean_v4 OWNER TO mintbean;
GRANT ALL PRIVILEGES ON DATABASE mintbean_v4 TO mintbean;

DROP DATABASE IF EXISTS mintbean_test_v4;
CREATE DATABASE mintbean_test_v4;
\c mintbean_test_v4;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER DATABASE mintbean_test_v4 OWNER TO mintbean;
GRANT ALL PRIVILEGES ON DATABASE mintbean_test_v4 TO mintbean;
