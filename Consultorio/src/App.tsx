import { useState } from 'react'
import './App.css'
import Libtn from './components/BtnLi';
import Ul from './components/Subseccions';
import Formulario from './components/Form';
import InputWrapper from './components/InputWrapper';

function App() {
 
  const [Tipos, setTipos] = useState('Dashboard');
  const [action , setAction] = useState<string |null>(null);
  return(
  <>
  <div className='caja row '>
    <div className='selector ps-0  col-lg-1 m-0  vh-100'>
      
<Libtn className=' seccions list-group-item bg-primary p-1 text-white mt-2 ' name='Dashboard'onClick={()=> setTipos('Dashboard')}/>
<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Pacientes'onClick={()=> setTipos('Pacientes')}/>
<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Turnos'onClick={()=> setTipos('Turnos')}/>

    
    </div>
    <div className='inputs row col-lg-11  border border-2   vh-100 '>
 <div className=' ListaTurnos shadow  col-lg-12 m-2 bg-white '>
  
 </div>
 <div className='subSeccions shadow col-lg-3 ms-2 bg-white'>
{Tipos === 'Pacientes' && <Ul 
titulo='Pacientes'
names={['Alta Paciente', 'Editar Paciente']}
onSelect={setAction}

/>}

{Tipos === 'Turnos' && <Ul
titulo='Trunos'
names={['Crear','Editar', 'Cancelar']}
onSelect={setAction}
/>}
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
    
  ]}
  
  />)}

  
 </div>
    </div>

  </div>
  </>
 )
}

export default App
