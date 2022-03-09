import { DeviceData } from "../../../../hooks"
import "./DeviceDetails.scss"

export interface DeviceDetailsProps {
    data?: DeviceData["data"]
}

export function DeviceDetails(props: DeviceDetailsProps) {
    const data = props.data;

    const rows = (data) ? Object.entries(data).map((entry) => {
        const key = entry[0];
        const value = entry[1];
        return (
            <tr>
                <th headers="field" scope="row">
                    {key}
                </th>
                <td headers={`value ${key}`}>
                    {String(value)}
                </td>
            </tr>
        )
    }) : <tr><td colSpan={2}>No data found</td></tr>

    return (
        <article className="device-container">
            <table className="data">
                <tr>
                    <th scope="column">field</th>
                    <th scope="column">value</th>
                </tr>
                {rows}
            </table>
        </article>
    )
}
