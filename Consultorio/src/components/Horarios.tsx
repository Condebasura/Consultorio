import {DataGrid} from 'react-data-grid';
import { type Column} from 'react-data-grid';
import {useEffect, useState} from 'react';
import 'react-data-grid/lib/styles.css';
import { io } from 'socket.io-client';


type Horario = {
    id: number;
    medico_id: number;
    apellido: string;
    nombre: string;
    especialidad: string;
    dia: string;
    mañana_d:string;
    mañana_h:string;
    tarde_d:string;
    tarde_h:string;

}



type Props = {
    
    url: string;
    credentials: 'omit' | 'same-origin' | 'include';
    method: string;
     valoresIniciales?:Record<string, string>;
    
}

const columns: Column<Horario>[] = [
    { key: 'apellido', name: 'Apellido' , },
    { key: 'nombre', name: 'Nombre' , },
    { key: 'especialidad', name: 'Especialidad' },
    { key: 'dia', name: 'Dia'},
    { key: 'mañana_d', name: 'M_Desde',editable:true  },
    { key: 'mañana_h', name: 'M_Hasta', editable:true },
    { key: 'tarde_d', name: 'T_Desde', editable:true },
    { key: 'tarde_h', name: 'T_Hasta', editable:true },
  ];


  export default function HorariosGrid({ url , credentials , method
  , valoresIniciales}: Props) {
    
    
    const [Horarios, setHorarios] = useState<Horario[]>([]);
const [valores , setValores] = useState<Record<string, string>>(valoresIniciales ||{});

useEffect(()=>{
    if(valoresIniciales){
        setValores(valoresIniciales);
    }
},[valoresIniciales]);
useEffect(()=>{
    let  url  = `http://localhost:3000/`
    const socket = io(url || `/`, {
        transports: ["websocket"],
        withCredentials: true,
    });
    socket.on("connect", ()=>{
        
    });

    socket.on("Horario-Actualizado", (data: Horario[]) => {
        setHorarios(data);
    });

    return () => {
    socket.disconnect();
    
    }
    
}, [valores])


     useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await fetch(url, { credentials, method });
        const data = await response.json();
        setHorarios(data);
      } catch (error) {
        console.log("Error al obtener los horarios:", error);
      }
    };
    fetchHorarios();
  }, [valores]);

 

    return (
        <DataGrid 
        columns={columns} 
        rows={Horarios}
        onRowsChange={setHorarios}
        />
    )
  }