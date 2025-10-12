import React, { useEffect, useState } from "react"

type Medico = {
    id: string;
    nombre: string;
    apellido: string;
    matricula?: string;
    especialidad?: string;
}

type SelectMedicoProps ={
   url: string;
   opciones?:Medico[];
    seleccionado: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
}



export default function Selec({url,seleccionado, onChange}: SelectMedicoProps){

         const [medicos , setMedico] = useState<Medico[]>([]);
         const [value, setValue] = useState(seleccionado ||"");
         
           useEffect(()=>{
           

                const fetchData = async ()=>{
                    try {
                        
                        const res = await fetch(url);
                        const data = await res.json();
                         
                      setMedico(data);
          
                       
                    } catch (error) {
                        console.log("Error al obtener los medicos", error)    
                    }
                
            
                }
      fetchData();
    
           },[url])

         const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>)=>{
               
          
            const  selectedId = e.target.value;
            setValue(selectedId)
            onChange(selectedId)
         }

    return(
        <>
        <div className='form-floating row'>
    <select 
     value={value} 
      onChange={handleSelect} 
      className="col-6 p-3 border-0 shadow mt-3 "  >
                 <option value=''>Selecione un Medico</option>
                {medicos.map((medico)=>(
                    
                    <option key={medico.id} value={medico.apellido} className='form-control ' id='floatingInput' >{medico.nombre} {medico.apellido} {`(${medico.especialidad})`}</option>
    
    ))}
            </select> 
             
            </div>
        </>
    )
}