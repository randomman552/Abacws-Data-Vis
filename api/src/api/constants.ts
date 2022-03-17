import { LogLevel } from "./types"

export const PORT = Number(process.env.API_PORT) || 5000
export const PRODUCTION = Boolean(process.env.PRODUCTION)
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/abacws"
// Set LOG_LEVEL to info if we are not in a production environment, otherwise default to error
export const LOG_LEVEL = (!PRODUCTION) ? LogLevel.info : Number(process.env.LOG_LEVEL) || LogLevel.error

export const DEVICE_COLLECTION_PREFIX = "d"
