import "./DataView.scss"
import { DeviceDetails, FloorSelector, GraphContainer } from "./components";
import { useDeviceData } from "../../hooks";
import { useState } from "react";
import { useSelectedDevice, useSelectedFloor } from "../../three";

export interface DataViewProps {}

export function DataView(props: DataViewProps) {
    const deviceName = useSelectedDevice();
    const [floor, setFloor] = useSelectedFloor();
    
    const deviceData = useDeviceData(deviceName);

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
                    deviceName={deviceName}
                    data={deviceData}
                />
                
                <GraphContainer/>
            </article>
        </div>
    )
}
