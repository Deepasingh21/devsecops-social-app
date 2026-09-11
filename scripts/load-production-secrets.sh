#!/usr/bin/env bash
set -euo pipefail

SECRET_ID="devsecops/social-app/production"
ENV_FILE="/home/ubuntu/devsecops-social-app/backend/.env.docker"

SECRET_STRING="$(aws secretsmanager get-secret-value \
  --secret-id "$SECRET_ID" \
  --region ap-south-1 \
  --query 'SecretString' \
  --output text)"

python3 - "$SECRET_STRING" "$ENV_FILE" <<'PY'
import json
import sys

secret_string = sys.argv[1]
env_file = sys.argv[2]

data = json.loads(secret_string)

required = {
    "MONGODB_URI",
    "JWT_SECRET",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM",
    "FRONTEND_URL",
}

missing = required - data.keys()

if missing:
    raise SystemExit(
        f"Missing required secrets: {', '.join(sorted(missing))}"
    )

with open(env_file, "w") as f:
    for key, value in data.items():
        f.write(f"{key}={value}\n")
PY

chmod 600 "$ENV_FILE"

echo "Production secrets loaded successfully."
