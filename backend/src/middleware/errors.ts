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
    if (err?.name !== "NOT FOUND") {
        return next(err);
    }

    res.status(404).json({ "msg": err.message });
}