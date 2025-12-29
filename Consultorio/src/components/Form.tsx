import Inputs from "./Input";
import { useEffect, useState } from "react";
import Selec from "./Select";


type Usuario={
    id: string;
    nombre:string;
    apellido?: string;
    cargo:string;
    rol:string;
}

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
    headers?:HeadersInit;
    body?: string; 
    credentials?: string;
    children?: React.ReactNode;
    valoresIniciales?:Record<string, string>;
    onUserData?:(usuario: Usuario)=> void ;
    

}


export default function Formulario({titulo  , campos, children, nameBtn = 'Enviar' ,url, method, valoresIniciales  , onUserData}: FormProps){
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
const data: Usuario =  await res.json();
if(res.ok){

    setValores({id:"",
        medico_id: "",
        apellido:"",
        cargo:"",
        rol:"",
        
    })
    

}
    onUserData(data)


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
            
            
           
         <button type="submit" className="btn btn-success col-1 m-3 p-1 ">{nameBtn}</button>
    </form>
        </>
)
}