import { Graph } from "./Graph";
import "./GraphContainer.scss"
import { fieldNameFormatter } from "./util";

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
    const field = options.field || "";

    // Only display graph if a device name is specified
    if (deviceName) {
        return (
            <article className="graph-container">
                <h2 className="text-capitalize">{`Last 12 hours: '${fieldNameFormatter(field)}'`}</h2>
                    <Graph
                        data={history || []}
                        dataKey={options.field || ""}
                    />
            </article>
        )
    }
    return (<></>)
}
