export interface GraphOptions {
    deviceName: undefined|string,
    field: undefined|string
}

export interface GraphContainerProps {
    options: GraphOptions
}

export function GraphContainer({options}: GraphContainerProps) {
    console.log(options);
    
    return (
        <article className="graph-container">
            <p>Graphs here...</p>
        </article>
    )
}
