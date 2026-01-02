


export type Usuario= {
    id: string;
    apellido: string;
    cargo: string;
    rol: string;
}

type SesionProps={
    titulo: string;
    usuario: Usuario |null;
}

export default function Sesiones({titulo, usuario}: SesionProps){
if(!usuario) return <p>No hay Sesion</p>;



    return(
        <>
    <div className="text-bg-light m-2">
<h5>{titulo}</h5>
<ul className="list-group " key={usuario.id}>

<li className="list-group-item" >{usuario.apellido}</li>
<li className="list-group-item">{usuario.cargo}</li>
</ul>
    </div>
    </>
)


}