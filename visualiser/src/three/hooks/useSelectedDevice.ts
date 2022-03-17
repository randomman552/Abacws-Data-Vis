import { useCallback, useEffect, useState } from "react";
import { DeviceSelectEvent } from "../events";

/**
 * React hook to get the currently selected device from the three-js scene
 * @returns The currently selected device from the three-js scene
 */
 export function useSelectedDevice() {
    // Internal state for this function, causes a re-render whenever changed
    const [state, setState] = useState("");
    
    // Callback called when DeviceSelectEvent occurs
    const callback = useCallback((e: Event) => {
        const ev = e as DeviceSelectEvent;
        setState(ev.detail.deviceName);
    }, [setState]);

    // Attach the callback as an event listener
    useEffect(() => {
        const type = DeviceSelectEvent.TYPE;
        window.addEventListener(type, callback);
        return () => { window.removeEventListener(type, callback) };
    }, [callback]);

    return state;
}