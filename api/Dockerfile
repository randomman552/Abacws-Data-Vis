# Build layer
FROM node:current-alpine AS node

COPY . /api
WORKDIR /api
RUN npm i
RUN npm run build
# Remove non-production node modules after build
RUN rm -rf node_modules
RUN npm i --only=prod

# Application layer
FROM node:16.13.2-alpine
ENV PRODUCTION=true
ENV API_PORT=5000
ENV API_KEY=V3rySecur3Pas3word
ENV MONGODB_URI=mongodb://mongo:27017/abacws

EXPOSE ${API_PORT}

WORKDIR /api
COPY --from=node /api/build /api
COPY --from=node /api/node_modules /api/node_modules
COPY openapi.yaml /api/

ENTRYPOINT [ "node" ]
CMD [ "app.js" ]