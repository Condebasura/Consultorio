import { useState , useEffect } from "react";
import Formulario from "./Form";
import { io } from 'socket.io-client';



 type dataHisto = {
  id: string;
  fecha: string;
  descripcion: string;
  medico: string;
  
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

         function InvertirFecha(fechaHora: string): string {
 
             const [fecha , hora] = fechaHora.split(' ');
           const fechaInvertida =  fecha.split('-').reverse().join('-');
           return `${fechaInvertida} ${hora}`;
                }
            
              
            { DataHisto =  historial.map((item)=>(
               
                 <>

                       <tbody className=" flex flex-row border-collapse border border-gray-400 bg-[#5A5D60]  text-white">
        
            
            
      <td className="p-2 border basis-64"  >{InvertirFecha(item.fecha)}</td> 
        
            
      
      <td className="p-2 border basis-128"> {item.descripcion}</td> 
         
      
        <td className="p-2 border basis-64"> {item.medico }</td>
                     
                   </tbody>
     
    
      
      </>
      
      
    ))
      }     


  
    useEffect(()=>{
   
    const socket = io('/', {
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
           <h3 className=" text-3xl">Historial</h3>


         </div>

                  <Formulario 
titulo='Agregar Descripcion'
campos={[
  {name:'Historial',type:'textarea', required: true }
]}
method="PUT"
credentials="include"
url={`/AgregarAlHistorial/${valores.id}`}
/>
         <table className="  border-collapse border border-gray-400 m-3 ">
            <thead className="flex flex-row border-collapse border border-gray-400 bg-[#5A5D90] text-white">
               <th className="p-2 basis-64">Nombre</th>
               <th className="p-2 basis-64">Apellido</th>
               <th className="p-2 basis-64" >DNI</th>
               <th className="p-2 basis-228" >Historial</th>
              
            </thead>
            <tbody>  
               <tr className="flex -flex-row border-collapse border border-gray-400 bg-[#5A5D60]  text-white " key={valores.id}>
                <td className="border border-gray-300 p-2 basis-64 text-xl">{valores.nombre}</td>
                <td className="border border-gray-300 p-2 basis-64 text-xl">{valores.apellido}</td>
                <td className="border border-gray-300 p-2 basis-64 text-xl">{valores.dni}</td>
                <td className="border border-gray-300 p-2 basis-228 overflow-y-auto overscroll-contain  max-h-100 ">
                     <table className="border-collapse border border-gray-400 m-3  ">
                    <thead className=" flex flex-row border-collapse border border-gray-600 bg-[#5A5D90] text-white">
                        <th className="p-2 basis-64 ">Fecha/Hora</th>
                        <th className="p-2 basis-128">Descripcion</th>
                        <th className="p-2 basis-64">Medico</th>
        
                       </thead>
                       {DataHisto}
                        </table>
            </td> 
            
                </tr>           
            </tbody>
         </table>


        </>

    )
}







