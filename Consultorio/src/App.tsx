import { useState } from 'react'
import './App.css'
import Libtn from './components/BtnLi';
import Ul from './components/Subseccions';
import Formulario from './components/Form';
import Selector from './components/Select';
import React from 'react';
import Table from './components/TablaTurnos';

function App() {
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
  const Medico = [
  { id: 123, nombre: "Dr. Pérez" },
  { id: 265, nombre: "Dra. Gómez" },
  { id: 389, nombre: "Dr. López" },
]
 const [medicosTurno, setMedicosTurno] = React.useState(Medico);
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

    
    </div>
    <div className='inputs row col-lg-11  border border-2   h-100  '>
 <div className=' ListaTurnos shadow  col-lg-12 m-2 bg-white '>
  <Table Datos={Turnos}
  
  />
 </div>
 <div className='subSeccions shadow col-lg-3 ms-2 bg-white'>
  
{Tipos === 'Pacientes' && (<Ul 
titulo='Pacientes'
names={['Alta Paciente', 'Editar Paciente']}
onSelect={setAction}

/>)}

{Tipos === 'Turnos' && (<Ul
titulo='Trunos'
names={['Crear','Editar', 'Cancelar']}
onSelect={setAction}
/>)}
 </div>
 <div className='inputsDeSubseccions shadow col-lg-8 ms-2 bg-white '>
  {action === 'Alta Paciente' && (<Formulario
  
  titulo='Alta'
  campos={[
    {name: "Nombre"},
    {name:"Apellido"},
    {name: "DNI", type:"number"},
    {name:"Telefono", type:"number"},
    {name:"Email", type:"email"},
    {name:"direccion"},
    {name:"Obra Social"},
    {name:"N° de Afiliado", type:"number"}
  ]}
  
  />)}

  {action === 'Editar Paciente' && (<Formulario
   titulo='Editar'
   campos={[
    {name: "Buscar", type: "search"},
  {name: "Nombre"},
    {name:"Apellido"},
    {name: "DNI", type:"number"},
    {name:"Telefono", type:"number"},
    {name:"Email", type:"email"},
    {name:"direccion"},
    {name:"Obra Social"},
    {name:"N° de Afiliado", type:"number"}
       
   ]}
  />)}

  {action === 'Crear' &&(<Formulario
  titulo='Crear'
  campos={[
    {name:'Nombre'},
    {name: 'Apellido'},
    {name:'DNI',type:'number'},
    {name:'Telefono', type:'number'},
    {name:'Fecha', type:'Date'},
    {name:'Hora', type:'time'},
    {name:'Observaciones', type:'textarea'}
    
  ]}
  children={<Selector
  
  name='medico'
  medicos={medicosTurno}
  value={medicoSeleccionado}
  onChange={(e)=> setMedicoSeleccionado(Number(e.target.value))}
  />}
  
  />)}

  {action === 'Editar' &&(<Formulario
  titulo='Editar'
  campos={[
    {name:'Buscar', type: 'search'},
    {name:'Nombre'},
    {name: 'Apellido'},
    {name:'DNI',type:'number'},
    {name:'Telefono', type:'number'},
    {name:'Fecha', type:'Date'},
    {name:'Hora', type:'time'},
    {name:'Observaciones', type:'textarea'}
    
  ]}
  children={<Selector
  
  name='medico'
  medicos={medicosTurno}
  value={medicoSeleccionado}
  onChange={(e)=> setMedicoSeleccionado(Number(e.target.value))}
  />}
  
  />)}

  {action === 'Cancelar' &&(<Formulario
  
  titulo='Cancelar'
  campos={[
    {name:'Buscar', type:'search'},
    {name:'Nombre'},
    {name:'Apellido'},
    {name:'dni', type:'number'},
    {name:'Fecha', type:'Date'},
    {name: 'Hora', type:'time'}

  ]}
  
  />)}

  
 </div>
    </div>

  </div>
  </>
 )
}

export default App
