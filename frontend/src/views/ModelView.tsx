import { useEffect, useRef, useState } from "react"
import Spinner from "../components/Spinner"
import Graphics from "../graphics/Graphics"

export interface Props {}

export default function ModelView(props: Props) {
    const [loaded, setLoaded] = useState(false);
    const mountRef = useRef<any>(null);
    
    // Setup canvas when this component is first created
    useEffect(() => {
        const graphics = Graphics.getInstance();
        graphics.init(mountRef).finally(() => { setLoaded(true) });

        // Return cleanup function
        return () => { graphics.dispose() }
    }, []);

    // Render loading spinner until the model is finished loading
    const loadingSpinner = (!loaded) ? <Spinner/> : null;
    return (
        <div ref={mountRef} className="model-container">
            {loadingSpinner}
        </div>
    )
}
