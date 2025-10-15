
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
    name: string;
   
}

export default function Table({Datos , name}: CampoProps){
 
    return(
        <>
        <div className="m-3">
            <h3>{name}</h3>
        </div>
        <table className=" table table-bordered ">
            <thead >
     
            <tr >
                <th >  Fecha/Hora  </th>
                <th >Apellido/Nombre</th>
                <th >DNI</th>
                <th >Medico</th>
                <th >Observaciones</th>
            </tr>
            </thead>
            <tbody>
                
                { 
                Datos.map((data , index)=>(
                                      
                    <tr  key={index} >

                    <td > {data.fecha} / {data.hora}</td>
                    <td >{data.apellido} / {data.nombre}</td>
                    <td >{data.dni}</td>
                    <td >{data.medico}</td>
                    <td >{data.observaciones}</td>
                    
                    </tr>
                    
                )
                )}

               
            </tbody>
        </table>
        </>
    )
}