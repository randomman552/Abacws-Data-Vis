import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export interface GraphProps {
    data: any[],
    dataKey: string
}

export function Graph({data, dataKey}: GraphProps) {
    return (
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
                <Tooltip/>
                <CartesianGrid
                    strokeDasharray="3 3"
                />

                <XAxis
                    type='number'
                    domain={["dataMin", "dataMax"]}
                    dataKey="timestamp"
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
                        value={dataKey.split(".")[0]}
                        position="left"
                        angle={-90}
                        style={{
                            textTransform: "capitalize",
                            textAnchor: "middle"
                        }}
                        fill="#c4c4c4"
                    />
                </YAxis>

                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke="#8884d8"
                    dot={false}
                    activeDot={{ r: 3 }}
                />
                
            </LineChart>
        </ResponsiveContainer>
    );
}
