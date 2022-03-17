import { DeviceData } from "../../../../hooks"
import "./DeviceDetails.scss"

interface DataRowProps {
    field: string,
    value: string,
    units?: string
}

function DataRow({field, value, units}: DataRowProps) {
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
        </tr>
    )
}

export interface DeviceDetailsProps {
    deviceName?: string,
    data?: DeviceData["data"]
}

export function DeviceDetails({deviceName, data}: DeviceDetailsProps) {
    const rows: any[] = [];

    // Generate the timestamp row separately as it requires special handling
    const timestamp = new Date(Number(data?.timestamp)).toLocaleString();
    rows.push(<DataRow field="timestamp" value={timestamp} />)

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
                    value={String(value)}
                />
            )
        }));
    }

    return (
        <article className="device-container">
            <h2>{(deviceName)? deviceName : "No device selected"}</h2>
            <table className="data">
                <thead>
                    <tr>
                        <th scope="column">field</th>
                        <th scope="column">value</th>
                        <th scope="column">units</th>
                    </tr>
                </thead>
                <tbody>
                    {(data) ? rows : <tr><td colSpan={3}>No data</td></tr>}
                </tbody>
            </table>
        </article>
    )
}
