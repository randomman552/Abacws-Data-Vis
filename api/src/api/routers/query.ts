import express, { Request, Response } from "express";
import { Document } from "mongodb";
import { DEVICE_COLLECTION_PREFIX } from "../constants";
import client from "../database";
import { queryMiddleware } from "../middleware";

export const router = express.Router()

/**
 * Utility function which builds the objects for the mongodb queries when querying Data or History.
 * Only used in {@link queryData} and {@link queryHistory}
 * @param has The fields the data requires
 * @param from The begining of the time range in UNIX time
 * @param to The end of the time range in UNIX time
 * @returns The filter and projection objects in an array
 */
function buildDataQueryParams(has: string[] | undefined, from: number = 0, to: number = Number.MAX_SAFE_INTEGER) {
    const filter: any = {};
    const projection: any = { _id: 0 }
    if (has && has.length > 0) {
        has.map((value) => {
            filter[value] = {
                "$exists": true
            };

            projection[value] = 1;
        });

        // Always show timestamp
        projection.timestamp = 1;
    }

    filter.timestamp = {
        "$gte": from,
        "$lte": to
    }

    return [filter, projection]
}


/**
 * Advanced query endpoint that only returns device info
 * Methods: GET
 */
async function queryInfo(req: Request, res: Response) {
    const devices = res.locals.devices as Document[];
    res.status(200).json(devices);
}


/**
 * Advanced query endpoint that returns device info and each device's most recent data entry
 * Methods: GET
 */
async function queryData(req: Request, res: Response) {
    const has = req.query.has?.toString().split(",");

    // Build data filter and projection for mongodb request
    const [filter, projection] = buildDataQueryParams(has);

    // Get devices from middleware
    const devices = res.locals.devices as Document[];

    // Query the database for the last data entry for each device
    for (const device of devices) {
        const collection = client.db().collection(`${DEVICE_COLLECTION_PREFIX}_${device.name}`);
        device.data = await collection.findOne(filter, { projection });
    }

    // Filter out any devices without data
    const filtered = devices.filter(device => device.data)

    res.status(200).json(filtered);
}


/**
 * Advanced query endpoint that returns device info and each device's history.
 * WARN: This can result in VERY large requests as the response is not paginated.
 * Methods: GET
 */
async function queryHistory(req: Request, res: Response) {
    const has = req.query.has?.toString().split(",");
    const from = Number(req.query.from) || 0;
    const to = Number(req.query.to) || Date.now();

    // Build data filter and projection for mongodb request
    const [filter, projection] = buildDataQueryParams(has, from, to);

    // Get devices from middleware
    const devices = res.locals.devices as Document[];

    // Query the database for the history of each device
    for (const device of devices) {
        const collection = client.db().collection(`${DEVICE_COLLECTION_PREFIX}_${device.name}`);
        device.history = await collection.find(filter, { projection }).toArray();
    }

    // Filter out any devices without data
    const filtered = devices.filter(device => device.history.length)

    res.status(200).json(filtered);
}


// Register routes
router.get("/", queryMiddleware, queryInfo);
router.get("/data", queryMiddleware, queryData);
router.get("/history", queryMiddleware, queryHistory);
