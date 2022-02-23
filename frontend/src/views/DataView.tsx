import { useState } from "react"
import FloorSelector from "../components/FloorSelector";
import "./DataView.scss"

export interface Props {}

export default function DataView(props:Props) {
    const [hidden, setHidden] = useState(false);

    const className = (hidden) ? "data-container hidden" : "data-container"

    return (
        <div className={className}>
            <div className="toggle" onClick={() => {setHidden(!hidden)}}>
                <div className="indicator">&rsaquo;</div>
            </div>

            <article className="data-panel">
                <h1 className="title">
                    Data panel
                </h1>

                <FloorSelector
                    onSelect={(i: number) => {console.log(`Selected floor '${i}'`)}}
                />
            </article>
        </div>
    )
}