import express, { Request, Response, NextFunction } from 'express';
import client from './database'
import { router as healthcheck} from './routes/healthcheck';

/** Express app */
const api = express();
// Api will only respond to JSON
api.use(express.json())

// Register routes
api.use("/api", healthcheck);

export = api;
