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

         function InvertirFecha(fechaHora: any){
 
             const [fecha , hora] = fechaHora.split(' ');
           const fechaInvertida =  fecha.split('-').reverse().join('-');
           return `${fechaInvertida} ${hora}`;
                }
            
             DataHisto =  historial.map((item)=>(
               
                 <>
      <tr key={item.id}  className="border-collapse border border-gray-400 bg-[#5A5D60] flex flex-cols justify-center gap-3 mt-2 text-white ">
    
      <td className="p-2" >{InvertirFecha(item.fecha)}</td> 
      <td className="p-2">{item.descripcion}</td> 
      </tr>
      </>
      
      
    ))


  
    useEffect(()=>{
    const socket = io("/", {
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
url={`/api/AgregarAlHistorial/${valores.id}`}
/>
         <table className="border-collapse border border-gray-400 m-3">
            <thead className=" border-collapse border border-gray-400 bg-[#5A5D90] text-white">
               <th className="p-2">Nombre</th>
               <th className="p-2">Apellido</th>
               <th className="p-2" >DNI</th>
               <th className="p-2" >Historial</th>
            </thead>
            <tbody>  
               <tr className="border-collapse border border-gray-400 bg-[#5A5D60]  text-white " key={valores.id}>
                <td className="border border-gray-300 p-2 ">{valores.nombre}</td>
                <td className="border border-gray-300 p-2">{valores.apellido}</td>
                <td className="border border-gray-300 p-2">{valores.dni}</td>
                <td className="border border-gray-300 p-2 ">
                    <tr className="border-collapse  bg-[#5A5D60] flex flex-cols justify-center gap-3 mt-2 text-white ">
                        <td className="p-2 w-full">{DataHisto}</td>
                        
                        

                    </tr>
            </td>   
                </tr>           
            </tbody>
         </table>


        </>

    )
}







