

type SubProps = {
titulo: string;
names: string[];
isDisabled?: (name: string) => boolean;
onSelect: (name:string)=> void;
children?: React.ReactNode;
}

export default function Ul({titulo, names, isDisabled, onSelect, children}: SubProps){

return(
    <>
    <ul className="list-group mt-3">
<h2>{titulo}</h2>
{names.map((n)=> {

    const disabled = isDisabled?.(n);
    return(
<li  className={`${disabled ? 'disabled' : "list-group-item"}`} onClick={()=>{
    if(disabled) return;
    onSelect(n)}}>
{n}
</li>

);
})}
{children}
    </ul>
    </>
)
}