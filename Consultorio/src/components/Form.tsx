import Inputs from "./Input";
import { useState } from "react";

type Campo ={
    name:string;
    type?: string;
}

type FormProps={
    titulo: string;
    campos: Campo[];
    children?: React.ReactNode;
    

}


export default function Formulario({titulo  , campos, children}: FormProps){
    // Record pertenece a TypeScript y dice: 'mi objeto tiene clave de tipo string y  valores de tipo string'
const [valores , setValores] = useState<Record<string, string>>({});

const handleChange = (campo: string , valor: string)=>{
    setValores((prev) =>({...prev, [campo]: valor}));
    // ...prev sirve para copiar las propiedades de un objeto
}
 /* const handleSubmit = async (e: React.FormEvent)=>{
 e.preventDefault();

  let url = "";

  if(titulo === 'Alta Paciente'){
    url = 'console.log()'
  }

  }*/

 return(
        <>
        <form className="form row" >
         <h3 className="text-center">
            {titulo}
            </h3>
            {campos.map((campo)=>(
             <div key={campo.name} className="col-lg-6">
              
            <Inputs 
            name={campo.name}
            type={campo.type}
            value={valores[campo.name] || ''}
            onChange={(e)=> handleChange(campo.name, e)}
            />
            
            </div>
            ))}
            {children}
            
            
           
         <button type="submit" className="btn btn-success col-1 m-3 ">Enviar</button>
    </form>
        </>
)
}