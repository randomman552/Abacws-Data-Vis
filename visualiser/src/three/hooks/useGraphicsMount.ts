import { useEffect, useRef } from "react";
import Graphics from "../Graphics";

/**
 * Hook specifically for use in the ModelView component.
 * This hook automatically hooks the 3D model into the state of the application
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