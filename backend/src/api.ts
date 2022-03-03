import express, { Request, Response, NextFunction } from 'express';
import client from './database'
import { router as healthcheck } from './routes/healthcheck';
import { router as devices } from './routes/devices';

/** Express app */
const api = express();
// Api will only respond to JSON
api.use(express.json())

// Register routes
api.use("/api/healthcheck", healthcheck);
api.use("/api/devices", devices);

export = api;
