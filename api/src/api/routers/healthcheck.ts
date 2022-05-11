import express from "express";
import client from "../database";

export const router = express.Router()

// Simple endpoint to query the database is reachable
router.all("/", async (req, res, next) => {
    const dbStatus = await client.db().command({ ping: 1 });

    if (dbStatus?.ok) {
        res.status(200).json({ health: "OK" });
        return;
    }

    res.status(500).json({
        health: "FAIL"
    });
})
