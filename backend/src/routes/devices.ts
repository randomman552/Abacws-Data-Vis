import express, { NextFunction, Request, Response } from "express";
import client from "../database";

export const router = express.Router()

// Endpoint handlers
/**
 * Endpoint handler to return a the details of all devices
 * URL: '/'
 * Methods: GET, POST
 */
const listDevices = async (req: Request, res: Response, next: NextFunction) => {
    res.json({"msg": "LIST DEVICES"});
}

/**
 * Endpoint handler to return current data for a given device
 * URL: '/:deviceName'
 * Methods: GET, POST
 */
const getData = async (req: Request, res: Response, next: NextFunction) => {
    res.json({"msg": `GET DATA FOR '${req.params.deviceName}'`});
}

/**
 * Endpoint handler to get historical data for a device
 * URL: '/:deviceName/history'
 * Methods: GET, POST
 */
const getHistoricalData = async (req: Request, res: Response, next: NextFunction) => {
    res.json({"msg": `GET HISTORICAL DATA FOR '${req.params.deviceName}'`});
}

/**
 * Endpoint handler to add data to a given device
 * URL: '/:deviceName'
 * Methods: PUT
 */
const addData = async (req: Request, res: Response, next: NextFunction) => {
    res.json({"msg": `ADD DATA FOR '${req.params.deviceName}'`});
}

/**
 * Endpoint handler to delete historical data for a given device
 * URL '/:deviceName/history'
 * Methods: DELETE
 */
const deleteData = async (req: Request, res: Response, next: NextFunction) => {
    res.json({"msg": `DELETE DATA FOR '${req.params.deviceName}'`});
}


// Register handlers
router.get("/", listDevices);
router.post("/", listDevices);

router.get("/:deviceName", getData);
router.post("/:deviceName", getData);

router.get("/:deviceName/history", getHistoricalData);
router.post("/:deviceName/history", getHistoricalData);

router.put("/:deviceName", addData);
router.delete("/:deviceName/history", deleteData);
