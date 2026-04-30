import bd from "../model/bd.js";
import { _dirname, io } from "../app.js";
import path from "path";





function FormatearEventos(turnos){

    return  turnos.map((t)=>{
           // crear las fechas en hora local, asi evitamos restas o sumas automaticas
              const [year, month, day] = t.fecha.split('-').map(Number);
              const [hora, minuto] = t.hora.split(':').map(Number);
              const fecha = new Date(year, month - 1, day, hora, minuto);
              fecha.setHours(hora, minuto);
             
           
            return{
                id: t.id,
                title: `${t.nombre} ${t.apellido} - ${t.medico}`,
                start: fecha,
                end: new Date(fecha.getTime() + 30 * 60000),// 30 minutos

                paciente:{
                    nombre: t.nombre,
                    apellido: t.apellido,
                },
                medico: t.medico,

            }
         });
        
};

const getIndex = (req,res)=>{
    res.sendFile(path.join(_dirname,'..', 'dist', 'index.html'))
}

const SelectUsuario = async (req,res)=>{

    try {
        const Data = await bd.ConnsultarUsuario()
if(!Data){
    res.status(404).json({mensaje: "Ocurrio un error al cargar los datos"})
}
else{
    res.status(200).json(Data)
}

    } catch (error) {
        res.status(500).json({mensaje: "Error del servidor", error})
    }
 };


 const PostUsuario = async (req, res)=>{

    try {
        
        const user = {
            apellido: req.body.apellido,
            contraseña: req.body.contraseña,
        }
     
        const Data = await bd.SesionUsuario(user)
        
        if(!Data){
           
            return res.status(404).json({mensaje: "Credenciales incorrectas"})
        }if(req.session.usuario){
            return res.status(400).json({mensaje: "Ya hay una sesion activa"})
        }
        else{
            req.session.usuario = {
                id:Data.id,
                apellido: Data.apellido,
                cargo: Data.cargo,
                rol: Data.tipo
            };

            
            io.on('connection', socket =>{
                socket.on('register-session', userId =>{
                     socket.join(userId);
                    });
                })

                const userId = req.session.usuario;
               
                io.emit('session:updated')

            return res.status(200).json({ok: true})
        
        }

    } catch (error) {
        res.status(500).json({mensaje: 'Error interno del servidor', error})
        
    }
 };


  const GetSesion = async(req, res)=>{
        let eventos;

      if(req.session.usuario){
          let rol = req.session.usuario?.rol;
          let apellido = req.session.usuario?.apellido;

            if(rol === "Secretaria"){
      
               eventos = FormatearEventos(await bd.ConsultarTurno())
                const userId = req.session.usuario.id;
                
              io.to(userId).emit("Turnos-Actualizados", eventos)
               
      

        }if(rol === "Medico"){
            eventos = FormatearEventos(await bd.ConsultTurnoPorMedico(apellido))
            const userId = req.session.usuario.id;


              io.to(userId).emit("Turnos-Actualizados", eventos)
               
            }

           return res.status(200).json({
            logueado: true,
            usuario: req.session.usuario, 
            eventos,

            
        })
  



    }else{

    

        
        return res.status(401).json({logueado: false})
    }
};

const Logout = async(req, res)=>{
 
    const user={
        apellido: req.session.usuario?.apellido,
        contraseña: req.body.Contraseña,
    }

  const  Data = await bd.SesionUsuario(user)

    if(!Data){
        return res.status(404).json({mensaje: "Contraseña incorrecta"})
    }
   else{

       req.session.destroy(err =>{
           if(err){
               return res.status(500).json({error: 'Error al cerrar sesion'})
            }
            
            res.clearCookie("connect.sid");
            io.emit('session:updated');
            return res.redirect("/");
            
        })
    }
}




const AltaPaciente =  async(req , res)=>{

    let naci = req.body.nacimiento;
    const AñoNaci = naci.split("-")[0];
    const AñoActual = new Date().getFullYear();
    const edad = AñoActual - AñoNaci;
    
    const paci = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        nacimiento: req.body.nacimiento,
        edad: edad,
        telefono: req.body.telefono,
        email: req.body.email,
        direccion: req.body.direccion,
        obrasocial: req.body.obraSocial,
        afiliado: req.body.afiliado,

    }

   let data = await bd.InsertPaciente(paci)

  if(data){
    
    res.status(200).json({mensaje: `El Paciente ${paci.nombre} ingreso correctamente`})
   }
   else{
   
     res.status(209);
        res.json({mensaje: `ocurrio un error al ingresar el paciente`});
   }
}

const SearchPaciente  = async (req, res)=>{
    try {
        const {apellido} = req.body;
       
        

        const data = await bd.consPaciente(apellido);
        
      
        if(apellido === "" ){
            res.status(404).json({mensaje:'No existe el paciente'})
        }else{
             const FechaDataFormat = data.map((p)=>{
        const [year, month , day] = p.nacimiento.split("-");
        return{
            ...p,
            nacimiento: p.nacimiento,
            nacimientoIso: `${day}-${month}-${year}`
        };
      });
            res.status(200).json(FechaDataFormat);
        }
    } catch (error) {
        console.log('Error en la busqueda del paciente', error)
    }
};

const SearchTurno  = async (req, res)=>{
    try {
        const {apellido} = req.body;
        
        

        const data = await bd.consTurno(apellido)
      
      const FechaDataFormat = data.map((t)=>{
        const [year, month , day] = t.fecha.split("-");
        return{
            ...t,
            fecha: t.fecha,
            fechaIso: `${day}-${month}-${year}`
        };
      });
        if(apellido === "" ){
            res.status(404).json({mensaje:'No existe el paciente'})
        }else{
           
            res.status(200).json(FechaDataFormat);
        }
    } catch (error) {
        console.log('Error en la busqueda del paciente', error)
    }
};


 const ActualizarPaciente = async (req, res)=>{
try {
    
    const validar = await bd.validarPaciente(req.params.id)
    
    
    if (!validar) {
        return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }
      let naci = req.body.nacimiento;
    const AñoNaci = naci.split("-")[0];
    const AñoActual = new Date().getFullYear();
    const edad = AñoActual - AñoNaci;

    const paciente = {
        id: validar.id,
        nombre: req.body.nombre, 
        apellido: req.body.apellido,
        dni: req.body.dni,
        nacimiento: req.body.nacimiento,
        edad: edad,
        telefono: req.body.telefono,
        email: req.body.email,
        direccion: req.body.direccion,
        obraSocial: req.body.obraSocial,
        afiliado: req.body.afiliado,
        
    }
    await bd.UpdatePaciente(paciente);
    return res.status(200).json({mensaje: 'Paciente actualizado con exito'});
    
} catch (error) {
 console.log("error al actualizar el paciente" , error)    
   return res.status(500).json({ mensaje: "Ocurrio un error al actualizar el paciente" });
}
 };



 const CrearTurno = async (req , res)=>{
           

    try {
        
       
    const paci = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        telefono: req.body.telefono,
        fecha: req.body.fecha,
        hora: req.body.hora,
        observaciones: req.body.observaciones,
        medico:  req.body.medicoApellido
    }
    

    const datos = await bd.AsignarTurno(paci);
    
    
    if(!datos){
        return res.status(409).json({mensaje:'No fue posible asignar el turno o esta ocupado'})
    }else{
        
        
        
          let apellido = paci.medico;
          const Medico = await bd.SearchUsuario(apellido)
                
            
      
             const  eventos = FormatearEventos(await bd.ConsultarTurno())
              const enEventos = FormatearEventos(await bd.ConsultTurnoPorMedico(apellido))
                const userId = req.session.usuario.id;
           
              const MedicoId =   Medico[0].id;
                  
               
                io.to(userId).emit("Turnos-Actualizados", eventos)
                io.to(MedicoId).emit("Turnos-Actualizados", enEventos)
               
    
        
            
        return res.status(200).json({mensaje: 'El turno fue asignado correctamente', ok: true})
        
    }


}
 catch (error) {
    console.log(error)
    return res.status(500).json({mensaje: 'Ocurrio un error al crear el turno', error})
 }
 };

 const ActualizarTurno = async (req, res)=>{
    try {
        const validar = await bd.ValidarTurno(req.params.id)

        if(!validar){
            return res.status(404).json({mensaje: "Turno no encontrado"});
        }else{

            
            const  paciente = {
            id: validar.id,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            dni: req.body.dni,
            telefono: req.body.telefono,
            fecha: req.body.fecha,
            hora: req.body.hora, 
            observaciones: req.body.observaciones,
            medico: req.body.medicoApellido,
        }
        
        
        await bd.UpdateTurno(paciente)
        let apellido = paciente.medico;
        const Medico = await bd.SearchUsuario(apellido)
        
        
        
        const  eventos = FormatearEventos(await bd.ConsultarTurno())
        const enEventos = FormatearEventos(await bd.ConsultTurnoPorMedico(apellido))
        const userId = req.session.usuario.id;
        
        const MedicoId =   Medico[0].id;
        
        
        io.to(userId).emit("Turnos-Actualizados", eventos)
        io.to(MedicoId).emit("Turnos-Actualizados", enEventos)
        
        return res.status(200).json({mensaje: 'El turno se modificó correctamente', ok: true})       
    }
    } catch (error) {
   return res.status(500).json({ mensaje: "Error interno del servidor", error });
        
    }
 };



 const EliminarTurno = async (req, res)=>{

    try {
        let id = await req.params.id;
        
        bd.DeleteTruno(id)
        
             const  eventos = FormatearEventos(await bd.ConsultarTurno())
              
                const userId = req.session.usuario.id;
                io.to(userId).emit("Turnos-Actualizados", eventos)
        return res.status(200).json({mensaje:"Turno eliminado correctamente"})          
                
    } catch (error) {
        return res.status(500).json({mensaje: "Error al intentar eliminar el turno", error})
    }
 }

 const ConsultMedico = async (req, res)=>{
try {
    
    
    
    const datos = await bd.ConsMedico();
    

    if(!datos){
        console.log("No se encontraron medicos");
        return res.status(409).json({mensaje: "No se encontraron medicos"})
    }else{
       
        return  res.status(200).json(datos);
    }
    
} catch (error) {
    
}
 };

 const ConsultarTurno = async (req,res)=>{
    try {
        let eventos;
      if(req.session.usuario){
          let rol = req.session.usuario.rol;
          let apellido = req.session.usuario.apellido;

          if(rol === "Secretaria"){
      
               eventos = FormatearEventos(await bd.ConsultarTurno())
                const userId = req.session.usuario.id;
              io.to(userId).emit("Turnos-Actualizados", eventos)
              
      

        }if(rol === "Medico"){
            eventos = FormatearEventos(await bd.ConsultTurnoPorMedico(apellido))
            const userId = req.session.usuario.id;
           
              io.to(userId).emit("Turnos-Actualizados", eventos)
              
            }
            
            return res.status(200).json(eventos)
    } 

    } catch (error) {
        return res.status(500).json({mensaje: 'Error interno en el servidor', error})
    }
 }

  const ConsultRoles = async (req, res)=>{
try {
    
    
    
    const datos = await bd.ConsRol();
    

    if(!datos){
        console.log("No se encontraron roles");
        return res.status(409).json({mensaje: "No se encontraron roles"})
    }else{
        console.log(datos)
        return  res.status(200).json(datos);
    }
    
} catch (error) {
    res.status(500).json({mensaje: "Error interno del servidor", error})
}
 };
 
 const IngresoMedico = async (req, res)=>{
try {
    
    const medico = {
        nombre: req.body.nombre,
        apellido: req.body.apellido, 
        matricula: req.body.matricula,
        especialidad: req.body.especialidad
    }
    
    const data =  await bd.IngresarMedico(medico);
    
    if(!data){
        return res.status(409).json({mensaje:'No fue posible ingresar el medico'})
        
    }else{
        return res.status(200).json({mensaje: 'Medico ingresado correctamente'})
    }
    
} 
catch (error) {
    return res.status(500).json({mensaje: 'Error interno del servidor', error})
    
}
 };

 const SearchMed = async (req, res) =>{
   try {
    const {apellido} = req.body;
   const data = await bd.SearchMedico(apellido)
    if(!data){
        return res.status(404).json({mensaje:'No se encontro ningun medico'})
    }else{
        return res.status(200).json(data);
    }
    
   } catch (error) {
    res.status(500).json({mensaje: `Error al intentar la busqueda`, error})
   }
 };

 const EditarMedico = async(req,res)=>{
  try {
         const Validar = await bd.ValidMedico(req.params.id);
        
         if(!Validar){
            return res.status(404).json({mensaje: 'Medico no encontrado'})
         }else{

             const medico = {
                 id: Validar.id, 
                 nombre: req.body.nombre, 
                 apellido: req.body.apellido,
                 matricula: req.body.matricula,
                 especialidad: req.body.especialidad
                 
                }
                
                
                await bd.UpdateMed(medico);
                return res.status(200).json({mensaje: 'Medico actualizado'})
            }
            
  } catch (error) {
   return res.status(500).json({ mensaje: "Error interno del servidor", error });
    
  }
 };

 const EliminarMedico = async(req, res)=>{
    try {
        const id =  await req.params.id;
       bd.DeleteMedico(id)
      return res.status(200).json({mensaje: "Medico eliminado correctamente"})
    } catch (error) {
        console.log("error al eliminar", error)
    
    }
 };

 
 
 const IngresarUsuarioMedico = async (req , res)=>{
     try {
          const validar = await bd.ValidMedico(req.params.id);
            
              if(!validar){
                return res.status(400).json({mensaje: "Medico no valido"})
              
              
          }else{

              const usuario = {
                  medico_id: validar.id,
                  apellido: req.body.apellido,
                  contraseña: req.body.contraseña,
                  cargo: req.body.cargo,
                  tipo: req.body.tipo, 
                }
                if(usuario.tipo !== "Medico"){
            usuario.medico_id = null;
        }
                
                await bd.InsertUsuario(usuario);
                return  res.status(200).json({mensaje: "Se agrego el usuario"})
                
            }
        
    } catch (error) {
        return res.status(500).json({mensaje: "Error interno en el servidor", error})
    }
 };

 const IngresarUsuario = async (req , res)=>{
    try {
        const usuario = {
            medico_id: null,
             apellido: req.body.apellido,
             contraseña: req.body.contraseña,
             cargo: req.body.cargo,
             tipo: req.body.tipo, 
        }

        

        await bd.InsertUsuario(usuario);

        return res.status(200).json({mensaje:'Se agrego el usuario'})


    } catch (error) {
        return res.status(500).json({mensaje: 'Error interno en el servidor', error})
    }
 };

 const searchUser = async (req,res)=>{
     try {
    const {apellido} = req.body;
   const data = await bd.SearchUsuario(apellido)
    if(!data){
        return res.status(404).json({mensaje:'No se encontro ningun medico'})
    }else{
        return res.status(200).json(data);
    }
    
   } catch (error) {
    res.status(500).json({mensaje: `Error al intentar la busqueda`, error})
   }
 }

 const EliminarUsuario = async(req , res)=>{
    
    try {
        const id = await req.params.id;

        

        bd.DeleteUsuario(id)
    return res.status(200).json({mensaje:'Usuario el iminado con exito'})
    } catch (error) {
    console.log("error al eliminar", error)    
    }
    
 };





const AgregarHistorial = async (req , res)=>{
try {
    const validar = await bd.validarPaciente(req.params.id);
   if(!validar){
    res.status(409).json({mensaje: "Error al ingresar el historial"})
   }else{

let  medico_apellido = req.session.usuario.apellido;

 let medico_cargo = req.session.usuario.cargo;

    const paci ={
        paciente_id:validar.id,
        descripcion: req.body.Historial,
        medico: medico_apellido + " - " + medico_cargo,
        
        
    }
  
    await bd.InsertPaciHisto(paci)
 io.emit("Historial-Actualizado", await bd.ConsHistorial(req.params.id))
   
    return res.status(200).json({mensaje: "Se agrego al historial"})
}
} catch (error) {
    console.log("error en el servidor", error)
}
    
}


 const GetHistorial = async (req, res)=>{

    try {
        const historial =  await bd.ConsHistorial(req.params.id)
        
    
     if(!historial || historial.length === 0 ){
        return res.status(404).json({mensaje: "No hay historial previo "})
     }else{
       
        io.emit("Historial-Actualizado", historial)
        return res.status(200).json(historial)
     }  
    } catch (error) {
        console.log("Error al obtener el historial", error);
        return res.status(500).json({mensaje: "Error interno del servidor", error})
    }
 }


const GetDia = async (req, res)=>{
    try {
          const datos = await bd.SelectDia();
          if(!datos){
              return res.status(409).json({mensaje: "No hay dias disponibles"})
            }else{
              console.log("Los dias",datos)

              return res.status(200).json(datos);       
          }
    } catch (error) {
        console.log("error al obtener los dias", error);
    }
}

 const AddHorario = async (req, res)=>{
    try {
    const datos = {
        medico_id: req.body.id,
        apellido: req.body.apellido,
        nombre: req.body.nombre,
        especialidad: req.body.especialidad,
        dia: req.body.dia,
        mañana_desde: req.body.mañana_desde,
        mañana_hasta: req.body.mañana_hasta,
        tarde_desde: req.body.tarde_desde,
        tarde_hasta: req.body.tarde_hasta,
    }

    console.log(datos)
    if(!datos){
        return res.status(409).json({mensaje: "Error al agregar el horario"})
    }
    await bd.insertHorario(datos)
    return res.status(200).json({mensaje: "Se agrego el horario"})
    }    
    
     catch (error) {
        console.log("error al agregar el horario", error);
    }
 };

 const BuscarHorario = async (req , res) =>{
    try {
        const {apellido} = req.body;
        const data = await bd.SechHorario(apellido);

        
        if(!data){
            return res.status(404).json({mensaje: "No se encontro ningun horario"})
        }else{
            return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(500).json({mensaje: `Error al intentar la busqueda`, error})
    }
 }

export default {
    getIndex,
    AltaPaciente,
    SearchPaciente,
     ActualizarPaciente,
     CrearTurno,
     IngresoMedico, 
     ConsultMedico,
     ConsultarTurno,
     SearchTurno, 
     ActualizarTurno,
     EliminarTurno, 
     SearchMed, 
     EditarMedico, 
     EliminarMedico,
     IngresarUsuario,
     IngresarUsuarioMedico,
     AgregarHistorial,
     GetHistorial,
     SelectUsuario,
     PostUsuario, 
     searchUser,
     EliminarUsuario,
     GetSesion, 
     Logout,
     ConsultRoles,
     GetDia,
     AddHorario, 
     BuscarHorario
     

}