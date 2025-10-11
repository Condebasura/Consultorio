import Inputs from "./Input";
import { useEffect, useState } from "react";
import Selec from "./Select";


type Campo ={
    name:string;
    type?: string;
    required?: boolean;
    opciones?: {id: number, nombre: string}[];
    url?: string;
    
    
}

type FormProps={
    titulo: string;
    campos: Campo[];
    nameBtn?: string;
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    children?: React.ReactNode;
    valoresIniciales?:Record<string, string>;
    
    

}


export default function Formulario({titulo  , campos, children, nameBtn = 'Enviar' ,url, method, valoresIniciales }: FormProps){
    // Record pertenece a TypeScript y dice: 'mi objeto tiene clave de tipo string y  valores de tipo string'
const [valores , setValores] = useState<Record<string, string>>(valoresIniciales ||{});

const handleChange = (campo: string , valor: string)=>{
    setValores((prev) =>({...prev, [campo]: valor}));
    // ...prev sirve para copiar las propiedades de un objeto
}

useEffect(()=>{
    if(valoresIniciales){
        setValores(valoresIniciales);
    }
}, [valoresIniciales]);

 const handleSubmit = async (e: React.FormEvent)=>{
 e.preventDefault();

 
const res = await fetch(url,{
    method,
    headers: {'Content-Type': 'application/json'},
    body: method !== "GET"? JSON.stringify(valores): undefined
})
const data =  await res.json();

console.log(data.mensaje)
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
                {campo.type === "selector" ?(
                    <Selec
                   url={campo.url ?? ""}
                   
                    seleccionado={valores[campo.name] || ""}
                    onChange={(valor)=> handleChange(campo.name , valor)}
                    
                    />
                    
                ) : (<Inputs 
                    
                    name={campo.name}
                    type={campo.type}
                    
                    required={campo.required}
                    
                    value={valores[campo.name] ||''}
                    onChange={(e)=> handleChange(campo.name, e)}
                    />
                    
                )}
            </div>
            ))}
           
            {children}
            
            
           
         <button type="submit" className="btn btn-success col-1 m-3 ">{nameBtn}</button>
    </form>
        </>
)
}