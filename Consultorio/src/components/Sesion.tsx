


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
    <div className="text-bg-light mt-3">
<h5 className="text-success">{titulo}</h5>
<ul className="list-group mt-3 p-2" key={usuario.id}>

<li className="list-group-item" ><small>{usuario.apellido}</small></li>
<li className="list-group-item "><small>{usuario.cargo}</small></li>
</ul>
    </div>
    </>
)


}