import { useState } from 'react'
import './App.css'
import Libtn from './components/BtnLi';
import Ul from './components/Subseccions';
import Formulario from './components/Form';
import React from 'react';
import Table from './components/TablaTurnos';
import SearchInput from './components/Search';
import TablePacientes from './components/TablaPacientes';
import MiniTabla from './components/MiniTabla';


function App() {
    const [result , setResult] = useState<any[]>([]);
     const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any | null>(null);
     
     
     const turnos = ([
       {fecha:'20/09',
        hora:'08:15',
        apellido:'Pérez',
        nombre:'Juan',
        dni: '30123456',
        medico:'Dr. González',
         observaciones: 'Control de rutina'
        },
   {
      fecha: "20/09",
      hora: "09:00",
      nombre: "María",
      apellido: "López",
      dni: "28999888",
      medico: "Dra. Fernández",
      observaciones: "Consulta por dolor de cabeza",
    },
    {
      fecha: "20/09",
      hora: "09:45",
      nombre: "Carlos",
      apellido: "Rodríguez",
      dni: "33445566",
      medico: "Dr. Ramírez",
      observaciones: "Dolor abdominal",
    },
    {
      fecha: "20/09",
      hora: "10:30",
      nombre: "Laura",
      apellido: "Gómez",
      dni: "31222333",
      medico: "Dra. Martínez",
      observaciones: "Seguimiento post-operatorio",
    },
    {
      fecha: "20/09",
      hora: "11:15",
      nombre: "Pedro",
      apellido: "Sánchez",
      dni: "29888777",
      medico: "Dr. Herrera",
      observaciones: "Solicita estudios de sangre",
    },
    {
      fecha: "20/09",
      hora: "12:00",
      nombre: "Ana",
      apellido: "Fernández",
      dni: "32777111",
      medico: "Dra. Díaz",
      observaciones: "Mareos frecuentes",
    },
    {
      fecha: "20/09",
      hora: "12:45",
      nombre: "Luis",
      apellido: "Torres",
      dni: "34555666",
      medico: "Dr. Álvarez",
      observaciones: "Control de presión arterial",
    },
])
  




const [Turnos , setTurnos] = useState(turnos)
const [medicoSeleccionado, setMedicoSeleccionado] = React.useState<number | "">("");
  const [Tipos, setTipos] = useState('Dashboard');
  const [action , setAction] = useState<string |null>(null);
  return(
  <>
  <div className='caja row '>
    <div className='selector ps-0  col-lg-1 m-0  '>
      
<Libtn className=' seccions list-group-item bg-primary p-1 text-white mt-2 ' name='Dashboard'onClick={()=> setTipos('Dashboard')}/>
<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Pacientes'onClick={()=> setTipos('Pacientes')}/>
<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Turnos'onClick={()=> setTipos('Turnos')}/>
  <Libtn className='Medicos list-group-item mt-2 text-white p-1' name='Medicos' onClick={()=> setTipos("Medicos")}/>

    
    </div>
    <div className='inputs row col-lg-11  border border-2   vh-200  '>
 <div className=' ListaTurnos shadow  col-lg-12 m-2 bg-white '>
  <Table name='Proximos Turnos' Datos={Turnos}
  
  />
 </div>
 {/*Armar la consulta de turnos del dia , para que se muestren segun el dia y la hora que se aproxima*/}
 
 <div className='subSeccions shadow col-lg-3 ms-2 p-3 bg-white '>
  {Tipos ===  'Dashboard'  && (<Ul 
  titulo='Buscar'
  names={[
    'Pacientes', 'Turnos'
  ]}
  onSelect={setAction}
  > 
  {action === "Pacientes" ? <SearchInput onSearch={(data) =>setResult(data ||'')} method='POST'     url='http://localhost:3000/SearchPaciente' />: <SearchInput onSearch={(data) =>setResult(data || '')} method='POST'     url='http://localhost:3000/SearchTurno' />}
 

  </Ul>)}

{Tipos === 'Pacientes' && (<Ul 
titulo='Pacientes'
names={['Alta Paciente', 'Editar Paciente']}
onSelect={setAction}

>
<SearchInput onSearch={(data) =>setResult(data)} method='POST' url='http://localhost:3000/SearchPaciente' />
<MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Editar'}/>

</Ul>) }

{Tipos === 'Turnos' && (<Ul
titulo='Trunos'
names={['Crear','Editar', 'Cancelar']}
onSelect={setAction}
>
{action === "Crear" ? <SearchInput onSearch={(data) =>setResult(data ||'')} method='POST'     url='http://localhost:3000/SearchPaciente' />: <SearchInput onSearch={(data) =>setResult(data || '')} method='POST'     url='http://localhost:3000/SearchTurno' />}
<MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Selecionar'}/>

</Ul>)}


{Tipos === 'Medicos' && (<Ul 
titulo='Medicos'
names={['Ingresar_M','Editar_M', 'Eliminar_M' ]}
onSelect={setAction}
/>)}


 </div>
 <div className='inputsDeSubseccions shadow col-lg-8 ms-2 bg-white '>
  
  {action === "Pacientes"  && (<TablePacientes Datos={result || ""} />)}
 
  {action === "Turnos" && (<Table name='Turnos' Datos={result || ''}/>)}
 

  {action === 'Alta Paciente' && (<Formulario
  
  titulo='Alta'
  campos={[
    {name: "nombre" , required: true},
    {name:"apellido" , required: true},
    {name: "dni", type:"number", required: true},
    {name:"telefono", type:"number", required: true},
    {name:"email", type:"email" , required: true},
    {name:"direccion" , required: true},
    {name:"obraSocial" , required: true},
    {name:"afiliado", type:"number" , required: true}
  ]}
  url= "http://localhost:3000/AltaPaciente"
  method="POST"
  
  />)}

  {action === 'Editar Paciente' && pacienteSeleccionado && (<Formulario
   titulo='Editar'
   campos={[
   
  {name: "nombre", required: true },
    {name:"apellido" , required: true},
    {name: "dni", type:"number" , required: true},
    {name:"telefono", type:"number" , required: true},
    {name:"email", type:"email" , required: true},
    {name:"direccion" , required: true},
    {name:"obraSocial" , required: true},
    {name:"afiliado", type:"number" , required: true}
      
   ]}
 
   valoresIniciales={pacienteSeleccionado}
   method="PUT"
   url={`http://localhost:3000/UpdatePaciente/${pacienteSeleccionado.id}`}
   />
  )}
  

  {action === 'Crear' &&(<Formulario
  titulo='Crear'
  campos={[
    
    {name:'nombre' , required: true},
    {name: 'apellido' , required: true},
    {name:'dni',type:'number' , required: true},
    {name:'telefono', type:'number' , required: true},
    {name:'fecha', type:'Date' , required: true},
    {name:'hora', type:'time' , required: true},
    {name:'observaciones', type:'textarea' , required: true},
    {name: "medicoApellido", type:"selector", url:'http://localhost:3000/ConsMedico', required: true}

    
  ]}
 

  method='POST'
  url='http://localhost:3000/CrearTurno'
  valoresIniciales={
  pacienteSeleccionado || {}}
  
  />)}

  {action === 'Editar'&& pacienteSeleccionado &&(<Formulario
  titulo='Editar'
  campos={[
  
    {name:'nombre' , required: true},
    {name: 'apellido' , required: true},
    {name:'dni',type:'number' , required: true},
    {name:'telefono', type:'number' , required: true},
    {name:'fecha', type:'Date' , required: true},
    {name:'hora', type:'time' , required: true},
    {name:'observaciones', type:'textarea' , required: true},
    {name: "medicoApellido", type:"selector", url:'http://localhost:3000/ConsMedico', required: true}
    
  ]}
 
  valoresIniciales={pacienteSeleccionado}
  method='PUT'
  url={`http://localhost:3000/UpdateTurno/${pacienteSeleccionado.id}`}
  
  />)}

  {action === 'Cancelar' &&(<Formulario
  
  titulo='Cancelar'
  campos={[
    {name:'Buscar', type:'search'},
    {name:'Nombre' , required: true},
    {name:'Apellido' , required: true},
    {name:'dni', type:'number' , required: true},
    {name:'Fecha', type:'Date' , required: true},
    {name: 'Hora', type:'time' , required: true}

  ]}
  
  />)}

  {action === "Ingresar_M" && (<Formulario
  
  titulo='Agregar Medico'
  campos={[
    {name: "nombre", required: true},
    {name:"apellido", required: true},
    {name: "matricula", required: true},
    {name: "especialidad" , required: true}

  ]}
method='POST'
url='http://localhost:3000/IngresarMedico'

  />)}

  
 </div>
    </div>

  </div>
  </>
 )
}

export default App
