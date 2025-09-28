import React, { useState } from "react";

type SearchProps = {
    placeholder?: string;
    onSearch: (value: string)=> void;
    
};

export default function SearchInput({placeholder = "Buscar...", onSearch}: SearchProps){
    const [query , setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{

        const value = e.target.value;
        setQuery(value);
        onSearch(value);
        
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