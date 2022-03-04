import { NextFunction, Request, Response } from "express";
import devices from "../data/devices.json"
import client from "../database";

// Types
export interface Device {
    name: string,
    getData?: Function,
    getHistory?: Function
}

// Required for non optional additions to 'Request'
declare module 'express-serve-static-core' {
    interface Request {
        device: Device
    }
}


// Function factories
function getDataFactory(device: Device) {
    return async () => {
        const [data] = await client.db()
            .collection(device.name)
            .aggregate([
                {
                    '$sort': {
                        '_id': -1
                    }
                },
                {
                    '$set': {
                        'timestamp': {
                            '$toDate': '$_id'
                        }
                    }
                },
                {
                    '$project': {
                        '_id': 0
                    }
                },
                {
                    '$limit': 1
                }
            ])
            .toArray();

        return data;
    }
}

function getHistoryFactory(device: Device) {
    return async () => {
        const history = await client.db()
            .collection(device.name)
            .aggregate([
                {
                    '$sort': {
                        '_id': -1
                    }
                },
                {
                    '$set': {
                        'timestamp': {
                            '$toDate': '$_id'
                        }
                    }
                },
                {
                    '$project': {
                        '_id': 0
                    }
                }
            ])
            .toArray();

        return history;
    }
}


// Middleware
/**
 * Gets device details by deviceName parameter and adds it to the Request object.
 */
export const deviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const deviceName = req.params?.deviceName;
    const device: Device = devices.devices.filter((value) => {
        return value.name === deviceName
    })[0];

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

    req.device = device;
    next();
}
