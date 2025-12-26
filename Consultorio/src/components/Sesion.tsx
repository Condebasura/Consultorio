

type Usuario= {
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
    <div className="bg bg-white m-0">
<h5>{titulo}</h5>
<p>{usuario.apellido}</p>
<p>{usuario.cargo}</p>
    </div>
    </>
)

}