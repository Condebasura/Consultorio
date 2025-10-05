type DataTabProps = {
     nombre:string;
    apellido: string;
    dni: number;
}

type datosProp = {
    DatosPaci: DataTabProps[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEditar: (DatosPaci: any) => void;
    name?: string;
}

export default function MiniTabla({DatosPaci , onEditar, name}: datosProp){

return(
    <>
    <table className=" text-center m-3">
    <tbody>
        {
           DatosPaci.map((items)=>(

               <tr key={items.dni}>
                <tr>
                <th>Nombre:</th>
                 <td>{items.nombre}</td>
                </tr>
                <tr>
                    <th>Apellido:</th>
                        <td>{items.apellido}</td>
                </tr>

                <tr>
                    <th>Dni:</th>
                        <td>{items.dni}</td>
                </tr>
                <tr>
                    <th>Editar</th>
                    <button className="btn btn-primary btn-sm" onClick={()=> onEditar(items)}>{name}</button>
                </tr>
        </tr>
            ))
        }
    </tbody>
    </table>
    </>
)

}