import { useState , useEffect } from "react";
import Formulario from "./Form";
import { io } from 'socket.io-client';

 type dataHisto = {
  id: string;
  fecha: string;
  descripcion: string;
}

type DatProps ={
    data: dataHisto[];
    valoresIniciales?:Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DataHisto?: any[];
}

export default function TablaHistorial({valoresIniciales, data, DataHisto}: DatProps){
   
   const [valores , setValores] = useState<Record<string, string>>(valoresIniciales || {});
   const [historial, setHistorial] = useState<dataHisto[]>(data);


   useEffect(() => {
    if(valoresIniciales){
        setValores(valoresIniciales)
    }
    
   }, [valoresIniciales]);

  useEffect(() => {
    
   setHistorial(data)
  }, [data]);

    
   DataHisto =  historial.map((item)=>(
      <>
      <tr key={item.id} className="row ">

      <td >{item.fecha}</td> 
      <td>{item.descripcion}</td> 
      </tr>
      </>
      
      
    ))
  
    useEffect(()=>{
    const socket = io("http://localhost:3000", {
        transports: ["websocket"],
        withCredentials: true,
    });
    socket.on("connect", ()=>{
        console.log("🟢 Conectado a Socket.IO")
    });

    socket.on("Historial-Actualizado", (data: dataHisto[])=>{
        setHistorial(data)
    });
    return () => {
    socket.disconnect();
    console.log("🔴 Socket desconectado");
    }
}, [])
       
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
credentials="include"
url={`http://localhost:3000/AgregarAlHistorial/${valores.id}`}
/>
        </>

    )
}







