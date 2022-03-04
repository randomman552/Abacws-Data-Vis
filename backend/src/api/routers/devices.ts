import express, { Request, Response } from "express";
import client from "../database";
import { deviceMiddleware } from "../middleware";
import { Device } from "../types";

export const router = express.Router()

// Define handlers
/**
 * Endpoint handler to return a the details of all devices
 * URL: '/'
 * Methods: GET, POST
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
 * Methods: GET, POST
 */
const getData = async (req: Request, res: Response) => {
    const device = req.device;
    const data = (device.getData) ? await device.getData() : undefined;

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
 * Methods: GET, POST
 */
const getHistoricalData = async (req: Request, res: Response) => {
    const device = req.device;
    const history = (device.getHistory) ? await device.getHistory() : undefined;
    
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

    (device.addData) ? await device.addData(data) : undefined;
    res.status(202).json();
}

/**
 * Endpoint handler to delete historical data for a given device
 * URL '/:deviceName/history'
 * Methods: DELETE
 */
const deleteData = async (req: Request, res: Response) => {
    // TODO
    res.json({"msg": `DELETE DATA FOR '${req.params.deviceName}'`});
}


// Register handlers
router.get("/", listDevices);
router.post("/", listDevices);

router.use("/:deviceName", deviceMiddleware);
router.get("/:deviceName", getData);
router.post("/:deviceName", getData);

router.get("/:deviceName/history", getHistoricalData);
router.post("/:deviceName/history", getHistoricalData);

router.put("/:deviceName", addData);
router.delete("/:deviceName/history", deleteData);
