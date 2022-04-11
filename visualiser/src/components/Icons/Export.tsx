import { Icon, IconProps } from "./Icon";
import "./Icons.scss";

export function Export(props: IconProps) {
    const className = `export ${props.className || ""}`;
    return (<Icon {...props} className={className} />)
}
