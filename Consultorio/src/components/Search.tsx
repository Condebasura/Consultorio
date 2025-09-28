import React, { useState } from "react";

type SearchProps = {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    placeholder?: string;
    onSearch: (result: any )=> void;
    
};

export default function SearchInput({placeholder = "Buscar...", onSearch , url , method }: SearchProps){
    const [query , setQuery] = useState("");

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>)=>{

        const value = e.target.value;
        setQuery(value)
        const res = await fetch(url, {
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query:value})
        })
        const data = await res.json();
       onSearch(data)
       console.log("Respuesta backend",data)

    };

    return(
        <input
         type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="form-control"
        />
       
    )
}