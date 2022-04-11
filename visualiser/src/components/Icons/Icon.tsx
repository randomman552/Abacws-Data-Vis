export interface IconProps {
    className?: string,
    onClick?: () => void
}

/**
 * Icon base class, all other icons should be derived from this one.
 */
export function Icon(props: IconProps) {
    return (
        <div
            role="img"
            aria-label="icon"
            {...props}
            className={`icon ${props.className || ""}`}
        />
    );
}
