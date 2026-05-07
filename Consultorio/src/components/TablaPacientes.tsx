import {DataGrid} from 'react-data-grid';
import { type Column} from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
type DataTabProps = {
    nombre:string;
    apellido: string;
    dni: number;
    nacimiento: string;
    nacimientoIso?: string;
    edad: number;
    telefono: number;
    email: string;
    direccion: string;
    obraSocial: string;
    afiliado: string;
}

type datosProp = {
    Datos: DataTabProps[];
  
}

const columns: Column<DataTabProps>[] = [
    { key: 'nombre', name: 'Nombre' },
    { key: 'apellido', name: 'Apellido' },
    { key: 'dni', name: 'DNI' },
    { key: 'nacimiento', name: 'Nacimiento' },
    { key: 'edad', name: 'Edad' },
    { key: 'telefono', name: 'Telefono' },
    { key: 'email', name: 'Email' },
    { key: 'direccion', name: 'Direccion' },
    { key: 'obraSocial', name: 'Obra Social' },
    { key: 'afiliado', name: 'Afiliado' },
  ];

export default function TablePacientes({Datos}: datosProp){
 
    return(

        <DataGrid
         columns={columns} 
         rows={Datos} 
         />
    )
}