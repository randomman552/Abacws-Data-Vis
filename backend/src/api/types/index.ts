export enum LogLevel {
    info = 2,
    warn = 1,
    error = 0
}

export interface APIError extends Error {
    code: number,
    timestamp?: number,
    level?: LogLevel,
    url?: string
}

export interface Device {
    name: string,
    position: {
        x: number,
        y: number,
        z: number
    },
    getData?: Function,
    getHistory?: Function,
    addData?: Function,
    deleteData?: Function
}
