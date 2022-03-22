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
    return (
        <article className="graph-container">
            <Graph
                data={history || []}
                dataKey={options.field || ""}
            />
        </article>
    )
}
