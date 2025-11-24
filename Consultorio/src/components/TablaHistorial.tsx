import { useState , useEffect } from "react";
import Formulario from "./Form";

type dataHisto = {
  id: string;
  fecha: string;
  descripcion: string;
}

type DatProps ={
    data: dataHisto[];
    valoresIniciales?:Record<string, string>;
    DataHisto?: any;
}

export default function TablaHistorial({valoresIniciales, data, DataHisto}: DatProps){
   
   const [valores , setValores] = useState<Record<string, string>>(valoresIniciales || {});

   useEffect(() => {
    if(valoresIniciales){
        setValores(valoresIniciales)
    }
    
   }, [valoresIniciales]);

  

    
     DataHisto = data.map((item)=>(
      <>
      <tr key={item.id} className="row ">

      <td >{item.fecha}</td> 
      <td>{item.descripcion}</td> 
      </tr>
      </>
      
      
    ))
  
    console.log(data.length)
       
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
                              <table>

                                <thead>

                                <tr >
                                <th>Historial </th>
                            </tr>
                                </thead>
                                <tbody>
                         
                          {DataHisto}
                          
                          </tbody>
                            </table>

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







