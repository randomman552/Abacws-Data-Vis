import { NextFunction, Request, Response } from "express";
import client from "../database";
import { Device } from "../types";


// Middleware
/**
 * Gets device details by deviceName parameter and stores them in Response.locals.device
 */
export const deviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const deviceName = req.params?.deviceName;
    
    // Get device from database
    const device = await client.db().collection("devices")
        .findOne<Device>(
            { name: deviceName },
            {
                projection: {
                    _id: 0
                } 
            }
        );

    if (!device) {
        return next({
            code: 404,
            url: req.originalUrl,
            name: "NOT FOUND",
            message: "Device does not exist"
        });
    }

    // Convert device to an object of the Device class
    res.locals.device = device;
    next();
}
