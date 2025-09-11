type LiProps = {
name: string;
className: string;
}

export default function Libtn({name, className}: LiProps) {

    return(
        <li className={className}>{name}</li>
    )
}