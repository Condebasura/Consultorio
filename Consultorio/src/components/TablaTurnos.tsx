

type DatoProps ={
    fecha:string;
    hora:string;
    nombre: string;
    apellido:string;
    dni:string;
    medico: string;
    observaciones: string;

}

type CampoProps={
    Datos: DatoProps[];
}

export default function Table({Datos}: CampoProps){

    return(
        <>
        <table className=" border border-1 m-3">
            <thead className="d-flex ">

            <tr className="p-2">
                <th className="p-2 ms-2">  Fecha/Hora  </th>
                <th className="p-2 ms-2">Apellido/Nombre</th>
                <th className="p-2 ms-2">DNI</th>
                <th className="p-2 ms-2">Medico</th>
                <th className="p-2 ms-2">Observaciones</th>
            </tr>
            </thead>
            <tbody>
                
                { // Resolver el tema de colocar los datos segun la cantidad de turnos en la tabla
                Datos.map((data)=>(
                    <tr>
                    
                    </tr>
                ))}
                <td></td>
            </tbody>
        </table>
        </>
    )
}