import { Icons } from "../../../../components"
import { Data, Device } from "../../../../hooks"
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
    device?: Device,
    data?: Data
}

export function DeviceDetails({device, data, onViewHistory}: DeviceDetailsProps) {
    const rows: any[] = [];

    // Generate the timestamp row separately as it requires special handling
    const timestamp = new Date(Number(data?.timestamp)).toLocaleString();
    rows.push(<DataRow field="timestamp" key="timestamp" value={timestamp} />);

    // Generate other rows if provided
    if (device?.name && data) {
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
                        onViewHistory={() => { onViewHistory(device?.name, `${key}.value`) }}
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
                    onViewHistory={() => { onViewHistory(device?.name, key) }}
                    value={String(value)}
                />
            )
        }));
    }

    // Only render export icon if we have a device selected
    const exportIcon = (device?.name) ? (
        <a
            href={`/api/devices/${device?.name}/history`}
            className="export-link"
            download={`${device?.name}.json`}
        >
            <Icons.Export/>
        </a>
    ) : undefined;

    return (
        <article className="device-container">
            <h2>Device: '
                <span className="text-capitalize">
                    {(device?.name)? device.name : "No device selected"}
                </span>
                '
            </h2>
            <p>
                Type:&nbsp;
                <span className="text-capitalize">
                    { (device?.type) ? device?.type : "N/A" }
                </span>
            </p>
            <p>
                Floor:&nbsp;
                <span className="text-capitalize">
                    {/** Check for undefined here as floor can be 0 which is falsy */}
                    { (device?.floor !== undefined) ? device?.floor : "N/A" }
                </span>
            </p>
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
