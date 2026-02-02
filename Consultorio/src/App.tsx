/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import './App.css'
import Libtn from './components/BtnLi';
import Ul from './components/Subseccions';
import Formulario from './components/Form';
import { io } from 'socket.io-client';


import SearchInput from './components/Search';
import TablePacientes from './components/TablaPacientes';
import MiniTabla from './components/MiniTabla';
import Calendario from './components/calendario';
import Text from './components/texto';
import TablaHistorial from './components/TablaHistorial';
import Sesiones from './components/Sesion';
import type { Usuario } from './components/Sesion';



function App() {
    const [result , setResult] = useState<any[]>([]);
     const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any | null>(null);
     const [HistorialPaciente, setHistorialPaciente] = useState<any[]>([]);
     const [userData , setUserData] = useState<Usuario |null>(null);
     const [refreshSesion , setRefreshSesion] = useState(0);
     
     useEffect(()=>{
      const socket = io('http://localhost:3000');

      socket.on('session:updated' , ()=>{
        setRefreshSesion(prev => prev + 1)
       
      });
      return ()=>{
        socket.off('session:updated');
        socket.disconnect();
      }
     },[])


     function useSesion(url: string , refreshSesion: number){
     const [usuario , setUsuario] = useState<Usuario |null>(null);
     const [loadng, setLoading] = useState(true);
     
    

     
     useEffect(() =>{
        const fetchSesion = async()=>{
        try {
          
          await fetch(url, {credentials:'include'})
           .then(res => res.ok ? res.json() : null)
           .then(data => setUsuario(data))
           .finally(()=> setLoading(false))
        } catch (error) {
          console.log("error en el fetch", error)
        }
        }
        fetchSesion();
      }, [url ,refreshSesion])
      return {usuario , loadng}
    }

   
     
 

    const handleSelecionar =  (pacienteSeleccionado: any)=>{
      setPacienteSeleccionado(pacienteSeleccionado);
      
       fetch(`http://localhost:3000/VerHistorialPaciente/${pacienteSeleccionado?.id}`).then(res => res.json()).then(data =>{
              if(data && Array.isArray(data)){
              
                setHistorialPaciente(data);
        
              }else{

                setHistorialPaciente([]);
              }
            })
          }
        
  

const {usuario , loadng} = useSesion("http://localhost:3000/sesion", refreshSesion)


  const [Tipos, setTipos] = useState('Dashboard');
  const [action , setAction] = useState<string |null>(null);
 const [isDisabled , setIsDisabled] = useState(false);

 useEffect(()=>{
  setResult([]);
 },[Tipos ,action ]);

useEffect(()=>{
  
},[pacienteSeleccionado])
 
  return(
  <>
  <div className='flex flex-row '>
    <div className='  text-start  basis-36  gap-2 p-3  '>
      
<Libtn  className=' seccions  list-none p-2 ps-1 bg-green-400  ' name='Dashboard'onClick={()=> setTipos('Dashboard')}/>

<Libtn isDisabled={isDisabled || usuario?.usuario.rol === 'Administrador' || usuario?.usuario.rol === undefined} className='seccions  list-none  mt-2  p-1' name='Pacientes'onClick={()=> setTipos('Pacientes')}/>

<Libtn isDisabled={isDisabled || usuario?.usuario.rol !== 'Secretaria'} onClick={()=> setTipos('Turnos')}   className={'seccions list-none    mt-2  p-1'} name='Turnos'/>

  <Libtn isDisabled={isDisabled || usuario?.usuario.rol !== 'Administrador'} className='seccions list-none mt-2  p-1' name='Medicos' onClick={()=> setTipos("Medicos")}/>

    <Libtn  name='Sesiones' className="seccions  list-none    mt-2  p-1"  onClick={()=> setTipos('Sesion')}/>

<Libtn  isDisabled={isDisabled || usuario?.usuario.rol !== 'Medico'} className='seccions  list-none     mt-2  p-1' name='Historial'  onClick={()=> setTipos('Historial')} />
    
{<Sesiones
titulo='Sesion Activa'
usuario={usuario?.usuario ?? null}
/>}
    </div>
    <div className='inputs flex flex-col  basis-400 '>
      
 <div className=' ListaTurnos shadow  m-2 bg-white '>
  <Calendario credentials={'include'}/>
 </div>
<div className='flex flex-row'>
 <div className='subSeccions shadow basis-1/3 m-2 p-3 bg-white '>
  
  {Tipos ===  'Dashboard' &&(<Ul 
  titulo='Buscar'
  names={['Pacientes'
]}
  isDisabled={(name)=> (name === 'Pacientes'&& usuario?.usuario.rol === 'Administrador') || (name === 'Pacientes'&& usuario?.usuario.rol === undefined)}
  onSelect={setAction}
  
  > 
  
  <SearchInput onSearch={(data) =>setResult(data ||'')} isDisabled={usuario?.usuario.rol === undefined} method='POST'     url='http://localhost:3000/SearchPaciente' />
  
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
titulo='Turnos'
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
isDisabled={(name)=> (name === 'Agregar'&& usuario?.usuario.rol !== 'Administrador') ||  (name === 'Quitar'&& usuario?.usuario.rol !== 'Administrador') }
onSelect={setAction}
>
  { action === "Quitar" ? (<SearchInput onSearch={(data) =>setResult(data || '')} isDisabled={usuario?.usuario.rol !== 'Administrador'} method='POST'     url='http://localhost:3000/SearchUsuario' />): 
 <SearchInput onSearch={(data) =>setResult(data || '')}isDisabled={usuario?.usuario.rol !== 'Administrador'} method='POST'     url='http://localhost:3000/SearchMedico' />
}
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
 <div className='inputsDeSubseccions  basis-1/1 shadow  m-2 bg-white  '>

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
  credentials='omit'
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
  credentials='omit'
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
   credentials='omit'
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
  credentials='omit'
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
  credentials='omit'
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
  credentials='omit'
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
  credentials='omit'
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
  credentials='omit'
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
credentials='omit'
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
    credentials='omit'
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
    credentials='omit'
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
  credentials='omit'
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
  credentials='omit'
  url={`http://localhost:3000/EliminarMedico/${pacienteSeleccionado.id}`}
  
  />)}

  {action === 'Iniciar' && (<Formulario
  titulo='Iniciar Sesion'
  campos={[
    {name: "apellido",type: "selector",url:'http://localhost:3000/ConsUsuario', required:true},
    {name: "contraseña", type:"password", required: true}
  ]}
  
  method='POST'
  url='http://localhost:3000/PostUsuario'
  credentials='include'
  headers={{"Content-Type":"application/json"}} 
  onUserData={usuario}
  />
  
  
)}

  {action === 'Cerrar' &&(<Formulario
  
  titulo='Cerrar Sesion'
campos={[
  {name: 'Contraseña', required: true, type: 'password'}
]}
  nameBtn='Cerrar'
  method='POST'
  credentials='include'
  url='http://localhost:3000/logout'

  />
) }

{action === 'Agregar' &&(pacienteSeleccionado)? (<Formulario
 titulo=  "Agregar Usuario"
 
 campos={[
  {name: "apellido", required: true},
  {name: 'contraseña', type: "password" , required: true},
  {name:'cargo' , required:true },
  {name: 'tipo',  type: "selector", url:"http://localhost:3000/ConsRol",required: true}
 ]}
children={<p>Para agregar un medico primero busquelo en el panel lataral</p>}
method='POST'
credentials='omit'
url={`http://localhost:3000/IngresarUsuarioMedico/${pacienteSeleccionado?.id || ""}`}
valoresIniciales={pacienteSeleccionado || ""}
/>): action === "Agregar" && (!pacienteSeleccionado) && (<Formulario
 titulo=  "Agregar Usuario"
 
 campos={[
  {name: "apellido", required: true},
  {name: 'contraseña', type: "password" , required: true},
  {name:'cargo' , required:true },
  {name: 'tipo',  type: "selector", url:"http://localhost:3000/ConsRol",required: true}
 ]}
children={<p>Para agregar un medico primero busquelo en el panel lataral</p>}
method='POST'
credentials='omit'
url="http://localhost:3000/IngresarUsuario"
valoresIniciales={pacienteSeleccionado || ""}
/>)}


{action === "Quitar" && (<Formulario

titulo='Eliminar Usuario'

campos={[
  {name: "apellido", required: true},
  {name:'cargo', required:true}, 
  {name: 'tipo',  type: "selector", url:"http://localhost:3000/ConsRol",required: true}
]}
nameBtn='Eliminar'
children={<p>Use el buscador para selecionar y eliminar un usuario</p>}
method='DELETE'
credentials='omit'
url={`http://localhost:3000/EliminarUsuario/${pacienteSeleccionado?.id}`}
valoresIniciales={pacienteSeleccionado || ""}
/>)}

{action === 'Agregar (Al Hist.)' &&(<TablaHistorial data={HistorialPaciente} valoresIniciales={ pacienteSeleccionado || ""}/>)}


</div>
 </div>
    </div>

  </div>
  </>
 )
}

export default App
