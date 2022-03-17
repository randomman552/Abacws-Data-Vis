import { DeviceData } from "../../../../hooks"
import "./DeviceDetails.scss"

interface DataRowProps {
    field: string,
    value: string
}

function DataRow({field, value}: DataRowProps) {
    return (
        <tr>
            <th headers="field" scope="row">
                {field}
            </th>
            <td headers={`value ${field}`}>
                {value}
            </td>
        </tr>
    )
}

export interface DeviceDetailsProps {
    data?: DeviceData["data"]
}

export function DeviceDetails(props: DeviceDetailsProps) {
    const data = props.data;

    // Generate the timestamp row separately as it requires special handling
    const timestamp = new Date(Number(data?.timestamp)).toLocaleString();
    const timestampRow = <DataRow field="timestamp" value={timestamp} />

    // Generate rows for non time stamp rows
    const rows = (data) ? Object.entries(data).map((entry) => {
        const key = entry[0];
        const value = String(entry[1]);

        // Skip timestamp row
        if (key === "timestamp") return;

        return (
            <DataRow
                field={key}
                value={value}
            />
        )
    }) : <tr><td colSpan={2}>No data found</td></tr>

    return (
        <article className="device-container">
            <table className="data">
                <thead>
                    <tr>
                        <th scope="column">field</th>
                        <th scope="column">value</th>
                    </tr>
                </thead>
                <tbody>
                    {timestampRow}
                    {rows}
                </tbody>
            </table>
        </article>
    )
}
