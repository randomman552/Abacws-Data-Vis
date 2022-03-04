import { NextFunction, Request, Response } from "express";
import client from "../database";
import { Device } from "../types";


// Required for non optional additions to 'Request'
declare module 'express-serve-static-core' {
    interface Request {
        device: Device
    }
}
export { Device };


// Function factories
// TODO: Can cast to a class instead of manually creating methods on each device object
function getDataFactory(device: Device) {
    return async () => {
        const [data] = await client.db()
            .collection(device.name)
            .find({})
            .sort({ timestamp: -1 })
            .limit(1)
            .project({ _id: 0 })
            .toArray();

        return data;
    }
}

function getHistoryFactory(device: Device) {
    return async () => {
        const history = await client.db()
            .collection(device.name)
            .find({})
            .sort({ timestamp: -1 })
            .project({ _id: 0 })
            .toArray();

        return history;
    }
}

function addDataFactory(device: Device) {
    return async (data: any) => {
        // Add timestamp to data and insert into database
        data.timestamp = Date.now();
        return client.db().collection(device.name).insertOne(data);
    }
}

function deleteDataFactory(device: Device) {
    return async (data: any) => {
        return client.db().collection(device.name).drop();
    }
}


// Middleware
/**
 * Gets device details by deviceName parameter and adds it to the Request object.
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

    device.getData = getDataFactory(device);
    device.getHistory = getHistoryFactory(device);
    device.addData = addDataFactory(device);
    device.deleteData = deleteDataFactory(device);

    req.device = device;
    next();
}
