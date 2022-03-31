# Build layer
FROM node:current-alpine AS node

COPY . /app
WORKDIR /app
RUN npm i
RUN npm run build
# Remove non-production node modules after build
RUN rm -rf node_modules
RUN npm i --only=prod

# Application layer
FROM nginx:alpine
ENV WEB_PORT=80
ENV API_HOST=api:5000

EXPOSE ${WEB_PORT}

# Copy frontend build
WORKDIR /app
COPY --from=node /app/build /app

# Copy NGINX config template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template