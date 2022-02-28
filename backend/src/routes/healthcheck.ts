import express from "express";
import client from "../database";

export const router = express.Router()

// Simple endpoint to query the database is reachable
router.all("/healthcheck", async (req, res, next) => {
    const dbStatus = await client.db().command({ping: 1});
    
    if (dbStatus?.ok) {
        res.status(200).json({status: "OK"});
        return;
    }

    res.status(500).json({
        status: "ERROR",
        error: "Could not run ping on database"
    });
})
