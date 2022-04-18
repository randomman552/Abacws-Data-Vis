import { useAPI, useAPISubscription } from "./useAPI";

// Types
interface Position {
    x: number
    y: number
    z: number
}

export interface Device {
    name: string
    position: Position
}

interface Data extends Object {
    timestamp: number
    [fields: string]: {
        value: unknown,
        units: string
    } | any
}

export interface DeviceData extends Device {
    data: Data
}

export interface DeviceHistory extends Device {
    history: Data[]
}

// Hooks
/**
 * Hook to request list of devices from the API
 */
export function useDevices() {
    return useAPI<Device[]>("/api/devices")?.body;
}

/**
 * Hook to get the data corresponding to a device
 * Uses {@link useAPISubscription}, so automaticaly updates
 * @param deviceName The name of the device to query
 * @returns 
 */
export function useDeviceData(deviceName: string|undefined) {
    const url = `/api/devices/${deviceName}`;
    return useAPISubscription<DeviceData>(url)?.body.data;
}

/**
 * Hook to get the history
 * Uses {@link useAPISubscription}, so automaticaly updates
 * @param deviceName The name of the device we want to query
 * @returns 
 */
export function useDeviceHistory(deviceName: string|undefined) {
    // Constrain query to the last 12 hours
    // Use round here to prevent this hook from refreshing constantly
    const to = Math.round(Date.now()/20000)*20000;
    const from = to - (12*60*60*1000);

    const url = `/api/devices/${deviceName}/history?to=${to}&from=${from}`;
    return useAPISubscription<DeviceHistory>(url)?.body.history;
}
