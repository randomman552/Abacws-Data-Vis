import { useState } from "react";

export interface Props {
    onSelect: Function,
    current?: number
}

export default function FloorSelector(props: Props) {
    const [current, setCurrent] = useState(props.current);
    const onSelect = (i: number) => {
        props.onSelect(i);
        setCurrent(i);
    }

    // Generate a button for each floor
    const buttons = [];
    for (let i = 0; i <= 6; i++) {
        buttons.push(
            <FloorButton 
                onSelect={onSelect}
                current={current}
                number={i} 
                key={i}
            />
        )
    }

    return (
        <div className="floor-selector">
            {buttons}
        </div>
    )
}


interface ButtonProps extends Props {
    number: number
}

/**
 * Functional component to render a floor selection buttons.
 * @param props
 * @returns 
 */
function FloorButton(props: ButtonProps) {
    return (
        <button 
            className={ (props.current === props.number) ? "active" : "" }
            onClick={() => { props.onSelect(props.number) }}
        >
            {(props.number == 0) ? "G" : props.number}
        </button>
    );
}
