export enum LogLevel {
    info = 2,
    warn = 1,
    error = 0
}

export interface APIError extends Error {
    code: number,
    timestamp?: number
    level?: LogLevel
    url?: string
}


export interface Position {
    x: number
    y: number
    z: number
}

export interface Device {
    name: string
    type: string
    floor: number
    position: Position
}
