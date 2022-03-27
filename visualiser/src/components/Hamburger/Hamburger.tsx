import "./Hamburger.scss"

export interface HamburgerToggleProps {
    onClick: () => void
}

export function HamburgerToggle({ onClick }: HamburgerToggleProps) {
    return (
        <div onClick={onClick} className="hamburger-toggle">
            <div className="slice"></div>
            <div className="slice"></div>
            <div className="slice"></div>
        </div>
    )
}