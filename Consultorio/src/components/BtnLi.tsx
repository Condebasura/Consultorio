type LiProps = {
name: string;
className?: string;
isDisabled?: boolean;
onClick:()=> void;
children?: React.ReactNode;


}

export default function Libtn({name, className,isDisabled, onClick, children}: LiProps) {
        return(
<li  onClick={()=>{
    if(isDisabled) return;
    onClick();
}}
className={`${className} ${isDisabled ? 'disabled' : ''}`}
> {children}{name}</li>
    )
}