import React, { useState } from "react";

type SearchProps = {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    placeholder?: string;
    className?: string;
    isDisabled?: boolean;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSearch: (result: any )=> void;
    
};

export default function SearchInput({placeholder = "Buscar...", onSearch ,isDisabled,className, url , method }: SearchProps){
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
        
           
           console.log("Sin Resultados")
           
       }else{

        onSearch(data)
        
       } 
    };
}

    return(
        

        <input
         type="search"
         value={query}
         onChange={(e)=>{
             if(isDisabled) return;
             setQuery(e.target.value)}
            } 
         onKeyDown={handleKeyDown}
         placeholder={placeholder}
         className={`${className} ${isDisabled ? 'disabled': 'm-2 p-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
        />
        
       
    )
}