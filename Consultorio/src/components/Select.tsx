import React, { useEffect, useState } from "react"

type Sujeto = {
    id: string;
    nombre: string;
    apellido: string;
    matricula?: string;
    especialidad?: string;
    cargo?: string;
    tipo?: string;
}

type SelectMedicoProps ={
   url: string;
   opciones?:Sujeto[];
   seleccionado: string;
   NameSelect: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
    
}




export default function Selec({url,seleccionado, onChange, NameSelect}: SelectMedicoProps){

         const [sujetos , setSujeto] = useState<Sujeto[]>([]);
         const [value, setValue] = useState(seleccionado ||"");
         
           useEffect(()=>{
           

                const fetchData = async ()=>{
                    try {
                        
                        const res = await fetch(url);
                        const data = await res.json();
                         
                      setSujeto(data);
          
                       
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
        <div className='flex flex-row  border border-gray-600 rounded-md shadow-sm p-2 '>
    <select 
     value={value} 
      onChange={handleSelect} 
      className="form-select grid-cols-1 size-full"  >
                 <option className="bg-violet-700 text-white" value=''>Seleccione un {NameSelect} </option>
                {sujetos.map((sujeto)=>(
                
                <option key={sujeto.id} value={sujeto.apellido || sujeto.nombre} className=' bg-violet-700  text-white' id='floatingInput' >{sujeto?.nombre} {sujeto?.apellido} {`${sujeto?.especialidad ?? sujeto?.cargo ?? sujeto?.tipo}`} </option>
                
    
    ))}
            </select> 
             
            </div>
        </>
    )
}