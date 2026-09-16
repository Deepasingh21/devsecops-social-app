#!/usr/bin/env bash
set -euo pipefail

SECRET_ID="devsecops/social-app/production"
ENV_FILE="/home/ubuntu/devsecops-social-app/backend/.env.docker"

python3 - "$ENV_FILE" "$SECRET_ID" <<'PY'
import json
import os
import subprocess
import sys

env_file = sys.argv[1]
secret_id = sys.argv[2]

result = subprocess.run(
    [
        "aws",
        "secretsmanager",
        "get-secret-value",
        "--secret-id",
        secret_id,
        "--region",
        "ap-south-1",
        "--output",
        "json",
    ],
    check=True,
    capture_output=True,
    text=True,
)

response = json.loads(result.stdout)
secret_string = response["SecretString"]

# Handle UTF-8 BOM and BOM that was incorrectly decoded as UTF-8 text.
secret_string = secret_string.lstrip("\ufeff")
if secret_string.startswith("ï»¿"):
    secret_string = secret_string[3:]

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

os.makedirs(os.path.dirname(env_file), exist_ok=True)

with open(env_file, "w", encoding="utf-8") as f:
    for key, value in data.items():
        f.write(f"{key}={value}\n")

os.chmod(env_file, 0o600)

print("Production secrets loaded successfully.")
PY

echo "Secret file permissions:"
ls -l "$ENV_FILE"
