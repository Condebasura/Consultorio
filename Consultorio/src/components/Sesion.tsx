


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
if(!usuario) return (<>
<div className="bg-[#e62d0c]  rounded-xs m-2 mt-3">

<p className=" text-white text-center text-sm ">Sesion Inactiva</p>
</div>
</>
);



    return(
        <>
    <div className="bg-white  rounded-xs m-2 mt-3">
 <div className="bg-[#22e44c]">
<h5 className="text-center text-sm ">{titulo}</h5>
  
    </div>       
<ul className="list-group mt-3 p-2" key={usuario.id}>

<li className="list-group-item" ><small>{usuario.apellido}</small></li>
<li className="list-group-item "><small>{usuario.cargo}</small></li>
</ul>
    </div>
    </>
)


}