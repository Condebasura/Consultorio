import React from "react"

type Medico = {
    id: number;
    nombre: string;

};

type SelectMedicoProps ={

    medicos: Medico[];
    name: string;
    value?:string | number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}



export default function Selec({medicos,name, value, onChange}: SelectMedicoProps){

    return(
        <>
        <div className='form-floating row'>
    <select name={name} value={value} onChange={onChange} className="col-6 p-3 border-0 shadow mt-3 "  >
                 <option value=''>Selecione un Medico</option>
                {medicos.map((medico)=>(
                    <option key={medico.id} value={medico.id} className='form-control ' id='floatingInput' >{medico.nombre}</option>
    ))}
            </select> 
             
            </div>
        </>
    )
}