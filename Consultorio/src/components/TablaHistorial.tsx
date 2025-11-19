type DatHistProp = {
    nombre: string;
    apellido: string;
    dni:string;
    historial: string;
}

type DatProps ={
    Datos: DatHistProp[];
}

export default function TablaHistorial({Datos}: DatProps){
    return(
        
        <>
        <div className="m-3">
           <h3>Historial</h3>
         </div>
         <table className="table table-borderer">
            <tbody>
                {
                    Datos.map((items)=>(
                        <tr key={items.dni}>
                             
                             <tr>
                            <th>Nombre: </th>      
                            <td>{items.nombre}</td>
                            </tr>
                            
                            <tr>
                                <th>Apellido: </th>
                            <td>{items.apellido}</td>
                            </tr>
                              <tr>
                              <th>DNI: </th>
                            <td>{items.dni}</td>
                              </tr>
                            
                            <tr>
                               <th>Historial </th>
                             <td>{items.historial}</td>
                            </tr>

                        </tr>
                    ))
                }
            </tbody>
         </table>
        </>

    )
}







