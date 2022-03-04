import { NextFunction, Request, Response } from "express";

export interface APIError extends Error {
    code: number,
    url?: string
}

export const consoleLogErrors = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    next(err);
}

export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.code).json({ "error": err.message });
}