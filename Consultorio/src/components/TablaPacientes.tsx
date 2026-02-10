

type DataTabProps = {
    nombre:string;
    apellido: string;
    dni: number;
    telefono: number;
    email: string;
    direccion: string;
    obraSocial: string;
    afiliado: string;
}

type datosProp = {
    Datos: DataTabProps[];
  
}

export default function TablePacientes({Datos}: datosProp){
 
    return(

        <>
        <div className="m-3">
        </div>
        <table className=" border-collapse border border-gray-400 m-3 ">
            <caption className="caption-top"> Listado de Pacientes</caption>
            <thead >
                <tr className=" border-collapse border border-gray-400 bg-[#5A5D90] text-white">
                <th className="p-2"  >Nombre</th>
                <th className="p-2" >Apellido</th>
                <th className="p-2" >DNI</th>
                <th className="p-2" >Telefono</th>
                <th className="p-2" >Email</th>
                <th className="p-2" >Direccion</th>
                <th className="p-2" >ObraSocial</th>
                <th className="p-2" >Afiliado</th>
                

                </tr>

            </thead>
              <tbody>
                {
                  Datos.map((items )=>(
                        <tr className=" border-collapse border border-gray-400 bg-[#5A5D60]  text-white"  key={items.dni}>
                             <td className="border border-gray-300 p-2">{items.nombre}</td>
                             <td className="border border-gray-300 p-2">{items.apellido}</td>
                             <td className="border border-gray-300 p-2">{items.dni}</td>
                             <td className="border border-gray-300 p-2">{items.telefono}</td>
                             <td className="border border-gray-300 p-2">{items.email}</td>
                             <td className="border border-gray-300 p-2">{items.direccion}</td>
                             <td className="border border-gray-300 p-2">{items.obraSocial}</td>
                             <td className="border border-gray-300 p-2">{items.afiliado}</td>
                             
                            

                        </tr>
                    ))
                       }
              </tbody>
        </table>
        </>
    )
}