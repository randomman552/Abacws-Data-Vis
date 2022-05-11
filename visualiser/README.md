# Abacws Data Visualiser
![Preview of visualiser](../.github/previews/visualiser.png)

IoT data visualiser tool built for the Abacws building.\
Uses React and three.js to display a model of the building which can then be easily navigated to view data for various IoT devices in the building.

Designed to be hosted alongside our [API](../api/README.md), but queries can be redirected to another API instance using the `API_HOST` environment variable.

Hosted at [abacws.ggrainger.uk](https://abacws.ggrainger.uk/).

## Deployment
This application must be deployed using docker.\
I recommend the use of `docker-compose` to deploy this alongside our accompanying API.

Internally the image uses NGINX to host the static files and proxy queries to the API.

### Configuration
Configuration of the docker image is carried out using environment variables:
| Variable | Default  | Description                         |
|:--------:|:--------:|:-----------------------------------:|
| WEB_PORT | 80       | The port to host the application on |
| API_HOST | api:5000 | The API to query                    |