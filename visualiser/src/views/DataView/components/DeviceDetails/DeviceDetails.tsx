import { Icons } from "../../../../components"
import { DeviceData } from "../../../../hooks"
import "./DeviceDetails.scss"

interface DataRowProps {
    field: string,
    value: string,
    units?: string,
    onViewHistory?: () => void
}

function DataRow({field, value, units, onViewHistory}: DataRowProps) {
    const options = (onViewHistory) ? (
        <button onClick={() => { onViewHistory() }} className="primary">
            History
        </button>
    ) : (
        "N/A"
    )

    return (
        <tr>
            <th headers="field" scope="row">
                {field}
            </th>
            <td headers={`value ${field}`}>
                {value}
            </td>
            <td headers={`units ${field}`}>
                {(units)? units : "N/A"}
            </td>
            <td headers={`options ${field}`}>
                {options}
            </td>
        </tr>
    )
}

export interface DeviceDetailsProps {
    onViewHistory: (deviceName: string, field: string) => void
    deviceName: string,
    data?: DeviceData["data"]
}

export function DeviceDetails({deviceName, data, onViewHistory}: DeviceDetailsProps) {
    const rows: any[] = [];

    // Generate the timestamp row separately as it requires special handling
    const timestamp = new Date(Number(data?.timestamp)).toLocaleString();
    rows.push(<DataRow field="timestamp" key="timestamp" value={timestamp} />);

    // Generate other rows if provided
    if (data) {
        rows.push(Object.entries(data).map((entry) => {
            const key = entry[0];
            // Skip timestamp row
            if (key === "timestamp") return;

            const value = entry[1];

            // Check if value has additional properties (such as units)
            if (value?.value) {
                return (
                    <DataRow
                        key={key}
                        field={key}
                        onViewHistory={() => { onViewHistory(deviceName, `${key}.value`) }}
                        value={value.value}
                        units={value?.units}
                    />
                )
            }

            // If no additional properties are present,
            // just render the value as text
            return (
                <DataRow
                    key={key}
                    field={key}
                    onViewHistory={() => { onViewHistory(deviceName, key) }}
                    value={String(value)}
                />
            )
        }));
    }

    // Only render export icon if we have a device selected
    const exportIcon = (deviceName) ? (
        <Icons.Export
            onClick={() => {
                window.open(`/api/devices/${deviceName}/history`, "_blank")
            }}
        />
    ) : undefined;

    return (
        <article className="device-container">
            <h2>{(deviceName)? deviceName : "No device selected"}</h2>
            {exportIcon}
            <table className="data">
                <thead>
                    <tr>
                        <th scope="column">field</th>
                        <th scope="column">value</th>
                        <th scope="column">units</th>
                        <th scope="column">options</th>
                    </tr>
                </thead>
                <tbody>
                    {(data) ? rows : <tr><td colSpan={4}>No data</td></tr>}
                </tbody>
            </table>
        </article>
    )
}
