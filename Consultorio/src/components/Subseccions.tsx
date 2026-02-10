

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
    <ul className="flex flex-col mt-3">
<h2 className=" bg-[#0B1238] text-white p-2  rounded-sm">{titulo}</h2>
{names.map((n)=> {

    const disabled = isDisabled?.(n);
    return(
<button className={`${disabled ? 'disabled' : " mt-2 m-2 bg-[#5A5D90] focus:bg-[#3A3C60] text-white p-2 rounded-sm cursor-pointer"}`} onClick={()=>{
    if(disabled) return;
    onSelect(n)}}>
{n}
</button>

);
})}
{children}
    </ul>
    </>
)
}