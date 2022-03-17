import { useEffect, useState } from "react";
import { LoadEvent } from "../events";

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