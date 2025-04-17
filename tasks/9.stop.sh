#!/bin/sh
set -e

# docker container stop pxlhut database
# docker container remove pxlhut database
# docker volume remove db
# docker network remove pxlhut
# docker image remove pxlhut
docker compose --file compose.prod.yaml down --volumes --rmi local
