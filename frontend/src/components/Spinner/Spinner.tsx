import "./Spinner.scss"

export interface Props {}

export function Spinner(props: Props) {
    return (
        <div className="spinner-container">
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
        </div>
    )
}