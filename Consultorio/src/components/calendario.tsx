import {Calendar , dateFnsLocalizer, type View} from 'react-big-calendar';
import { format , parse , startOfWeek , getDay} from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Usuario } from './Sesion';







//Localizador de fechas

const locales = {
    'es':es,
}



const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

type Evento = {
    id: number;
    title: string;
    start: Date;
    end: Date;

}

type Props = {
     credentials: 'omit' | 'same-origin' | 'include';
     url: string;
     usuario: Usuario | undefined;
}


export default function Calendario({credentials , url, usuario}: Props){

 
const [eventos , setEventos] = useState<Evento[]>([]);
const [date, setDate] = useState(new Date());
const [view , setViews] = useState<View>('month')

     




     
   
useEffect(()=>{
    
    if(!usuario){
    setEventos([])
        return 
    } 
        
    
    const fetchTurnos = async ()=>{
        console.log("hago el fetch de los turnos")
        try {
            const res = await fetch(url, {
                credentials,
            });
            const data = await res.json();
            const evFormat = data.map((t: any)=>({
                ...t,
                start: new Date(t.start),
                end: new Date(t.end),
            }));

            setEventos(evFormat);
        } catch (error) {
            console.error("Error al cargar turnos", error);
        }
    };
    fetchTurnos();
}, [usuario]);

useEffect(()=>{
console.log("Me monto")
    const socket = io("http://localhost:3000", {

        transports: ["websocket"],
        withCredentials: true,
    });
    socket.on("connect", ()=>{
        console.log("🟢 Conectado a Socket.IO")
    });

    socket.on("Turnos-Actualizados", (data: any[])=>{
        const enFormat = data.map((t:any)=>({
            ...t,
            start: new Date(t.start),
            end: new Date(t.end)
        }));
        setEventos(enFormat)
    });
    return () => {
    socket.disconnect();
    console.log("🔴 Socket desconectado");
    }
}, [usuario])
return(
    <div style={{height: "600px", margin: "20px"}}>
       
        <Calendar
         
        localizer={localizer}
        events={eventos}
        date={date}
        culture='es'
        onNavigate={(newDate)=> setDate(newDate)}
        startAccessor='start'
        endAccessor='end'
        titleAccessor='title'
        onView={(newView)=> setViews(newView)}
        view={view}
        
        messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
        }}
        views={['month', 'week', 'day', 'agenda']}
        defaultView='month'
        onSelectEvent={(event)=> {
            setViews('day')
            setDate(event.start)
            
        } }
        
        style={{ borderRadius: "10px", boxShadow: "0 0 10px #888383ff" }}
       />
    </div>
)


}