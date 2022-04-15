import { LogLevel } from "./types"

export const PORT = Number(process.env.API_PORT) || 5000
export const PRODUCTION = Boolean(process.env.PRODUCTION)
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/abacws"
export const API_KEY = process.env.API_KEY || "V3rySecur3Pas3word"
export const DEVICE_COLLECTION_PREFIX = "d"

// Set LOG_LEVEL to info if we are not in a production environment, otherwise default to error
export const LOG_LEVEL = (!PRODUCTION) ? LogLevel.info : Number(process.env.LOG_LEVEL) ?? LogLevel.error

// Set URL_PREFIX to "/api" if we are in a development environment
export const URL_PREFIX = (PRODUCTION) ? "" : "/api"

