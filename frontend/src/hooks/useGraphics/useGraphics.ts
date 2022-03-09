import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDevices } from "../";
import Graphics from "./Graphics";

/**
 * Hook specifically for use in the ModelView component.
 * This hook automatically hooks the 3D model into the state of the application
 * TODO: Move this all into the ModelView component, no real point making it a hook as it is not reusable anywhere else.
 * @param onLoad Callback to call when the graphics has completed loading
 * @returns The mountRef which should be used to mount the Threejs graphics to the DOM
 */
export function useGraphicsInit(onLoad?: CallableFunction) {
    const graphics = useGraphics();
    const devices = useDevices();
    const mountRef = useRef<any>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Setup canvas when the graphics or mountRef changes
    useEffect(() => {
        graphics.init(mountRef).then(() => { if (onLoad) onLoad() });
        return () => { graphics.dispose() }
    }, [graphics, mountRef, onLoad]); 


    // Set floor if search param is set
    useEffect(() => {
        if (searchParams.has("floor")) {
            const floor = Number(searchParams.get("floor"));
            graphics.setFloor(floor);
        }
    }, [graphics, searchParams]);

    
    // Add devices after they have been loaded
    useEffect(() => {
        if (devices)
            graphics.setDevices(devices);
    }, [graphics, devices]);


    // Update selected device parameter when changed in Graphics object
    useEffect(() => {
        graphics.changeListeners.onDeviceSelected = (device) => {
            const url = `/devices/${device.name}`;
            const params = `?${searchParams.toString()}`;
            navigate({
                pathname: url,
                search: params
            });
        }
    }, [graphics, searchParams, navigate]);


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
