export const PORT = Number(process.env.API_PORT) || 5000
export const PRODUCTION = Boolean(process.env.PRODUCTION)
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/abacws"
