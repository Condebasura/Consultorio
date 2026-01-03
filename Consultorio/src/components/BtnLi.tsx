type LiProps = {
name: string;
className?: string;
isDisabled?: boolean;
onClick:()=> void;

}

export default function Libtn({name, className,isDisabled, onClick, }: LiProps) {

    return(
        <li className={className} onClick={()=>{
            if(isDisabled) return;
            onClick();
        }}
        className={`${className} ${isDisabled ? 'disabled' : ''}`}
        >{name}</li>
    )
}