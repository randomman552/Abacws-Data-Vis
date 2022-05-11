import { NextFunction, Request, Response } from "express";
import client from "../database";

/**
 * Middleware for advanced query endpoints.
 * Forms the basis of all requests to '/query' endpoint.
 * Obtains the info of the documents that were requested and places them in res.locals.devices.
 * This middleware does not return any response by itself, but instead calls next to allow further processing.
 */
export async function queryMiddleware(req: Request, res: Response, next: NextFunction) {
    // Get the query parameters
    const name = req.query.name?.toString().split(",");
    const type = req.query.type?.toString().split(",");
    // Floor has to be converted to numbers here
    const floor = req.query.floor?.toString().split(",").map((value) => { return Number(value) });

    // Create filter from passed parameters
    const filter: any = {};

    if (name)
        filter.name = {
            "$in": name
        }
    if (type)
        filter.type = {
            "$in": type
        }
    if (floor)
        filter.floor = {
            "$in": floor
        }


    const devices = await client.db().collection("devices")
        .find(filter)
        .project({ _id: 0 })
        .toArray();

    // Store result for future use
    res.locals.devices = devices;
    // Call next endpoint handler
    return next();
}
