import { NextFunction, Request, Response } from "express";
import client from "../database";
import { Device as DeviceInterface, Position } from "../types";

export class Device implements DeviceInterface {
    public name: string
    public position: Position

    constructor(obj: DeviceInterface) {
        this.name = obj.name;
        this.position = obj.position;
    }

    async getData() {
        const [data] = await client.db()
            .collection(this.name)
            .find({})
            .sort({ timestamp: -1 })
            .limit(1)
            .project({ _id: 0 })
            .toArray();

        return data;
    }

    async getHistory() {
        return await client.db()
            .collection(this.name)
            .find({})
            .sort({ timestamp: -1 })
            .project({ _id: 0 })
            .toArray();
    }
    
    async addData(data: any) {
        data.timestamp = Date.now();
        return client.db().collection(this.name).insertOne(data);
    }

    async deleteData() {
        return client.db().collection(this.name).drop();
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