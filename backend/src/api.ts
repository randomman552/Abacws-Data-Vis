import express, { Request, Response, NextFunction } from 'express';
import { devices, healthcheck } from './routers';

/** Express app */
const api = express();
// Api will only respond to JSON
api.use(express.json())

// Register routes
api.use("/api/healthcheck", healthcheck);
api.use("/api/devices", devices);

export = api;
