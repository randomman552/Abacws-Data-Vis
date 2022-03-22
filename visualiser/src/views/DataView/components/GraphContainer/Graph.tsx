import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface GraphProps {
    data: any[],
    dataKey: string
}

export function Graph({data, dataKey}: GraphProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
        </LineChart>
        </ResponsiveContainer>
    );
}
