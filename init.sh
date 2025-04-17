#!/bin/sh
set -euo pipefail

if [ ${NODE_ENV:-development} = "production" ]; then
  npm run prisma migrate deploy
else
  npm run prisma generate
  # npm run prisma db push
  # npm run prisma migrate dev -- --name init
  npm run prisma migrate dev
fi

exec "$@"
