type SubProps = {
titulo: string;
names: string[];
onSelect: (name:string)=> void;
}

export default function Ul({titulo, names, onSelect}: SubProps){

return(
    <>
    <ul className="list-group mt-3">
<h2>{titulo}</h2>
{names.map((n)=>

<li className="list-group-item" onClick={()=> onSelect(n)}>
{n}
</li>

)}
    </ul>
    </>
)
}