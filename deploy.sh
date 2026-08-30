#!/bin/bash

set -e

echo "===== Starting deployment ====="

cd ~/devsecops-social-app

echo "===== Updating application code ====="
git fetch origin main
git reset --hard origin/main

echo "===== Building and starting containers ====="
docker compose up -d --build

echo "===== Waiting for backend health check ====="

for i in {1..12}; do
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' devsecops-backend 2>/dev/null || echo "starting")

    echo "Backend status: $STATUS"

    if [ "$STATUS" = "healthy" ]; then
        echo "===== Deployment successful ====="
        docker compose ps
        exit 0
    fi

    sleep 5
done

echo "===== Deployment failed: backend did not become healthy ====="
docker compose ps
docker compose logs backend --tail=50

exit 1
