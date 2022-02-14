import express, { Request, Response, NextFunction } from 'express';

// Get environment variables
const port: Number = Number(process.env.API_PORT) || 5000;
const production: Boolean = Boolean(process.env.PRODUCTION);

/** Express app */
const api = express();

// Define api endpoints
api.get("/api/hello", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({"message": "Hello world!"});
    console.log(`${req.ip} - ${req.url}`);
});

// Start api
api.listen(port, () => {
    console.log(`API is listening of ${port}`)
});