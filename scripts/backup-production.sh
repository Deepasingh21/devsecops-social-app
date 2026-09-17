#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/home/ubuntu/devsecops-social-app"
ENV_FILE="$APP_DIR/backend/.env.docker"

S3_BUCKET="deepadevops-social-app-backups-048249931281"

BACKUP_DATE="$(date -u +%Y-%m-%d_%H-%M-%S)"
WORK_DIR="/tmp/devsecops-backup-$BACKUP_DATE"
MONGO_DIR="$WORK_DIR/mongodb"
MONGO_ARCHIVE="$WORK_DIR/mongodb-backup-$BACKUP_DATE.tar.gz"
UPLOAD_ARCHIVE="$WORK_DIR/uploads-backup-$BACKUP_DATE.tar.gz"

mkdir -p "$MONGO_DIR"

cleanup() {
    rm -rf "$WORK_DIR"
}
trap cleanup EXIT

echo "========================================"
echo "DevSecOps Production Backup"
echo "Started: $(date -u)"
echo "========================================"

# ----------------------------------------
# Load MongoDB URI without printing it
# ----------------------------------------

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: Production environment file not found."
    exit 1
fi

MONGO_URI="$(grep '^MONGODB_URI=' "$ENV_FILE" | cut -d= -f2-)"

if [ -z "$MONGO_URI" ]; then
    echo "ERROR: MONGODB_URI not found."
    exit 1
fi

# ----------------------------------------
# MongoDB backup
# ----------------------------------------

echo "Creating MongoDB backup..."

mongodump \
    --uri="$MONGO_URI" \
    --out="$MONGO_DIR" \
    --gzip

tar -czf "$MONGO_ARCHIVE" \
    -C "$MONGO_DIR" .

echo "MongoDB archive created:"
ls -lh "$MONGO_ARCHIVE"

# ----------------------------------------
# Upload MongoDB backup to S3
# ----------------------------------------

echo "Uploading MongoDB backup..."

aws s3 cp \
    "$MONGO_ARCHIVE" \
    "s3://$S3_BUCKET/mongodb/$BACKUP_DATE/"

# ----------------------------------------
# Application uploads backup
# ----------------------------------------

echo "Creating application uploads backup..."

sudo tar -czf "$UPLOAD_ARCHIVE" \
    -C /var/lib/docker/volumes/devsecops-uploads/_data .

echo "Uploads archive created:"
ls -lh "$UPLOAD_ARCHIVE"

# ----------------------------------------
# Upload uploads backup to S3
# ----------------------------------------

echo "Uploading application uploads backup..."

aws s3 cp \
    "$UPLOAD_ARCHIVE" \
    "s3://$S3_BUCKET/uploads/$BACKUP_DATE/"

# ----------------------------------------
# Verify S3 objects
# ----------------------------------------

echo "Verifying MongoDB backup..."

aws s3 ls \
    "s3://$S3_BUCKET/mongodb/$BACKUP_DATE/"

echo "Verifying uploads backup..."

aws s3 ls \
    "s3://$S3_BUCKET/uploads/$BACKUP_DATE/"

echo "========================================"
echo "BACKUP SUCCESSFUL"
echo "Completed: $(date -u)"
echo "========================================"
