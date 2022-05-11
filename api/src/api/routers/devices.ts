import express, { Request, Response } from "express";
import { Filter } from "mongodb";
import { DEVICE_COLLECTION_PREFIX } from "../constants";
import client from "../database";
import { deviceMiddleware, apiKeyAuth } from "../middleware";
import { Device } from "../types";

export const router = express.Router()

function getDeviceCollection(deviceName: string) {
    return client.db().collection(`${DEVICE_COLLECTION_PREFIX}_${deviceName}`)
}

// Define handlers
/**
 * Endpoint handler to return a the details of all devices
 * URL: '/'
 * Methods: GET
 */
const listDevices = async (req: Request, res: Response) => {
    const devices = await client.db().collection("devices")
        .find<Device>({})
        .project({ _id: 0 })
        .toArray();

    res.status(200).json(devices);
}

/**
 * Endpoint handler to return the details of a specific device.
 * URL: '/:deviceName'
 * Methods: GET
 */
const getDevice = async (req: Request, res: Response) => {
    const device = res.locals.device;
    res.status(200).json(device);
}

/**
 * Endpoint handler to return current data for a given device
 * URL: '/:deviceName/data'
 * Methods: GET
 */
const getData = async (req: Request, res: Response) => {
    const device = res.locals.device;

    // Query database for most recent data entry
    const collection = getDeviceCollection(device.name);
    const data = await collection.findOne(
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

    res.status(200).json(data);
}

/**
 * Endpoint handler to get historical data for a device
 * URL: '/:deviceName/history'
 * Methods: GET
 */
const getHistoricalData = async (req: Request, res: Response) => {
    const device = res.locals.device;

    // Get query parameters
    const from = Number(req.query.from) || 0;
    const to = Number(req.query.to) || Date.now();

    // Build timestamp filter
    const filter: Filter<Device> = {
        timestamp: {
            "$gte": from,
            "$lte": to
        }
    }

    // Query data history
    const collection = getDeviceCollection(device.name);
    const history = await collection.find(
        filter,
        {
            limit: 10000,
            sort: {
                timestamp: -1
            },
            projection: {
                _id: 0
            }
        }
    ).toArray();

    res.status(200).json(history);
}

/**
 * Endpoint handler to add data to a given device
 * URL: '/:deviceName/data'
 * Methods: PUT
 */
const addData = async (req: Request, res: Response) => {
    const device = res.locals.device;
    const data = req.body;
    data.timestamp = Date.now();

    const collection = getDeviceCollection(device.name);

    await collection.insertOne(data);

    // Create index if it doesn't already exist
    if (!(collection.indexExists("timestamp")))
        await collection.createIndex({ timestamp: 1 }, { name: "timestamp" });

    res.status(202).json();
}

/**
 * Endpoint handler to delete historical data for a given device
 * URL '/:deviceName/history'
 * Methods: DELETE
 */
const deleteData = async (req: Request, res: Response) => {
    const device = res.locals.device;
    const collection = getDeviceCollection(device.name);
    await collection.drop();
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
