import { useState , useEffect } from "react";
import Formulario from "./Form";

type dataHisto = {
  fecha: string;
  descripcion: string;
}

type DatProps ={
    data: dataHisto[];
    valoresIniciales?:Record<string, string>;
}

export default function TablaHistorial({valoresIniciales, data}: DatProps){
   
   const [valores , setValores] = useState<Record<string, string>>(valoresIniciales || {});

   useEffect(() => {
    if(valoresIniciales){
        setValores(valoresIniciales)
    }
    
   }, [valoresIniciales]);

   console.log(valoresIniciales)
   console.log(data)
    return(
        
        <>
        <div className="m-3">
           <h3>Historial</h3>
         </div>
         <table className="table table-borderer">
            <tbody>
                
                    
                        
                        <tr key={valores.id}>
                        
                             <tr>
                            <th>Nombre: </th>      
                         <td>{valores.nombre}</td>
                            </tr>
                            
                            <tr>
                                <th>Apellido: </th>
                            <td>{valores.apellido}</td>
                            </tr>
                              <tr>
                              <th>DNI: </th>
                            <td>{valores.dni}</td>
                              </tr>
                            {
                              data.map((item)=>(
                                
                                <tr >
                                <th>Historial </th>
                             <td>{item.fecha}</td>
                             <td>{item.descripcion}</td>
                            </tr>
                              ))
                            }

                        </tr>
                    
            </tbody>
         </table>

         <Formulario 
titulo='Agregar Descripcion'
campos={[
  {name:'Historial',type:'textarea', required: true}
]}
method="PUT"
url={`http://localhost:3000/AgregarAlHistorial/${valores.id}`}
/>
        </>

    )
}







