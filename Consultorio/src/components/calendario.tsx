import {Calendar , dateFnsLocalizer} from 'react-big-calendar';
import { format , parse , startOfWeek , getDay} from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';

//Localizador de fechas

const locales = {
    'es':es
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

useEffect(()=>{
    const fetchTurnos = async ()=>{
        try{

            const res = await fetch("http://localhost:3000/ConsTurno");
           
            const data: any[] = await res.json();
           
            // Convertir los string del backend en Data...
            const evFormat = data.map((t: any)=>({
                ...t,
                start: new Date(t.start),
                end: new Date(t.end),
            }));
            
            setEventos(evFormat)
        }catch(error){
             console.error("Error al cargar turnos:", error);
        }
        
    }
    fetchTurnos()
}, []);

return(
    <div style={{height: "600px", margin: "20px"}}>
        <Calendar
        localizer={localizer}
        events={enventos}
        startAccessor='start'
        endAccessor='end'
        titleAccessor='title'
        views={['month', 'week', 'day']}
       
         messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
        onSelectEvent={(event)=> alert(event.title)}
        style={{ borderRadius: "10px", boxShadow: "0 0 10px #ccc" }}
        />
    </div>
)


}