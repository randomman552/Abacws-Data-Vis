import { Spinner } from "../../components";
import { useGraphicsInit } from "../../hooks";
import { useGraphicsLoaded } from "../../hooks/useGraphics/useGraphics";

export interface ModelViewProps {}

export function ModelView(props: ModelViewProps) {
    const loaded = useGraphicsLoaded();
    const mountRef = useGraphicsInit();

    // Render loading spinner until the model is finished loading
    const loadingSpinner = (loaded) ? null : <Spinner/>;
    return (
        <div ref={mountRef} className="model-container">
            {loadingSpinner}
        </div>
    )
}
