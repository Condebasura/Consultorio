type LiProps = {
name: string;
className: string;
onClick:()=> void;

}

export default function Libtn({name, className, onClick, }: LiProps) {

    return(
        <li className={className} onClick={onClick} >{name}</li>
    )
}