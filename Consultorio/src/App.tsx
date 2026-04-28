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
import Sesiones from './components/Sesion';
import type { Usuario } from './components/Sesion';
import { io } from 'socket.io-client';



function App() {
    const [result , setResult] = useState<any[]>([]);
     const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any | null>(null);
     const [HistorialPaciente, setHistorialPaciente] = useState<any[]>([]);
     const [ setUserData] = useState<Usuario | any>();
     const [refreshSesion , setRefreshSesion] = useState(0);
   const [config, setConfig] = useState<{ API_URL: string } | null>(null);
     

useEffect(()=>{
      
      const getURL = async (url?: string)=>{
         try {
          url  = `http://localhost:3000/config`;
          const res = await fetch(url || "/config");
          const data = await res.json();
          return data;
        } catch (error) {
          console.log("error en el fetch", error)
        }
      }
      const fetchData =  async ()=>{
        
        let api = await getURL();
        setConfig(api);
        
      };
      fetchData();
    },[])

console.log(config?.API_URL)     
     useEffect(()=>{
      let url  = `http://localhost:3000/`;
      const socket = io(url || `/`);

      socket.on('session:updated' , ()=>{
        setRefreshSesion(prev => prev + 1);
        
       
      });
      return ()=>{
        socket.off('session:updated');
        socket.disconnect();
      }
     },[])

     
    
   
    
   

     function useSesion(url: string , refreshSesion: number){
     const [sesion , setSesion] = useState<{ usuario: Usuario}| null> (null);
     const [loadng, setLoading] = useState(true);
     
    

     
     useEffect(() =>{
        const fetchSesion = async()=>{
        try {
          
          await fetch(url, {credentials:'include'})
           .then(res => res.ok ? res.json() : null)
           .then(data => setSesion(data))
           .finally(()=> setLoading(false))
        } catch (error) {
          console.log("error en el fetch", error)
        }
        }
        fetchSesion();
      }, [url ,refreshSesion])
      return {sesion , loadng}
    }

   
     
  
 

    const handleSelecionar =  (pacienteSeleccionado: any)=>{
      setPacienteSeleccionado(pacienteSeleccionado);
      
       fetch(`${config?.API_URL}/VerHistorialPaciente/${pacienteSeleccionado?.id}`).then(res => res.json()).then(data =>{
              if(data && Array.isArray(data)){
              
                setHistorialPaciente(data);
        
              }else{

                setHistorialPaciente([]);
              }
            })
          }
        
  




const {sesion } = useSesion(`${config?.API_URL}/sesion`, refreshSesion)



  const [Tipos, setTipos] = useState('Sesiones');
  const [action , setAction] = useState<string |null>(null);
 const [isDisabled ] = useState(false);

 useEffect(()=>{
  setResult([]);
 },[Tipos ,action ]);

useEffect(()=>{

},[pacienteSeleccionado])

 
  return(
  <>
  
  <div className='flex flex-row  '>
    <ul className='flex flex-col rounded-l-xl text-start  basis-36  gap-2 bg-[#0B1238] m-2 me-1  '>
      

<Libtn isDisabled={isDisabled || sesion?.usuario.rol === 'Administrador' || sesion?.usuario.rol === undefined} className='seccions flex flex-row   items-center rounded-sm list-none text-sm  mt-2 mx-2 p-2 bg-[#5A5D90] text-white' name='Pacientes'onClick={()=> setTipos('Pacientes')}
  >
    <i className="fa-solid fa-user-injured me-2 text-sm  "></i>
  </Libtn>

<Libtn isDisabled={isDisabled || sesion?.usuario?.rol !== 'Secretaria'} onClick={()=> setTipos('Turnos')}   className={'seccions rounded-sm list-none flex flex-row items-center   mt-2 mx-2  p-2 bg-[#5A5D90] text-white text-sm'} name='Turnos'>
    <i className="fa-solid fa-calendar-check me-2 text-sm"></i>
</Libtn>

  <Libtn isDisabled={isDisabled || sesion?.usuario.rol !== 'Administrador'} className='seccions flex flex-row items-center rounded-sm list-none mt-2  p-2 bg-[#5A5D90] text-white mx-2 text-sm' name='Medicos' onClick={()=> setTipos("Medicos")}>  
    <i className="fa-solid fa-user-doctor me-2 text-sm"></i>
  </Libtn>

    <Libtn  name='Sesiones' className="seccions flex flex-row items-center rounded-sm list-none    mt-2  p-2 bg-[#5A5D90] text-white mx-2 text-sm"  onClick={()=> setTipos('Sesiones')}> <i className="fa-solid fa-user me-2 text-sm"></i></Libtn>

<Libtn  isDisabled={isDisabled || sesion?.usuario.rol !== 'Medico'} className='seccions flex flex-row items-center rounded-sm  list-none     mt-2  p-2 bg-[#5A5D90] text-white mx-2 text-sm' name='Historial'  onClick={()=> setTipos('Historial')}>  <i className="fa-solid fa-file-medical me-2 text-sm"></i></Libtn>

<Libtn isDisabled={isDisabled ||sesion?.usuario.rol === 'Medico'  || sesion?.usuario.rol === undefined}
className='seccions flex flex-row items-center rounded-sm  list-none     mt-2  p-2 bg-[#5A5D90] text-white mx-2 text-sm' name='Horarios' onClick={()=> setTipos('Horarios')}>  <i className="fa-solid fa-users me-2 text-sm"></i>

</Libtn>
    
{<Sesiones
titulo='Sesion Activa'
sesion={sesion ?? null}
/>}
    </ul>
    <div className='inputs flex flex-col w-full'>
      
 <div className=' ListaTurnos shadow  m-2 bg-white '>
  
  <Calendario 
  credentials={'include'}
  url={`${config?.API_URL}/ConsTurno`}
  usuario={sesion?.usuario}
   />
 </div>


<div className='flex flex-row'>
 <div className='subSeccions rounded-md shadow basis-1/3 m-2  pt-0 bg-gray-100 flex flex-col text-center'>
  
  

{Tipos === 'Pacientes' && (<Ul 
titulo='Pacientes'
names={['Listado de Pacientes','Alta Paciente', 'Editar Paciente']}
onSelect={setAction}


>
<SearchInput onSearch={(data) =>setResult(data ||'')}  method='POST'     url={`${config?.API_URL}/SearchPaciente`}/>
  {action !== "Listado de Pacientes" && <MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Editar'}/> }


</Ul>) }

{Tipos === 'Turnos' && (<Ul
titulo='Turnos'
names={['Crear','Editar', 'Cancelar']}
onSelect={setAction}
>
{action === "Crear" ? <SearchInput onSearch={(data) =>setResult(data ||'')} method='POST'     url={`${config?.API_URL}/SearchPaciente`}/>: <SearchInput onSearch={(data) =>setResult(data || '')} method='POST'     url={`${config?.API_URL}/SearchTurno`}/>}
<MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Selecionar'}/>

</Ul>)}


{Tipos === 'Medicos' && (<Ul 
titulo='Medicos'
names={['Ingresar_M','Editar_M', 'Eliminar_M' ]}
onSelect={setAction}
>
<SearchInput onSearch={(data) =>setResult(data || '')} method='POST'     url={`${config?.API_URL}/SearchMedico`}/>
  <MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Selecionar'}/>


</Ul>)}

{Tipos === "Sesiones" && (<Ul
titulo='Sesion'
names={['Iniciar','Cerrar', 'Agregar', 'Quitar']}
isDisabled={(name)=> (name === 'Agregar'&& sesion?.usuario.rol !== 'Administrador') ||  (name === 'Quitar'&& sesion?.usuario.rol !== 'Administrador') }
onSelect={setAction}
>
  { action === "Quitar" ? (<SearchInput onSearch={(data) =>setResult(data || '')} isDisabled={sesion?.usuario.rol !== 'Administrador'} method='POST'     url={`${config?.API_URL}/SearchUsuario`}/>): 
 <SearchInput onSearch={(data) =>setResult(data || '')}isDisabled={sesion?.usuario.rol !== 'Administrador'} method='POST'     url={`${config?.API_URL}/SearchMedico`}/>
}
  <MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Selecionar'}/>

</Ul>)}

 {Tipos ===  'Historial' &&(<Ul 
  titulo='Historial'
  names={['Agregar (Al Hist.)'

  ]}
  
  onSelect={setAction}
  
  > 
  
  <SearchInput onSearch={(data) =>setResult(data ||'')} method='POST'     url={`${config?.API_URL}/SearchPaciente`}/>
  <MiniTabla DatosPaci={result} onEditar={handleSelecionar} name={'Selecionar'}/>
</Ul> )}

{Tipos === 'Horarios' &&(<Ul
titulo='Horarios'
names={[
  'Ver' , 'Agregar (hs)' , 'Editar (hs)' , 'Quitar (hs)'
]}
isDisabled={(name)=> (name === 'Agregar (hs)'&& sesion?.usuario.rol !== 'Administrador') ||  (name === 'Editar (hs)'&& sesion?.usuario.rol !== 'Administrador') || (name === 'Quitar (hs)'&& sesion?.usuario.rol !== 'Administrador') }
onSelect={setAction}
>
  <SearchInput onSearch={(data) =>setResult(data || '')}isDisabled={sesion?.usuario.rol !== 'Administrador'} method='POST'     url={`${config?.API_URL}/SearchMedico`}/>
  <MiniTabla DatosPaci={result} onEditar={(DatosPaci)=> setPacienteSeleccionado(DatosPaci) } name={'Selecionar'}/>

</Ul>)}

 </div>
 <div className='inputsDeSubseccions rounded-md flex flex-col basis-1/1 shadow  m-2 bg-gray-100  '>

  {!action && (<Text  texto='Seleccione una opcion para ver el formulario'/>)}

  {action === "Listado de Pacientes"  && (<TablePacientes Datos={result || ""}/>)}
 
 
 

  {( action === 'Alta Paciente') && (<Formulario
  
  titulo='Alta'
  campos={[
    {name: "nombre" , required: true},
    {name:"apellido" , required: true},
    {name: "dni", type:"number", required: true},
    {name:"nacimiento", type:"date" , required: true},
    {name:"telefono", type:"number", required: true},
    {name:"email", type:"email" , required: true},
    {name:"direccion" , required: true},
    {name:"obraSocial" , required: true},
    {name:"afiliado", type:"number" , required: true}
  ]}
  credentials='omit'
  url= {`${config?.API_URL}/AltaPaciente`}
  method="POST"
  
 />)}

  {( action === 'Editar Paciente')&& ( !pacienteSeleccionado )? (<Formulario
   titulo='Editar'
   campos={[
   
  {name: "nombre", required: true },
    {name:"apellido" , required: true},
    {name: "dni", type:"number" , required: true},
    {name:"nacimiento", type:"date" , required: true},
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
    {name:"nacimiento", type:"date" , required: true},
    {name:"telefono", type:"number" , required: true},
    {name:"email", type:"email" , required: true},
    {name:"direccion" , required: true},
    {name:"obraSocial" , required: true},
    {name:"afiliado", type:"number" , required: true}
      
   ]}
 
   valoresIniciales={pacienteSeleccionado ||[] }
   method="PUT"
   credentials='omit'
   url={`h${config?.API_URL}/UpdatePaciente/${pacienteSeleccionado.id}`}
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
    {name: "medicoApellido", type:"selector",NameSelect:"medico", url:`${config?.API_URL}/ConsMedico`, required: true}

    
  ]}
 

  method='POST'
  credentials='include'
  url={`${config?.API_URL}/CrearTurno`}
  valoresIniciales={
  pacienteSeleccionado || {}}
  onUserData={(usuario)=>{
    setUserData(usuario)
  }}
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
    {name: "medicoApellido", type:"selector",NameSelect:"medico", url:`${config?.API_URL}/ConsMedico`, required: true}
    
  ]}
 
  valoresIniciales={undefined }

  method='GET'
  credentials='include'
  url=''
  onUserData={(usuario)=>{
    setUserData(usuario)
  }}
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
    {name: "medicoApellido", type:"selector",NameSelect:"medico", url:`${config?.API_URL}/ConsMedico`, required: true}
    
  ]}
 
  valoresIniciales={pacienteSeleccionado || []}
  method='PUT'
  credentials='include'
  url={`${config?.API_URL}/UpdateTurno/${pacienteSeleccionado.id}`}
  onUserData={(usuario)=>{
    setUserData(usuario)
  }}
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
  credentials='include'
  url=''
  onUserData={(usuario)=>{
    setUserData(usuario)
  }}
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
  credentials='include'
  url={`${config?.API_URL}/EliminarTurno/${pacienteSeleccionado.id}`}
  onUserData={(usuario)=>{
    setUserData(usuario)
  }}
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
url={`${config?.API_URL}/IngresarMedico`}

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
    url={`${config?.API_URL}/UpdateMedico/${pacienteSeleccionado.id}`}
    
  
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
  url={`${config?.API_URL}/EliminarMedico/${pacienteSeleccionado.id}`}
  
 />)}

  {action === 'Iniciar' && (<Formulario
  titulo='Iniciar Sesion'
  campos={[
    {name: "apellido",type: "selector",NameSelect:"usuario",url:`${config?.API_URL}/ConsUsuario`, required:true},
    {name: "contraseña", type:"password", required: true}
  ]}
  
  method='POST'
  url={`${config?.API_URL}/PostUsuario`}
  credentials='include'
  headers={{"Content-Type":"application/json"}} 
 onUserData={(usuario)=>{
          setUserData(usuario)
         
}}
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
  url={`${config?.API_URL}/logout`}
onUserData={(usuario)=>{
          setUserData(usuario)
         
}}
 />
) }

{action === 'Agregar' &&(pacienteSeleccionado)? (<Formulario
 titulo=  "Agregar Usuario"
 
 campos={[
  {name: "apellido", required: true},
  {name: 'contraseña', type: "password" , required: true},
  {name:'cargo' , required:true },
  {name: 'tipo',  type: "selector",NameSelect:"rol", url:`${config?.API_URL}/ConsRol`,required: true}
 ]}
children={<p>Para agregar un medico primero busquelo en el panel lataral</p>}
method='POST'
credentials='omit'
url={`${config?.API_URL}/IngresarUsuarioMedico/${pacienteSeleccionado?.id || ""}`}
valoresIniciales={pacienteSeleccionado || ""}
/>): action === "Agregar" && (!pacienteSeleccionado) && (<Formulario
 titulo=  "Agregar Usuario"
 
 campos={[
  {name: "apellido", required: true},
  {name: 'contraseña', type: "password" , required: true},
  {name:'cargo' , required:true },
  {name: 'tipo',  type: "selector",NameSelect:"rol", url:`${config?.API_URL}/ConsRol`,required: true}
 ]}
children={<p>Para agregar un medico primero busquelo en el panel lataral</p>}
method='POST'
credentials='omit'
url={`${config?.API_URL}/IngresarUsuario`}
valoresIniciales={pacienteSeleccionado || ""}
/>)}


{action === "Quitar" && (<Formulario

titulo='Eliminar Usuario'

campos={[
  {name: "apellido", required: true},
  {name:'cargo', required:true}, 
  {name: 'tipo',  type: "selector",NameSelect:"rol", url:`${config?.API_URL}/ConsRol`,required: true}
]}
nameBtn='Eliminar'
children={<p>Use el buscador para selecionar y eliminar un usuario</p>}
method='DELETE'
credentials='omit'
url={`${config?.API_URL}/EliminarUsuario/${pacienteSeleccionado?.id}`}
valoresIniciales={pacienteSeleccionado || ""}
/>)}

{action === 'Agregar (Al Hist.)' &&(<TablaHistorial data={HistorialPaciente} valoresIniciales={ pacienteSeleccionado || ""}/>)}

{action === 'Agregar (hs)' &&(<Formulario
titulo='Agregar Horario'
campos={[
{name: "nombre", required: true},
    {name:"apellido", required: true},
    {name: "especialidad" , required: true},
    {name:"dia", type:"selector",NameSelect:"día", url:`${config?.API_URL}/ConsDia`,required: true},
    {name: 'mañana_desde', type: "time" },
    {name: 'mañana_hasta', type: "time" },
    {name: 'tarde_desde', type: "time"  },
    {name: 'tarde_hasta', type: "time" }
    
]}
valoresIniciales={pacienteSeleccionado || []}
method='POST'
credentials='omit'
url={`${config?.API_URL}/AddHorario/${pacienteSeleccionado?.id || ""}`}
/>)}
</div>
 </div>
    </div>

  </div>
  </>
 )
}

export default App
