#!/bin/sh
# Script to be used in the docker container
# Handles the starting of the application

# NGINX setup
/docker-entrypoint.d/20-envsubst-on-templates.sh
nginx

# Start api
node /api/app.js
