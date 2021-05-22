#!/bin/bash

docker exec -t mintbean-database psql -U postgres -f /docker-entrypoint-initdb.d/init.sql;
