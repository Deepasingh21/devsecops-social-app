#!/usr/bin/env bash
set -uo pipefail

APP_DIR="/home/ubuntu/devsecops-social-app"

TEST_ROLLBACK="${1:-false}"

cd "$APP_DIR"

PREVIOUS_COMMIT="$(sudo -u ubuntu git -C "$APP_DIR" rev-parse HEAD)"
echo "Previous commit: $PREVIOUS_COMMIT"

sudo -u ubuntu git -C "$APP_DIR" checkout main

if ! sudo -u ubuntu git -C "$APP_DIR" pull origin main; then
    echo "Git pull failed"
    exit 1
fi

echo "Loading production secrets..."
sudo "$APP_DIR/scripts/load-production-secrets.sh"

FAILED=0

echo "Building new version..."

if docker compose build && docker compose up -d; then
    echo "New version started"
else
    echo "New version failed to start"
    FAILED=1
fi

if [ "$FAILED" != "1" ]; then
    echo "Waiting for containers..."
    sleep 10
fi

if [ "$FAILED" != "1" ]; then
    docker compose ps
fi

if [ "$FAILED" != "1" ]; then
    curl -f http://localhost:8080 || FAILED=1
fi

if [ "$FAILED" != "1" ]; then
    curl -f http://localhost:9090/-/healthy || FAILED=1
fi

if [ "$FAILED" != "1" ]; then
    curl -f http://localhost:3000/api/health || FAILED=1
fi

if [ "$FAILED" != "1" ]; then
    curl -f http://localhost:9093/-/healthy || FAILED=1
fi

if [ "$TEST_ROLLBACK" = "true" ] && [ "$FAILED" = "0" ]; then
    echo "CONTROLLED ROLLBACK TEST: intentionally triggering rollback"
    FAILED=1
fi

if [ "$FAILED" = "1" ]; then
    echo "Deployment failed - starting rollback"

    sudo -u ubuntu git -C "$APP_DIR" checkout "$PREVIOUS_COMMIT"

    sudo "$APP_DIR/scripts/load-production-secrets.sh"

    docker compose build
    docker compose up -d

    sleep 10

    docker compose ps

    curl -f http://localhost:8080
    curl -f http://localhost:9090/-/healthy
    curl -f http://localhost:3000/api/health
    curl -f http://localhost:9093/-/healthy

    echo "Rollback successful"

    exit 1
fi

echo "Deployment successful"
