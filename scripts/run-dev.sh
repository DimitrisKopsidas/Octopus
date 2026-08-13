#!/bin/bash
set -e  # Exit if any command fails

cd "$(dirname "$0")/.."

echo "Starting development instance with pgAdmin4..."
docker compose -f docker-compose.dev.yml up -d --build
echo "Development stack is running!"
echo "Frontend: http://localhost:80"
echo "Backend API: http://localhost:8080"
echo "pgAdmin4: http://localhost:5050 (admin@octopus.dev / admin)"
