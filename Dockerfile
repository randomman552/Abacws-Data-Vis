# Frontend build layer
FROM node:16.13.2 AS frontend-build
COPY frontend /app
WORKDIR /app

RUN npm i
RUN npm run build


# Backend build layer
FROM node:16.13.2 AS backend-build
COPY backend /api
WORKDIR /api

RUN npm i
RUN npm run build


# Application running layer
FROM node:16.13.2
# Copy frontend build
WORKDIR /app
COPY --from=frontend-build /app/build /app

# Copy backend build
WORKDIR /api
COPY --from=backend-build /api/build /api
COPY --from=backend-build /api/node_modules /api/node_modules

# Environment variables
ENV PRODUCTION=true
ENV PORT=80

EXPOSE ${PORT}
ENTRYPOINT [ "node", "app.js" ]
