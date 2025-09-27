import Inputs from "./Input";
import { useState } from "react";


type Campo ={
    name:string;
    type?: string;
    required?: boolean;
    
}

type FormProps={
    titulo: string;
    campos: Campo[];
    nameBtn?: string;
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    children?: React.ReactNode;
    
    

}


export default function Formulario({titulo  , campos, children, nameBtn = 'Enviar' ,url, method}: FormProps){
    // Record pertenece a TypeScript y dice: 'mi objeto tiene clave de tipo string y  valores de tipo string'
const [valores , setValores] = useState<Record<string, string>>({});

const handleChange = (campo: string , valor: string)=>{
    setValores((prev) =>({...prev, [campo]: valor}));
    // ...prev sirve para copiar las propiedades de un objeto
}
 const handleSubmit = async (e: React.FormEvent)=>{
 e.preventDefault();

 
const res = await fetch(url,{
    method,
    headers: {'Content-Type': 'application/json'},
    body: method !== "GET"? JSON.stringify(valores): undefined
})
const data =  await res.text();
const obj = JSON.parse(data);
console.log(obj.mensaje)
setValores({})


  }

 return(
        <>
        <form onSubmit={handleSubmit} className="form row" >
         <h3 className="text-center">
            {titulo}
            </h3>
            {campos.map((campo)=>(
             <div key={campo.name} className="col-lg-6">
              
            <Inputs 
            
            name={campo.name}
            type={campo.type}
            required={campo.required}
            
            value={valores[campo.name] || ''}
            onChange={(e)=> handleChange(campo.name, e)}
            />
            
            </div>
            ))}
            {children}
            
            
           
         <button type="submit" className="btn btn-success col-1 m-3 ">{nameBtn}</button>
    </form>
        </>
)
}