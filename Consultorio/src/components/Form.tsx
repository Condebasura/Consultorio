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
    credentials: 'omit' | 'same-origin' | 'include';
    children?: React.ReactNode;
    valoresIniciales?:Record<string, string>;
    onUserData?:(usuario: Usuario)=> void ;
    
    
    

}


export default function Formulario({titulo  , campos, children, nameBtn = 'Enviar' ,url, method, valoresIniciales , credentials = 'omit' , onUserData }: FormProps){
    // Record pertenece a TypeScript y dice: 'mi objeto tiene clave de tipo string y  valores de tipo string'
const [valores , setValores] = useState<Record<string, string>>(valoresIniciales ||{});
  
const [mensaje, setMensaje] = useState<string | null>(null);

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
    credentials,
    headers: {'Content-Type': 'application/json'},
    body: method !== "GET"? JSON.stringify(valores): undefined
})
const data =  await res.json();

setMensaje(data.mensaje)
if(res.ok){
    setValores({id:"",
        medico_id: "",
        apellido:"",
        cargo:"",
        rol:"",
        
    })

}
    onUserData?.(data)


 }



 return(
        <>
         {mensaje && <div className="bg-green-500 mt-1 p-3 sticky-bottom ">{mensaje}
             <button
            className="bg-[#0B1238] p-1 rounded hover:bg-[#0B1238]/80 text-white ms-3"
            onClick={() => setMensaje(null)}
        >
            OK
        </button>
            
            </div>}
            
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-2xl space-y-6" >
         <h3 className="text-2xl font-bold text-cente">
            {titulo}
            </h3>
            {campos.map((campo)=>(
             <div key={campo.name} className="grid grid-cols-1 gap-4" >
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
            
            
           
         <button type="submit" className="btn btn-success col-1 m-3 p-1 "  >{nameBtn}</button>
         <button type="reset" className="btn btn-outline-danger col-1 m-3 p-1" onClick={()=> setValores({}) } >Borrar</button>
    </form>

    </div>
        </>
)
}