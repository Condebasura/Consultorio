


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
<div className="bg-[#e62d0c]  rounded-xs mt-3 m-2">
<h5 className="text-center text-sm ">Sesion Inactiva</h5>

</div>
</>
);



    return(
        <>
    <div className="bg-white  rounded-md m-2 mt-3 ">
 <div className="bg-[#22e44c] rounded-xs">
<h5 className="text-center text-sm ">{titulo}</h5>
  
    </div> 
    <table className="border-collapse  text-center m-0 p-0 flex flex-column  ">
        <tbody className="m-0 p-0 flex flex-col ">
            <tr className="mt-0 " key={usuario.id}>
                <tr className="border border-gray-300 ">

                <th className="p-1 text-white bg-gray-800 text-sm">Usuario</th>
                <td className="p-2 bg-gray-200 text-sm">{usuario.apellido}</td>
                </tr>
                <tr className="border border-gray-300 ">
                <th className="p-1 text-white bg-gray-800 text-sm">cargo</th>
                <td className="p-2 text-xs bg-gray-200">{usuario.cargo}</td>
                </tr>
            </tr>
        </tbody>
        </table>      

    </div>
    </>
)


}