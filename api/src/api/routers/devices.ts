import express, { Request, Response } from "express";
import client from "../database";
import { deviceMiddleware, Device } from "../middleware";

export const router = express.Router()

// Define handlers
/**
 * Endpoint handler to return a the details of all devices
 * URL: '/'
 * Methods: GET
 */
const listDevices = async (req: Request, res: Response) => {
    const devices = await client.db().collection("devices")
        .find<Device>({})
        .project({_id: 0})
        .toArray();
    
    res.status(200).json({devices});
}

/**
 * Endpoint handler to return current data for a given device
 * URL: '/:deviceName'
 * Methods: GET
 */
const getData = async (req: Request, res: Response) => {
    const device = req.device;
    const data = await device.getData();

    res.status(200).json(
        {
            ...device,
            data
        }
    );
}

/**
 * Endpoint handler to get historical data for a device
 * URL: '/:deviceName/history'
 * Methods: GET
 */
const getHistoricalData = async (req: Request, res: Response) => {
    const device = req.device;
    const now = Date.now();
    const defaultFrom = now - (1*60*60*1000);

    // Get query parameters
    const from = Number(req.query.from) || defaultFrom;
    const to = Number(req.query.to) || now;

    const history = await device.getHistory(from, to);
    
    res.status(200).json({
        ...device,
        history
    });
}

/**
 * Endpoint handler to add data to a given device
 * URL: '/:deviceName'
 * Methods: PUT
 */
const addData = async (req: Request, res: Response) => {
    const device = req.device;
    const data = req.body;

    device.addData(data)
    res.status(202).json();
}

/**
 * Endpoint handler to delete historical data for a given device
 * URL '/:deviceName/history'
 * Methods: DELETE
 */
const deleteData = async (req: Request, res: Response) => {
    const device = req.device;
    await device.deleteData()
    res.status(200).json();
}


// Register handlers
router.get("/", listDevices);
router.use("/:deviceName", deviceMiddleware);
router.get("/:deviceName", getData);
router.get("/:deviceName/history", getHistoricalData);
router.put("/:deviceName", addData);
router.delete("/:deviceName/history", deleteData);
