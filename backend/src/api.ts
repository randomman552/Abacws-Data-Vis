import express, { Request, Response, NextFunction } from 'express';
import { consoleLogErrors, errorHandler } from './middleware';
import { devices, healthcheck } from './routers';

/** Express app */
const api = express();
// Api will only respond to JSON
api.use(express.json());

// Register routes
api.use("/api/healthcheck", healthcheck);
api.use("/api/devices", devices);

// Register error handlers
api.use(consoleLogErrors);
api.use(errorHandler);

export = api;
