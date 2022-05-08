import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { fieldNameFormatter, unixTimeFormatter } from './util';


interface TimeTooltipProps {
    active?: any,
    payload?: any,
    label?: string
}

/**
 * Custom recharts tooltip that correctly formats time for us.
 * @returns 
 */
function TimeTooltip ({ active, payload }: TimeTooltipProps) {
    if (active && payload && payload.length) {
        const timestamp = unixTimeFormatter(payload[0].payload.timestamp);
        const name = fieldNameFormatter(String(payload[0].name));
        const value = String(payload[0].value);
        const units = payload[0].payload[name].units || "";


        return (
        <div className="time-tooltip">
            <p className="label">{`Timestamp : ${timestamp}`}</p>
            <p className="label">{`${name} : ${value}${units}`}</p>
        </div>
        );
    }

    return null;
};


export interface GraphProps {
    data: any[],
    dataKey: string
}

/**
 * React component encapsulating our recharts based graph logic.
 * @returns 
 */
export function Graph({data, dataKey}: GraphProps) {

    return (
        <article className="graph">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <Tooltip content={<TimeTooltip/>}/>
                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        type='number'
                        domain={["dataMin", "dataMax"]}
                        dataKey="timestamp"
                        tickFormatter={unixTimeFormatter}
                    >
                        <Label
                            value="time"
                            position="bottom"
                            fill="#c4c4c4"
                            style={{
                                textTransform: "capitalize",
                                textAnchor: "middle"
                            }}
                        />
                    </XAxis>

                    <YAxis>
                        <Label
                            value={dataKey}
                            position="left"
                            angle={-90}
                            style={{
                                textTransform: "capitalize",
                                textAnchor: "middle"
                            }}
                            fill="#c4c4c4"
                            formatter={fieldNameFormatter}
                        />
                    </YAxis>

                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#00ffff"
                        dot={false}
                        activeDot={{ r: 3 }}
                    />
                    
                </LineChart>
            </ResponsiveContainer>
        </article>
    );
}
