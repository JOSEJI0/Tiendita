#!/bin/bash
set -e

echo "=== Tiendita Deploy ==="

echo "Pulling latest code..."
git pull

echo "Stopping old containers..."
docker compose down --remove-orphans

echo "Building and starting services..."
docker compose up -d --build

echo "Waiting for backend to be ready..."
sleep 10
docker compose logs backend --tail 20

echo ""
echo "=== Deploy complete ==="
echo "Frontend: http://161.35.108.42:8082"
echo "API:      http://161.35.108.42:8081/api/v1/"
echo ""
echo "Check status: docker compose ps"
echo "View logs:    docker compose logs -f"