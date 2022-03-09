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

interface Data {
    timestamp: number
    [fields: string]: unknown
}

interface DeviceData extends Device {
    data: Data
}

interface DeviceHistory extends Device {
    history: Data[]
}

// Hooks
/**
 * Hook to request list of devices from the API
 */
export function useDevices() {
    return useAPI<{devices: Device[]}>("/api/devices")?.body.devices;
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
    const url = `/api/devices/${deviceName}/history`;
    return useAPISubscription<DeviceHistory>(url)?.body.history;
}
