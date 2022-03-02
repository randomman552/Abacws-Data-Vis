import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { Spinner } from "../../components";
import Graphics from "./Graphics"

export interface ModelViewProps {}

export function ModelView(props: ModelViewProps) {
    const [loaded, setLoaded] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const mountRef = useRef<any>(null);
    
    // Setup canvas when this component is first created
    useEffect(() => {
        const graphics = Graphics.getInstance();
        graphics.init(mountRef).finally(() => { setLoaded(true) });

        // Return cleanup function
        return () => { graphics.dispose() }
    }, []);

    // Set floor if search param is set
    if (searchParams.has("floor")) {
        const floor = Number(searchParams.get("floor"));
        Graphics.getInstance().setFloor(floor);
    }

    // Render loading spinner until the model is finished loading
    const loadingSpinner = (!loaded) ? <Spinner/> : null;
    return (
        <div ref={mountRef} className="model-container">
            {loadingSpinner}
        </div>
    )
}
