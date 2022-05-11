# Abacws Data API
![API docs preview](../.github/previews/api.png)

API to store data provided by various IoT devices throughout the Abacws building.

Deployed at [abacws.ggrainger.uk](https://abacws.ggrainger.uk/api/).

This API is defined using the OpenAPI 3.0 specification, it generates it's own documentation page when hosted which can be found at the root directory of the API.\
Alternatively, you can view the docs [here](https://abacws.ggrainger.uk/api/) or view/download the OpenAPI specification [here](https://abacws.ggrainger.uk/api/openapi.json).

## Deployment
Must be deployed using docker.

### Configuration
#### Environment variables
Configuration of this image is done through environment variables:
| Variable    | Default                      | Description                                                                        |
|:-----------:|:----------------------------:|:----------------------------------------------------------------------------------:|
| PRODUCTION  | true                         | Whether this is a production deployment or not. Currently only controls log levels |
| API_PORT    | 5000                         | The port to bind to                                                                |
| MONGODB_URI | mongodb://mongo:27017/abacws | The MongoDB instance to use for data storage and query                             |

#### Custom device list
The default devices of this application can be overridden by creating mounting a volume to the `/api/data` directory and adding your own devices.json file.\
An example for one of these files can be seen [here](./src/api/data/devices.json).