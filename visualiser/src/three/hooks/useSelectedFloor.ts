import { useCallback, useEffect, useState } from "react";
import { FloorSelectEvent } from "../events";

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