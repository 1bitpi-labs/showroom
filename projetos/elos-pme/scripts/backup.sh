#!/bin/sh
set -eu
mkdir -p backups
umask 077
backup_file="backups/elos-$(date -u +%Y%m%dT%H%M%SZ).dump"
docker compose -p elos-demo exec -T db pg_dump -U elos -d elos -Fc > "$backup_file"
echo "$backup_file"
