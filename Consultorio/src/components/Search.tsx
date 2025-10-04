import React, { useState } from "react";

type SearchProps = {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    placeholder?: string;
    onSearch: (result: any )=> void;
    
};

export default function SearchInput({placeholder = "Buscar...", onSearch , url , method }: SearchProps){
    const [query , setQuery] = useState("");

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>)=>{
           if(e.key === "Enter"  ){

               
               
               const res = await fetch(url, {
                   method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({apellido:query}),
        })
        const data = await res.json();
       if(query === "" || data.length === 0){
     console.log("sin resultados")
       }else{

        onSearch(data)
        console.log("Respuesta backend",data)
       } 
    };
}

    return(
        

        <input
         type="search"
         value={query}
         onChange={(e)=> setQuery(e.target.value)}
         onKeyDown={handleKeyDown}
         placeholder={placeholder}
         className="form-control "
         />
        
       
    )
}