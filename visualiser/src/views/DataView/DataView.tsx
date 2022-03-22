import "./DataView.scss"
import { DeviceDetails, FloorSelector, GraphContainer, GraphOptions } from "./components";
import { useDeviceData, useDeviceHistory } from "../../hooks";
import { useState } from "react";
import { useSelectedDevice, useSelectedFloor } from "../../three";

export interface DataViewProps {}

// TODO: Add a spinner so the user knows when data is being loaded
export function DataView(props: DataViewProps) {
    const deviceName = useSelectedDevice();
    const [floor, setFloor] = useSelectedFloor();

    
    const deviceData = useDeviceData(deviceName);
    const deviceHistory = useDeviceHistory(deviceName);

    const [graphOptions, setGraphOptions] = useState<GraphOptions>({deviceName: undefined, field: undefined});
    const [hidden, setHidden] = useState(false);    
    const className = (hidden) ? "data-container hidden" : "data-container"

    return (
        <div className={className}>
            <div className="toggle" onClick={() => { setHidden(!hidden) }}>
                <div className="indicator">&rsaquo;</div>
            </div>

            <article className="data-panel">
                <h1 className="title">
                    Data panel
                </h1>

                <FloorSelector
                    current={floor}
                    onSelect={(i: number) => { setFloor(i) }}
                />

                <DeviceDetails
                    onViewHistory={(deviceName, field) => { setGraphOptions({deviceName, field}) }}
                    deviceName={deviceName}
                    data={deviceData}
                />
                
                <GraphContainer
                    history={deviceHistory}
                    options={graphOptions}
                />
            </article>
        </div>
    )
}
