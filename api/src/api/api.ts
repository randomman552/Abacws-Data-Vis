import cors from 'cors';
import express from 'express';
import { consoleLogErrors, errorHandler, mongodbLogErrors } from './middleware';
import { devices, docs, healthcheck, query } from './routers';

/** Express app */
const api = express();
// Api will only respond to JSON
api.use(cors());
api.use(express.json());

// Register routes
api.use("/healthcheck", healthcheck);
api.use("/query", query)
api.use("/devices", devices);

// Register error handlers
api.use(mongodbLogErrors);
api.use(consoleLogErrors);
api.use(errorHandler);

// Register documentation router
api.use("/", docs);

export = api;
