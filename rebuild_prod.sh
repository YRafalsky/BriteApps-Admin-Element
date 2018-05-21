#!/usr/bin/env bash

git pull

docker build -t ba_carrier_portal:latest .


docker run -v ~/public_html/prod:/var/dist/dist \
        --env API_ROOT="'https://admin.briteapps.com'"  \
        ba_carrier_portal:latest

docker rm --force ba_carrier_portal__nginx

docker run \
    --name ba_carrier_portal__nginx \
    -v ~/public_html:/usr/share/nginx/html:ro \
    -v $PWD/deploy/default.conf:/etc/nginx/conf.d/default.conf \
    -p 80:80 \
    -d \
    nginx