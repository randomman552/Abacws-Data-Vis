import { NextFunction, Request, Response } from "express";
import { DEVICE_COLLECTION_PREFIX } from "../constants";
import client from "../database";
import { Device as DeviceInterface, Position } from "../types";

/**
 * Device class encapsulating all operations related to devices.
 * Includes getters and setters to abstract away interaction with the database
 */
export class Device implements DeviceInterface {
    public name: string
    public position: Position

    constructor(obj: DeviceInterface) {
        this.name = obj.name;
        this.position = obj.position;
    }

    get collection() {
        const collectionName = `${DEVICE_COLLECTION_PREFIX}_${this.name}`;
        return client.db().collection(collectionName);
    }

    async getData() {
        return this.collection
            .findOne(
                {},
                {
                    limit: 1,
                    sort: {
                        timestamp: -1
                    },
                    projection: {
                        _id: 0
                    }
                }
            )
    }

    async getHistory() {
        return this.collection
            .find(
                {},
                {
                    limit: 10000,
                    sort: {
                        timestamp: -1
                    },
                    projection: {
                        _id: 0
                    }
                }
            )
            .toArray();
    }
    
    async addData(data: any) {
        data.timestamp = Date.now();
        return this.collection.insertOne(data);
    }

    async deleteData() {
        return this.collection.drop();
    }
}



// Required for non optional additions to 'Request'
declare module 'express-serve-static-core' {
    interface Request {
        device: Device
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

    // Convert device to an object of the Device class
    req.device = new Device(device);
    next();
}
