import { useState } from "react";

export interface SelectorProps {
    onSelect: Function,
    current?: number
}

export function FloorSelector(props: SelectorProps) {
    const [current, setCurrent] = useState(props.current);
    const onSelect = (i: number) => {
        props.onSelect(i);
        setCurrent(i);
    }

    // Generate a button for each floor
    const buttons = [];
    for (let i = 0; i <= 7; i++) {
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


interface ButtonProps extends SelectorProps {
    number: number
}

/**
 * Functional component to render a floor selection buttons.
 * @param props
 * @returns 
 */
function FloorButton(props: ButtonProps) {
    let text = `${props.number}`;
    if (props.number === 0) text = "G";
    else if (props.number === 7) text = "RF";

    return (
        <button 
            className={ (props.current === props.number) ? "active" : "" }
            onClick={() => { props.onSelect(props.number) }}
        >
            {text}
        </button>
    );
}
