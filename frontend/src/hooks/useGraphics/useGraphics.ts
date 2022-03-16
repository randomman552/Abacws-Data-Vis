import { useCallback, useEffect, useRef, useState } from "react";
import { DeviceSelectEvent, FloorSelectEvent, LoadEvent } from "./events";
import Graphics from "./Graphics";

/**
 * Hook specifically for use in the ModelView component.
 * This hook automatically hooks the 3D model into the state of the application
 * TODO: Move this all into the ModelView component, no real point making it a hook as it is not reusable anywhere else.
 * @param onLoad Callback to call when the graphics has completed loading
 * @returns The mountRef which should be used to mount the Threejs graphics to the DOM
 */
export function useGraphicsMount() {
    const graphics = Graphics.getInstance();
    const mountRef = useRef<any>(null);

    // Setup canvas when the graphics or mountRef changes
    useEffect(() => {
        graphics.init(mountRef).then();
        return () => { graphics.dispose() }
    }, [graphics, mountRef]);

    return mountRef;
}

/**
 * React hook to inform the application when the Graphics object has finished loading
 * @returns Boolean defining whether the three-js scene has fully loaded or not
 */
export function useGraphicsLoaded() {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const type = LoadEvent.TYPE;
        window.addEventListener(type, (e: Event) => {
            const ev = e as LoadEvent;
            setLoaded(ev.detail.success);
        });
    }, []);

    return loaded;
}

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

/**
 * React hook to interact with the currently selected floor in the three-js scene.
 * @returns The currently selected floor, alongside a function to set the current floor.
 */
export function useSelectedFloor() : [number|undefined, (floor: number) => void ]{
    // Internal state for this function, causes a re-render whenever changed
    const [state, setState] = useState<number>();
    
    // Callback called when FloorSelectedEvent occurs
    const callback = useCallback((e: Event) => {
        const ev = e as FloorSelectEvent;
        setState(ev.detail.floor);
    }, [setState])

    // Attach the callback as an event listener
    useEffect(() => {
        const type = FloorSelectEvent.TYPE;
        window.addEventListener(type, callback);
        return () => { window.removeEventListener(type, callback) };
    }, [callback]);

    // Return a setter to allow the React app to set the selected floor
    const setter = useCallback((floor: number) => {
        window.dispatchEvent(new FloorSelectEvent(floor));
    }, [])

    return [state, setter];
}
