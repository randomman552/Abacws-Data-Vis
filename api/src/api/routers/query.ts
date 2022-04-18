import express, { Request, Response } from "express";
import { DEVICE_COLLECTION_PREFIX } from "../constants";
import client from "../database";

export const router = express.Router()

router.get("/query", async (req: Request, res: Response) => {
    const type = req.query.type;

    const filter:any = {}
    if (type) filter.type = type;

    const devices = await client.db().collection("devices")
        .find(filter)
        .project({_id: 0})
        .toArray();

    
    // Provide requester only info by default
    const requestedData = req.query.data ?? "info";

    if (requestedData === "history") {
        // Get device history constrained by from and to
        const from = Number(req.query.from) || 0;
        const to = Number(req.query.to) || Date.now();

        const filter = {
            timestamp: {
                "$gte": from,
                "$lte": to
            }
        }

        for (const device of devices) {
            const collection = client.db().collection(`${DEVICE_COLLECTION_PREFIX}_${device.name}`);
            device.history = await collection.find(
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
        }
    } 
    else if (requestedData === "data") {
        // Only get the last data entry
        for (const device of devices) {
            const collection = client.db().collection(`${DEVICE_COLLECTION_PREFIX}_${device.name}`);
            device.data = await collection.findOne(
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
            );
        }
    }

    // Return results
    res.status(200).json(devices);
});