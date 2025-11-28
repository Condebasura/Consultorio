import {Calendar , dateFnsLocalizer, type View} from 'react-big-calendar';
import { format , parse , startOfWeek , getDay} from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';


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


export default function Calendario(){

 
const [enventos , setEventos] = useState<Evento[]>([]);
const [date, setDate] = useState(new Date());
const [view , setViews] = useState<View>('month')

useEffect(()=>{
     
    const fetchTurnos = async ()=>{
        try{
            const res = await fetch("http://localhost:3000/ConsTurno");
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any[] = await res.json();
            
            // Convertir los string del backend en Data...
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const evFormat = data.map( (t: any) =>({
                ...t,
                
                start: new Date(t.start),
                end: new Date(t.end),
            }));
            
            setEventos(evFormat);
           
          // coneccion Socket 

              const socket = io("http://localhost:3000", {
        transports: ["websocket"],
     });
            
            socket.on("Conect", ()=>{
                console.log("🟢 Conectado a Socket.IO");
            });
            
            
            
            // Convertir los string del backend en Data...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.on("Turnos-Actualizados", (data: any[])=>{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const enFormat = data.map( (t: any) =>({
                ...t,
                
                start: new Date(t.start),
                end: new Date(t.end),
            }));
            
            setEventos(enFormat);
            console.log("📅 Turnos actualizados:", enFormat)
            })


            return ()=>{
                socket.disconnect();
                 console.log("🔴 Socket desconectado");
            }
            }catch(error){
                console.error("Error al cargar turnos:", error);
            }
            
        }
        fetchTurnos();
}, []);

return(
    <div style={{height: "600px", margin: "20px"}}>
       
        <Calendar
         
        localizer={localizer}
        events={enventos}
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