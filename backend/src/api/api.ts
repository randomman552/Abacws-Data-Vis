import express, { Request, Response } from 'express';
import { consoleLogErrors, errorHandler, mongodbLogErrors } from './middleware';
import { devices, docs, healthcheck } from './routers';

/** Express app */
const api = express();
// Api will only respond to JSON
api.use(express.json());

// Register routes
api.use("/api/healthcheck", healthcheck);
api.use("/api/devices", devices);

// Register error handlers
api.use(mongodbLogErrors);
api.use(consoleLogErrors);
api.use(errorHandler);

// Register documentation router
api.use("/api", docs);

export = api;
