#!/bin/bash

source .env

INVITATION_TOKEN=$(pnpm exec nanoid --size 64)
echo "https://t.me/$TELEGRAM_BOT_USERNAME?start=$INVITATION_TOKEN"
