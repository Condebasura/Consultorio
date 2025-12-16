/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import './App.css'
import Libtn from './components/BtnLi';
import Ul from './components/Subseccions';
import Formulario from './components/Form';


import SearchInput from './components/Search';
import TablePacientes from './components/TablaPacientes';
import MiniTabla from './components/MiniTabla';
import Calendario from './components/calendario';
import Text from './components/texto';
import TablaHistorial from './components/TablaHistorial';


function App() {
    const [result , setResult] = useState<any[]>([]);
     const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any | null>(null);
     const [HistorialPaciente, setHistorialPaciente] = useState<any[]>([]);
     const [userData , setUserData] = useState<Usuario |null>(null);

    const handleSelecionar =  (pacienteSeleccionado: any)=>{
      setPacienteSeleccionado(pacienteSeleccionado);

       fetch(`http://localhost:3000/VerHistorialPaciente/${pacienteSeleccionado.id}`).then(res => res.json()).then(data =>{
              if(data && Array.isArray(data)){

                setHistorialPaciente(data);
              }else{

                setHistorialPaciente([]);
              }
            })};



  const [Tipos, setTipos] = useState('Dashboard');
  const [action , setAction] = useState<string |null>(null);
  return(
  <>
  <div className='caja row '>
    <div className='selector ps-0  col-lg-1 m-0  '>
      
<Libtn className=' seccions list-group-item bg-primary p-1 text-white mt-2 ' name='Dashboard'onClick={()=> setTipos('Dashboard')}/>

<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Pacientes'onClick={()=> setTipos('Pacientes')}/>

<Libtn className='disabled list-group-item    mt-2 text-white p-1' name='Turnos'onClick={()=> setTipos('Turnos')}/>

  <Libtn className='seccions list-group-item mt-2 text-white p-1' name='Medicos' onClick={()=> setTipos("Medicos")}/>

    <Libtn name='Sesiones' className="seccions  list-group-item    mt-2 text-white p-1"  onClick={()=> setTipos('Sesion')}/>

<Libtn className='seccions  list-group-item    mt-2 text-white p-1' name='Historial'  onClick={()=> setTipos('Historial')} />
    
 {userData &&(<div className='bg bg-white m-3'>
  <h5>Usuario Activo</h5>
  <ul key={userData.id} className='list-group m-0 '>
  <li className='list-group-item'>Usuario: {userData.nombre}</li>
  <li className='list-group-item'>Cargo: {userData.cargo}</li>

  </ul>
 </div>)}
    </div>
    <div className='inputs row col-lg-11  border border-2   vh-200  '>
      
 <div className=' ListaTurnos shadow  col-lg-12 m-2 bg-white '>
  <Calendario/>
 </div>

 <div className='subSeccions shadow col-lg-3 ms-2 p-3 bg-white '>
  
  {Tipos ===  'Dashboard' &&(<Ul 
  titulo='Buscar'
  names={['Pacientes'

  ]}
  
  onSelect={setAction}
  
  > 
  
  <SearchInput onSearch={(data) =>setResult(data ||'')} method='POST'     url='http://localhost:3000/SearchPaciente' />
  
</Ul> )}

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
>
<SearchInput onSearch={(data) =>setResult(data || '')} method='POST'     url='http://localhost:3000/SearchMedico' />
  <MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Selecionar'}/>


</Ul>)}

{Tipos === "Sesion" && (<Ul
titulo='Sesion'
names={['Iniciar','Cerrar', 'Agregar', 'Quitar']}
onSelect={setAction}
>
 <SearchInput onSearch={(data) =>setResult(data || '')} method='POST'     url='http://localhost:3000/SearchMedico' />
  <MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Selecionar'}/>

</Ul>)}

 {Tipos ===  'Historial' &&(<Ul 
  titulo='Historial'
  names={['Agregar (Al Hist.)'

  ]}
  
  onSelect={setAction}
  
  > 
  
  <SearchInput onSearch={(data) =>setResult(data ||'')} method='POST'     url='http://localhost:3000/SearchPaciente' />
  <MiniTabla DatosPaci={result} onEditar={handleSelecionar} name={'Selecionar'}/>
</Ul> )}


 </div>
 <div className='inputsDeSubseccions shadow col-lg-8 ms-2 bg-white '>

  {!action && (<Text texto='Seleccione una opcion para ver el formulario' />)}

  {action === "Pacientes"  && (<TablePacientes Datos={result || ""} />)}
 
 
 

  {( action === 'Alta Paciente') && (<Formulario
  
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

  {( action === 'Editar Paciente')&& ( !pacienteSeleccionado )? (<Formulario
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
 
  valoresIniciales={undefined}
  method='GET'
  url=''
   />
  ):action === 'Editar Paciente' &&(pacienteSeleccionado) && (<Formulario
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
 
   valoresIniciales={pacienteSeleccionado ||[] }
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

  {action === 'Editar'&&  (!pacienteSeleccionado) ?(<Formulario
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
 
  valoresIniciales={undefined }

  method='GET'
  url=''
  />):action === 'Editar'&& (pacienteSeleccionado) &&(<Formulario
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
 
  valoresIniciales={pacienteSeleccionado || []}
  method='PUT'
  url={`http://localhost:3000/UpdateTurno/${pacienteSeleccionado.id}`}
  
  />)}

  {action === 'Cancelar'&& (!pacienteSeleccionado) ?(<Formulario
  
  titulo='Cancelar'
  campos={[
    
    {name:'nombre' , required: true},
    {name:'apellido' , required: true},
    {name:'dni', type:'number' , required: true},
    {name:'fecha', type:'Date' , required: true},
    {name: 'hora', type:'time' , required: true},
    

  ]}
  nameBtn='Eliminar'
    valoresIniciales={undefined}
  method='GET'
  url=''
  />): action === 'Cancelar' && (pacienteSeleccionado)&& (<Formulario
  
  titulo='Cancelar'
  campos={[
    
    {name:'nombre' , required: true},
    {name:'apellido' , required: true},
    {name:'dni', type:'number' , required: true},
    {name:'fecha', type:'Date' , required: true},
    {name: 'hora', type:'time' , required: true},
    

  ]}
  nameBtn='Eliminar'
    valoresIniciales={pacienteSeleccionado || []}
  method='DELETE'
  url={`http://localhost:3000/EliminarTurno/${pacienteSeleccionado.id}`}
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
{action === 'Editar_M' && (!pacienteSeleccionado)? (<Formulario
    titulo='Editar Medico'
    campos={[
     {name: "nombre", required: true},
    {name:"apellido", required: true},
    {name: "matricula", required: true},
    {name: "especialidad" , required: true}
    ]}
    valoresIniciales={undefined}
    method='GET'
    url=''
  
/>): action === 'Editar_M' && (pacienteSeleccionado)&& (<Formulario
    titulo='Editar Medico'
    campos={[
     {name: "nombre", required: true},
    {name:"apellido", required: true},
    {name: "matricula", required: true},
    {name: "especialidad" , required: true}
    ]}
    valoresIniciales={pacienteSeleccionado || []}
    method='PUT'
    url={`http://localhost:3000/UpdateMedico/${pacienteSeleccionado.id}`}
    
  
/>)}
  
  {action === 'Eliminar_M' && (!pacienteSeleccionado)? (<Formulario
  
  titulo='Eliminar Medico'
  campos={[
       {name: "nombre", required: true},
    {name:"apellido", required: true},
    {name: "matricula", required: true},
    {name: "especialidad" , required: true}
    
  ]}
  valoresIniciales={undefined}
  method='GET'
  url={''}
  
  />): action === 'Eliminar_M' && (pacienteSeleccionado) && (<Formulario
  
  titulo='Eliminar Medico'
  campos={[
       {name: "nombre", required: true},
    {name:"apellido", required: true},
    {name: "matricula", required: true},
    {name: "especialidad" , required: true}
    
  ]}
  valoresIniciales={pacienteSeleccionado || []}
  method='DELETE'
  url={`http://localhost:3000/EliminarMedico/${pacienteSeleccionado.id}`}
  
  />)}

  {action === 'Iniciar' && (<Formulario
  titulo='Iniciar Sesion'
  campos={[
    {name: "Usuario",type: "selector",url:'http://localhost:3000/ConsUsuario', required:true},
    {name: "Contraseña", type:"password", required: true}
  ]}
  
  method='POST'
  url='http://localhost:3000/PostUsuario'
  headers={{"Content-Type":"application/json"}} 
  onUserData={setUserData}
  />
  
  
)}

  {action === 'Cerrar' && (<Formulario
  
  titulo='Cerrar Sesion'
campos={[
  {name: 'Contraseña', required: true, type: 'password'}
]}
  nameBtn='Cerrar'
  
  />
)}

{action === 'Agregar' && (<Formulario
 titulo=  "Agregar Usuario"
 
 campos={[
  {name: "apellido", required: true},
  {name: 'contraseña', type: "password" , required: true},
  {name:'cargo' , required:true },
  {name: 'tipo', required: true}
 ]}

method='POST'
url={`http://localhost:3000/IngresarUsuario/${pacienteSeleccionado?.id || ""}`}
valoresIniciales={pacienteSeleccionado || ""}
/>
 
    
)}

{action === 'Agregar (Al Hist.)' &&(<TablaHistorial data={HistorialPaciente} valoresIniciales={pacienteSeleccionado || ""}/>)}



 </div>
    </div>

  </div>
  </>
 )
}

export default App
