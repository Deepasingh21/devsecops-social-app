#!/usr/bin/env bash
set -euo pipefail

SECRET_ID="devsecops/social-app/production"
ENV_FILE="/home/ubuntu/devsecops-social-app/backend/.env.docker"

python3 - "$ENV_FILE" <<'PY'
import json
import subprocess
import sys
import os

env_file = sys.argv[1]

result = subprocess.run(
    [
        "aws",
        "secretsmanager",
        "get-secret-value",
        "--secret-id",
        "devsecops/social-app/production",
        "--region",
        "ap-south-1",
        "--query",
        "SecretString",
        "--output",
        "text",
    ],
    check=True,
    capture_output=True,
    text=True,
)

secret_string = result.stdout
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

with open(env_file, "w") as f:
    for key, value in data.items():
        f.write(f"{key}={value}\n")

os.chmod(env_file, 0o600)

print("Production secrets loaded successfully.")
PY
