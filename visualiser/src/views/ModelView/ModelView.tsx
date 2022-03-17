import { Spinner } from "../../components";
import { useGraphicsLoaded, useGraphicsMount } from "../../three";

export interface ModelViewProps {}

export function ModelView(props: ModelViewProps) {
    const loaded = useGraphicsLoaded();
    const mountRef = useGraphicsMount();

    // Render loading spinner until the model is finished loading
    const loadingSpinner = (loaded) ? null : <Spinner/>;
    return (
        <div ref={mountRef} className="model-container">
            {loadingSpinner}
        </div>
    )
}
