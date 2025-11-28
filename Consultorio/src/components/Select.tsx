import React, { useEffect, useState } from "react"

type Sujeto = {
    id: string;
    nombre: string;
    apellido: string;
    matricula?: string;
    especialidad?: string;
    cargo?: string;
}

type SelectMedicoProps ={
   url: string;
   opciones?:Sujeto[];
    seleccionado: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
    
}



export default function Selec({url,seleccionado, onChange, }: SelectMedicoProps){

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
        <div className='form-floating row'>
    <select 
     value={value} 
      onChange={handleSelect} 
      className="col-6 p-3 border-0 shadow mt-3 "  >
                 <option value=''>Seleccione una opcion </option>
                {sujetos.map((sujeto)=>(
                    
                    <option key={sujeto.id} value={sujeto.apellido} className='form-control ' id='floatingInput' >{sujeto.nombre} {sujeto.apellido} {`(${sujeto.especialidad ?? sujeto.cargo})`}</option>
    
    ))}
            </select> 
             
            </div>
        </>
    )
}