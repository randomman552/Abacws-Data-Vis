import "./Hamburger.scss"

export interface HamburgerToggleProps {
    onClick: () => void
    /**
     * Whether the HamburgerToggle will display a close icon instead of the 3 lines.
     * Use with state from higher components to toggle the close state when the HamburgerToggle is clicked.
     * If unset, this will have no effect.
     */
    close?: boolean
}

export function HamburgerToggle({ onClick, close }: HamburgerToggleProps) {
    const className = (close)? "hamburger-toggle close" : "hamburger-toggle"

    return (
        <div onClick={onClick} className={className}>
            <div className="slice"></div>
            <div className="slice"></div>
            <div className="slice"></div>
        </div>
    )
}