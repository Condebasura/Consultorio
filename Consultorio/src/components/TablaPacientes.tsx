

type DataTabProps = {
    nombre:string;
    apellido: string;
    dni: number;
    telefono: number;
    email: string;
    direccion: string;
    obraSocial: string;
    afiliado: string;
}

type datosProp = {
    Datos: DataTabProps[];
  
}

export default function TablePacientes({Datos}: datosProp){
 
    return(

        <>
        <div className="m-3">
            <h3>Pacientes</h3>
        </div>
        <table className=" table table-bordered ">
            <thead >
                <tr >
                <th >Nombre</th>
                <th >Apellido</th>
                <th >DNI</th>
                <th >Telefono</th>
                <th >Email</th>
                <th >Direccion</th>
                <th >ObraSocial</th>
                <th >Afiliado</th>
                

                </tr>

            </thead>
              <tbody>
                {
                    Datos.map((items )=>(
                        <tr key={items.dni}>
                             <td >{items.nombre}</td>
                             <td >{items.apellido}</td>
                             <td >{items.dni}</td>
                             <td >{items.telefono}</td>
                             <td >{items.email}</td>
                             <td >{items.direccion}</td>
                             <td >{items.obraSocial}</td>
                             <td >{items.afiliado}</td>
                             
                            

                        </tr>
                    ))
                }
              </tbody>
        </table>
        </>
    )
}