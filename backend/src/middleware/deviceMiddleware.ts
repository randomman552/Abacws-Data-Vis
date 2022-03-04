import { NextFunction, Request, Response } from "express";
import devices from "../data/devices.json"

export interface Device {
    name: string,
    getData?: Function,
    getHistory?: Function
}

export interface DeviceRequest extends Request {
    device?: Device
}

/**
 * Middleware to get the device details and add them to the request object for futher handlers.
 * Should be used before any route that requries device details.
 */
export const deviceMiddleware = async (req: DeviceRequest, res: Response, next: NextFunction) => {
    const deviceName = req.params?.deviceName;
    const device: Device = devices.devices.filter((value) => { 
        return value.name === deviceName 
    })[0];

    if (!device) {
        res.status(404).json({ "msg": "Not found" });
        return;
    }
    
    device.getData = () => {};
    device.getHistory = () => {};

    req.device = device;
    next();
}
