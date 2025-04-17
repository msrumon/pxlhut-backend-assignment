#!/bin/sh
set -e

docker build --tag pxlhut .
docker network create pxlhut
docker run --env POSTGRES_USER=root --env POSTGRES_PASSWORD=r00t --env POSTGRES_DB=pxlhut --volume db:/var/lib/postgresql/data --network pxlhut --name database --detach postgres:alpine
docker run --env DATABASE_URL=postgres://root:r00t@database:5432/pxlhut --env JWT_SECRET=a1b2c3d4e5f64000abcda1b2c3d4e5f6 --env STRIPE_SECRET_KEY=sk_test_BQokikJOvBiI2HlWgH4olfQ2 --network pxlhut --publish 3000:3000 --name pxlhut --detach pxlhut
