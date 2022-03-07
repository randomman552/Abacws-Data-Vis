import { useEffect, useRef, useState } from "react"
import { Spinner } from "../../components";
import { useCreateGraphics } from "../../hooks";

export interface ModelViewProps {}

export function ModelView(props: ModelViewProps) {
    const [loaded, setLoaded] = useState(false);
    const mountRef = useCreateGraphics(() => { setLoaded(true) });

    // Render loading spinner until the model is finished loading
    const loadingSpinner = (!loaded) ? <Spinner/> : null;
    return (
        <div ref={mountRef} className="model-container">
            {loadingSpinner}
        </div>
    )
}
