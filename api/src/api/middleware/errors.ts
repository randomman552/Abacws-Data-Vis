import { NextFunction, Request, Response } from "express";
import { LOG_LEVEL } from "../constants";
import client from "../database";
import { APIError } from "../types";

/**
 * Middleware which logs any errors encountered to the console
 */
export const consoleLogErrors = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    if (err?.level || 0 <= LOG_LEVEL) {
        console.error(err);
    }
    next(err);
}

/**
 * Middleware which logs any errors encountered to the database
 */
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

/**
 * Middleware which returns a response when an error is enountered.
 * Should be used after any logging has occured.
 */
export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.code).json({ "error": err.message });
}