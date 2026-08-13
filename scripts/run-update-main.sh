#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Updating to main branch..."
git checkout main
echo "Pulling latest changes..."
git pull --ff-only
echo "Building and starting containers..."
docker compose up -d --build
echo "Update complete!"