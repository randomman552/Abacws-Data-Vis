import { useCallback, useState } from "react"
import { Spinner } from "../../components";
import { useGraphicsInit } from "../../hooks";

export interface ModelViewProps {}

export function ModelView(props: ModelViewProps) {
    const [loaded, setLoaded] = useState(false);
    const onLoad = useCallback(() => { setLoaded(true) }, [])
    const mountRef = useGraphicsInit(onLoad);

    // Render loading spinner until the model is finished loading
    const loadingSpinner = (!loaded) ? <Spinner/> : null;
    return (
        <div ref={mountRef} className="model-container">
            {loadingSpinner}
        </div>
    )
}
