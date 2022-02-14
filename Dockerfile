# Node image to build source within
FROM node:16.13.2-alpine AS node
# Build frontend
COPY frontend /app
WORKDIR /app
RUN npm i
RUN npm run build

# Build backend
COPY backend /api
WORKDIR /api
RUN npm i
RUN npm run build
# Remove non-production node modules after build
RUN rm -rf node_modules
RUN npm i --only=prod


# Application layer
FROM nginx:alpine
# Environment variables
ENV PRODUCTION=true
ENV API_PORT=5000
ENV WEB_PORT=80

EXPOSE ${NGINX_PORT}

# Copy frontend build
WORKDIR /app
COPY --from=node /app/build /app

# Copy backend build
WORKDIR /api
COPY --from=node /api/build /api
COPY --from=node /api/node_modules /api/node_modules

# Copy node accross to the final image so we can use it alongside NGINX
COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

# Copy NGINX config template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD [ "/start.sh" ]
