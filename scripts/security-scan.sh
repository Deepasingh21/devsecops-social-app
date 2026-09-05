#!/bin/bash

set -u

echo "========================================"
echo " DevSecOps Docker Security Scan"
echo "========================================"

mkdir -p security-reports

# Application images: these should fail the security gate
APP_IMAGES=(
  "devsecops-social-app-backend:latest"
  "devsecops-social-app-frontend:latest"
)

# Infrastructure images: report only
INFRA_IMAGES=(
  "grafana/grafana:13.2.0"
  "prom/prometheus:v3.14.0"
  "prom/node-exporter:v1.12.1"
)

SCAN_FAILED=0

scan_image() {
    IMAGE="$1"
    TYPE="$2"

    SAFE_NAME=$(echo "$IMAGE" | tr '/:' '__')
    REPORT="security-reports/${SAFE_NAME}.json"

    echo ""
    echo "Scanning [$TYPE]: $IMAGE"
    echo "----------------------------------------"

    trivy image \
      --severity HIGH,CRITICAL \
      --ignore-unfixed \
      --scanners vuln \
      --format json \
      --output "$REPORT" \
      "$IMAGE"

    CRITICAL=$(jq '[.Results[].Vulnerabilities // [] | .[] | select(.Severity=="CRITICAL")] | length' "$REPORT")

    HIGH=$(jq '[.Results[].Vulnerabilities // [] | .[] | select(.Severity=="HIGH")] | length' "$REPORT")

    echo "Result: CRITICAL=$CRITICAL | HIGH=$HIGH"
    echo "Report: $REPORT"

    if [ "$TYPE" = "APPLICATION" ]; then
        if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
            echo "❌ SECURITY GATE FAILED for $IMAGE"
            SCAN_FAILED=1
        else
            echo "✅ SECURITY GATE PASSED for $IMAGE"
        fi
    else
        echo "ℹ️ Infrastructure image: report generated only"
    fi
}


echo ""
echo "========================================"
echo " APPLICATION IMAGE SCANS"
echo "========================================"

for IMAGE in "${APP_IMAGES[@]}"
do
    scan_image "$IMAGE" "APPLICATION"
done


echo ""
echo "========================================"
echo " INFRASTRUCTURE IMAGE SCANS"
echo "========================================"

for IMAGE in "${INFRA_IMAGES[@]}"
do
    scan_image "$IMAGE" "INFRASTRUCTURE"
done


echo ""
echo "========================================"
echo " FINAL SECURITY RESULT"
echo "========================================"

if [ "$SCAN_FAILED" -eq 1 ]; then
    echo "❌ APPLICATION SECURITY GATE FAILED"
    echo "Fix HIGH/CRITICAL vulnerabilities before deployment."
    exit 1
else
    echo "✅ APPLICATION SECURITY GATE PASSED"
    exit 0
fi
