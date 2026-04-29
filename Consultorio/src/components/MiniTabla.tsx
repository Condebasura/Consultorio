type DataTabProps = {
    id:string;
     nombre:string;
    apellido: string;
    dni?: number;
    matricula?: number;
    fecha?: number;
    fechaIso?: number;
    dia: string;
    
    
    
}

type datosProp = {
    DatosPaci: DataTabProps[];
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEditar: (DatosPaci: any) => void;
    name?: string;
}

export default function MiniTabla({DatosPaci , onEditar, name}: datosProp){

return(
    <>
    <table className=" border-collapse hover:border border-gray-400 text-center m-3 p-3 overflow-y-auto overscroll-contain flex flex-column max-h-65 ">
    <tbody className="m-3 p-3 flex flex-col ">
        {
           DatosPaci.map((items)=>(
            
               <tr className="mt-5"  key={items.id}>
                <tr className="border border-gray-300 ">
                <th className="p-1 text-white bg-gray-800">Apellido</th>
                 <td className=" p-2 bg-gray-200">{items.apellido}</td>
                </tr>
                <tr className="border border-gray-300 ">
                    <th className="p-1 text-white bg-gray-800">Nombre</th>
                        <td className="p-2 bg-gray-200">{items.nombre}</td>
                </tr>
            
                <tr className="border border-gray-300 ">
                    <th className="p-1 text-white bg-gray-800">{items?.dni ? "Dni" : "Matricula"}</th>
                        <td className="p-2 bg-gray-200">{items.dni ?? items.matricula}</td>
                </tr>
                <tr className="border border-gray-300 ">
                    <th className="p-1 text-white bg-gray-800">{(items?.fechaIso ?? items?.dia) ? ( items.fechaIso ?"Fecha" : "dia" ) : null}</th>
                    <td className="p-2 bg-gray-200">{items?.fechaIso ?? items.dia} </td>
                </tr>
                
                <tr>
                    <th></th>
                    <td>
                        <button className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded" onClick={()=> onEditar(items) } >{name}</button>
                        
                        </td>
                </tr>
        </tr>
            ))
        }
    </tbody>
    </table>
    </>
)

}