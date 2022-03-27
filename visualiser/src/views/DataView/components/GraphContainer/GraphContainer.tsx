import { Graph } from "./Graph";
import "./GraphContainer.scss"

export interface GraphOptions {
    deviceName: undefined|string,
    field: undefined|string
}

export interface GraphContainerProps {
    options: GraphOptions,
    history?: any[]
}

export function GraphContainer({options, history}: GraphContainerProps) {
    const {deviceName} = options;

    // Only display graph if a device name is specified
    if (deviceName) {
        return (
            <article className="graph-container">
                <Graph
                    data={history || []}
                    dataKey={options.field || ""}
                />
            </article>
        )
    }
    return (<></>)
}
