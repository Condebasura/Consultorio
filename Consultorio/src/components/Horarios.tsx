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


  export default function HorariosGrid({url , credentials , method
  }: Props) {
    
    const [Horarios, setHorarios] = useState<Horario[]>([]);

useEffect(()=>{
    let  url  = `http://localhost:3000/`
    const socket = io(url || `/`, {
        transports: ["websocket"],
        withCredentials: true,
    });
    socket.on("connect", ()=>{
        console.log("🟢 Conectado a Socket.IO")
    });

    socket.on("Horario-Actualizado", (data: Horario[]) => {
        setHorarios(data);
    });

    return () => {
    socket.disconnect();
    console.log("🔴 Socket desconectado");
    }
    
}, [])


    useEffect(()=>{
      
        const fetchHorarios = async () => {
         try {
             await fetch(url, {
                credentials , method})
            .then(res => res.json())
            .then(data => setHorarios(data))
         } catch (error) {
            
         }   
        }
        fetchHorarios();
    }, [])

 

    return (
        <DataGrid 
        columns={columns} 
        rows={Horarios}
        onRowsChange={setHorarios}
        />
    )
  }