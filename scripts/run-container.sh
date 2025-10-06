#!/bin/bash

source .env

APP=hmwt
IMAGE="ghcr.io/$GITHUB_USERNAME/help-me-with-this-ai-bot:main"
OPTS="--name $APP \
      --env-file ./.env \
      --volume ./logs:/app/logs \
      --volume ./certs:/app/certs"

podman stop $APP
echo "Stopped container"

podman rm $APP
echo "Removed container"

podman rmi $IMAGE
echo "Removed image"

podman pull $IMAGE
echo "Pulled new image"

podman run --rm $OPTS $IMAGE pnpm run db:migrate
echo "Run migrations"

podman run -d $OPTS $IMAGE 
echo "Run container"

crontab -r; echo "0 0 * * * podman exec $APP pnpm run reset-limits" | crontab -; crontab -l
echo "Add a cron task to reset usage limit"
