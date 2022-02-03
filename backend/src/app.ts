import express, { Request, Response, NextFunction } from 'express';

// Create express app
const api = express();

// Define endpoints
api.get("/api/hello", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({"message": "Hello world!"});
    console.log(`${req.ip} - ${req.url}`);
});

// Start api
const port: Number = 5000;
api.listen(port, () => {
    console.log(`API is listening of ${port}`)
});