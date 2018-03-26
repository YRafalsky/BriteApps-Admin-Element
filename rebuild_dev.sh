#!/usr/bin/env bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "dev" ]]; then
  echo 'Not on `dev` branch, aborting script';
  exit 1;
fi

git pull

docker build -t ba_carrier_portal:latest .

docker run -v ~/public_html/dev:/var/dist/dist \
        --env API_ROOT="'https://dev.admin.briteapps.com'"  \
        ba_carrier_portal:latest

docker rm --force ba_carrier_portal__nginx

docker run \
    --name ba_carrier_portal__nginx \
    -v ~/public_html:/usr/share/nginx/html:ro \
    -v $PWD/deploy/default.conf:/etc/nginx/conf.d/default.conf \
    -p 80:80 \
    -d \
    nginx