

type SubProps = {
titulo: string;
names: string[];
onSelect: (name:string)=> void;
children?: React.ReactNode;
}

export default function Ul({titulo, names, onSelect, children}: SubProps){

return(
    <>
    <ul className="list-group mt-3">
<h2>{titulo}</h2>
{names.map((n)=>

<li className="list-group-item" onClick={()=> onSelect(n)}>
{n}
</li>

)}
{children}
    </ul>
    </>
)
}