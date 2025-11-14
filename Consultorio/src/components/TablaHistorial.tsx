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
            <thead>
                <tr>
                <th >Nombre</th>
                <th >Apellido</th>
                <th >DNI</th>
                <th >Historial</th>

                </tr>
            </thead>
            <tbody>
                {
                    Datos.map((items)=>(
                        <tr key={items.dni}>
                            <td>{items.nombre}</td>
                            <td>{items.apellido}</td>
                            <td>{items.dni}</td>
                            <td>{items.historial}</td>

                        </tr>
                    ))
                }
            </tbody>
         </table>
        </>

    )
}







