import { NextFunction, Request, Response } from "express";
import { LOG_LEVEL } from "../constants";
import client from "../database";
import { APIError } from "../types";

export const consoleLogErrors = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    if (err?.level || 0 <= LOG_LEVEL) {
        console.error(err);
    }
    next(err);
}

export const mongodbLogErrors = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    if (!err.timestamp) {
        err.timestamp = Date.now();
    }

    // Only log this according to current LOG_LEVEL set
    if (err?.level || 0 <= LOG_LEVEL) {
        client.db().collection("log").insertOne(err);
    }
    next(err);
}

export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.code).json({ "error": err.message });
}