#!/bin/sh
set -eu
# Isolated test database, never truncate the demo/customer database.
docker compose -p elos-demo exec -T db sh -c 'psql -U elos -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '\''elos_test'\''" | grep -q 1 || createdb -U elos elos_test'
export DATABASE_URL=postgres://elos:elos_local_only@127.0.0.1:55439/elos_test
node --env-file=.env.local --import tsx scripts/migrate.ts
node --env-file=.env.local --import tsx --test tests/*.test.ts
