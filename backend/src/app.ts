import express, { Request, Response, NextFunction } from 'express';
import { MongoClient } from 'mongodb';

// Get environment variables
const port: Number = Number(process.env.API_PORT) || 5000;
const production: Boolean = Boolean(process.env.PRODUCTION);
const mongodbURI: string = process.env.MONGODB_URI || "mongodb://localhost:27017/abacws";

// Connect to database
const mongodb = new MongoClient(mongodbURI);
mongodb.connect().then(() => { 
    console.log("Database connected...");
})
.catch((reason) => { 
    console.error(reason);
    process.exit(1);
});

/** Express app */
const api = express();

// Define api endpoints
api.get("/api/hello", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({"message": "Hello world!"});
    console.log(`${req.ip} - ${req.url}`);
});

// Start api
api.listen(port, () => {
    console.log(`API is listening on '${port}'...`)
});