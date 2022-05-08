import "./DataView.scss"
import { DeviceDetails, FloorSelector, GraphContainer, GraphOptions, QueryPanel } from "./components";
import { useDeviceData, useDeviceHistory, useDeviceInfo } from "../../hooks";
import { useState } from "react";
import { useSelectedDevice, useSelectedFloor } from "../../three";

export interface DataViewProps {
    hidden?: boolean
}

// TODO: Add a spinner so the user knows when data is being loaded
export function DataView({ hidden }: DataViewProps) {
    const [tabIndex, setTabIndex] = useState(0);

    const deviceName = useSelectedDevice();
    const [floor, setFloor] = useSelectedFloor();

    const deviceInfo = useDeviceInfo(deviceName);
    const deviceData = useDeviceData(deviceName);
    const deviceHistory = useDeviceHistory(deviceName);

    const [graphOptions, setGraphOptions] = useState<GraphOptions>({deviceName: undefined, field: undefined});
    const className = (hidden) ? "data-container hidden" : "data-container"

    return (
        <div className={className}>
            <article className="data-panel">
                <h1>
                    Abacws Data Visualiser
                </h1>
                <FloorSelector
                    current={floor}
                    onSelect={(i: number) => { setFloor(i) }}
                />
                
                <div className="tabs">
                    <div className="selectors">
                        <div
                            className={ (tabIndex === 0) ? "selector active" : "selector" }
                            onClick={ () => { setTabIndex(0) } }
                        >
                            Data
                        </div>
                        <div
                            className={ (tabIndex === 1) ? "selector active" : "selector" }
                            onClick={ () => { setTabIndex(1) } }
                        >
                            Query
                        </div>
                    </div>
                    
                    <div className={ (tabIndex === 0) ? "tab active" : "tab"}>
                        <DeviceDetails
                            onViewHistory={(deviceName, field) => { setGraphOptions({deviceName, field}) }}
                            device={deviceInfo}
                            data={deviceData}
                        />
                        <GraphContainer
                            history={deviceHistory}
                            options={graphOptions}
                        />
                    </div>

                    <div className={ (tabIndex === 1) ? "tab active" : "tab"}>
                        <QueryPanel/>
                    </div>
                </div>
            </article>
        </div>
    )
}
