import express, { Request, Response } from "express";
import client from "../database";
import { deviceMiddleware, Device, apiKeyAuth } from "../middleware";

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
    
    res.status(200).json(devices);
}

/**
 * Endpoint handler to return the details of a specific device.
 * URL: '/:deviceName'
 * Methods: GET
 */
const getDevice = async (req: Request, res: Response) => {
    const device = req.device;
    res.status(200).json(device);
}

/**
 * Endpoint handler to return current data for a given device
 * URL: '/:deviceName/data'
 * Methods: GET
 */
const getData = async (req: Request, res: Response) => {
    const device = req.device;
    const data = await device.getData();

    res.status(200).json(data);
}

/**
 * Endpoint handler to get historical data for a device
 * URL: '/:deviceName/history'
 * Methods: GET
 */
const getHistoricalData = async (req: Request, res: Response) => {
    const device = req.device;

    // Get query parameters
    const from = Number(req.query.from) || 0;
    const to = Number(req.query.to) || Date.now();

    const history = await device.getHistory(from, to);
    
    res.status(200).json(history);
}

/**
 * Endpoint handler to add data to a given device
 * URL: '/:deviceName/data'
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
router.use("/:deviceName", deviceMiddleware);

router.get("/", listDevices);
router.get("/:deviceName", getDevice);

router.get("/:deviceName/data", getData);
router.put("/:deviceName/data", apiKeyAuth, addData);

router.get("/:deviceName/history", getHistoricalData);
router.delete("/:deviceName/history", apiKeyAuth, deleteData);
