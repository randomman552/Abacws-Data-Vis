# Abacws Data Visualiser
Web application made to visualise IoT data for devices in the Abacws building at Cardiff University.\
This repository contains the API and the Visualiser tool, both of which are deployed using [docker](https://www.docker.com/).

Production deployments for these tools can be found at the following locations:
- [API](https://abacws.ggrainger.uk/api/)
- [Visualiser](https://abacws.ggrainger.uk/)

## Docs
You can view the documentation for the two separate services in their respective README files.
- [API](./api/README.md)
- [Visualiser](./visualiser/README.md)

## Docker compose
I recommend using docker compose to deploy this to your own server alongside [traefik](https://traefik.io/traefik/).\
An example compose file can be seen below.

```yml
version: '3.8'
services:
  mongo:
    image: mongo
    container_name: abacws-mongo
    restart: always
    volumes:
      - ./mongo:/data/db

  api:
    image: ghcr.io/randomman552/abacws-data-vis:api-latest
    container_name: abacws-api
    restart: always
    depends_on:
      - mongo

  visualiser:
    image: ghcr.io/randomman552/abacws-data-vis:visualiser-latest
    container_name: abacws-visualiser
    restart: always
    depends_on:
      - api
    # Traefik is recommended, you can set up a NGINX or Apache proxy instead, but traefik is much easier.
    labels:
      - "traefik.enable=true"
      - "traefik.http.services.abacws-visualiser.loadbalancer.server.port=80"
      - "traefik.http.routers.abacws-visualiser.rule=Host(`visualiser.abacws.example.com`)"
      - "traefik.http.routers.abacws-visualiser.entrypoints=https"
      - "traefik.http.routers.abacws-visualiser.tls=true"
```

## Supported tags
| Tag                 | Description                 |
|:-------------------:|:---------------------------:|
| `visualiser-latest` | Production ready visualiser |
| `visualiser-main`   | Development visualiser      |
| `visualiser-vx.y.z`  | Specific visualiser version |
| `api-latest`        | Production ready API        |
| `api-main`          | Development API             |
| `api-vx.y.z`         | Specific API version        |
