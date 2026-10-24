#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="${SCRIPT_DIR}/seed-test-data.sql"

echo "Seeding Octopus database in Docker container 'octopus-dev-db-1'..."

if [ ! -f "$SQL_FILE" ]; then
    echo "Error: Could not find $SQL_FILE"
    exit 1
fi

docker cp "$SQL_FILE" octopus-dev-db-1:/tmp/seed-test-data.sql
docker exec octopus-dev-db-1 psql -U postgres -d postgres -f /tmp/seed-test-data.sql

echo ""
echo "Seeding completed successfully!"
echo "10 Users created (password: password123):"
echo "  - 2 Admins:   admin_alex, admin_eleni"
echo "  - 3 Helpers:  helper_nikos, helper_maria, helper_kostas"
echo "  - 5 Students: student_giannis, student_dimitra, student_petros, student_sofia, student_giorgos"
echo "Each user has 5 completed tests (50 total bundles) across courses."
