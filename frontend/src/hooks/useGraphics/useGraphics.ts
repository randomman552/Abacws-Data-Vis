import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDevices } from "../";
import Graphics from "./Graphics";

/**
 * Hook specifically for use in the ModelView component.
 * Automatically hooks into URL parameters to change the state of the scene.
 * TODO: Is there any real point to extracting this as a hook? It's only used in one place?
 * @param onLoad Callback to call when the graphics has completed loading
 * @returns The mountRef which should be used to mount the Threejs graphics to the DOM
 */
export function useCreateGraphics(onLoad?: CallableFunction) {
    const graphics = Graphics.getInstance();
    const devices = useDevices();
    const mountRef = useRef<any>(null);
    const searchParams = useSearchParams()[0];
    
    // Setup canvas when the graphics object changes
    useEffect(() => {
        graphics.init(mountRef).then(() => { if (onLoad) onLoad() });
        return () => { graphics.dispose() }
    }, [mountRef]); 


    // Set floor if search param is set
    useEffect(() => {
        if (searchParams.has("floor")) {
            const floor = Number(searchParams.get("floor"));
            graphics.setFloor(floor);
        }
    }, [searchParams.get("floor")])

    
    // Add devices after they have been loaded
    useEffect(() => {
        if (devices)
            graphics.setDevices(devices);
    }, [devices])   

    return mountRef;
}

/**
 * React hook to get the current graphics object.
 * Can be used by other components to directly interact with the Three.js scene
 * @returns The current {@link Graphics} singleton object
 */
export function useGraphics() {
    return Graphics.getInstance();
}