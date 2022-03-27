# Abacws Data Visualiser
Web application made to visualise IoT data for devices in the Abacws building at Cardiff University.\
This repository contains the API and the Visualiser tool, both of which are deployed using [docker](https://www.docker.com/).

Production deployments for these tools can be found at the following locations:
- [API](https://api.abacws.ggrainger.uk)
- [Visualiser](https://abacws.ggrainger.uk)

## Docs
You can view the documentation for the two separate components in their respective README files.
- [API](./api)
- [Visualiser](./visualiser)

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

  api:
    image: ghcr.io/randomman552/abacws-api:latest
    container_name: abacws-api
    restart: always
    depends_on:
      - mongo

  visualiser:
    image: ghcr.io/randomman552/abacws-visualiser:latest
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