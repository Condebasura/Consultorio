import bd from "../model/bd.js";
import { _dirname, io } from "../app.js";
import {v4 as uuidv4} from 'uuid';
import session from "express-session";
import { error } from "console";
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
        }else{
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
                console.log("Me logeo", userId)
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
                console.log("Eventos de secretaria",apellido , eventos, userId)
              io.to(userId).emit("Turnos-Actualizados", eventos)
               
      

        }if(rol === "Medico"){
            eventos = FormatearEventos(await bd.ConsultTurnoPorMedico(apellido))
            const userId = req.session.usuario.id;
            console.log("Eventos segun el medico",apellido , eventos, userId)
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
    const eventos = FormatearEventos(await bd.ConsultarTurno())
      const EventVisibles = eventos.filter((e) =>{
        let rol = req.session.usuario?.rol;
        let apellido = req.session.usuario?.apellido;
        if(e.medico === apellido){

            return e;
        }if(rol  === "Secretaria"){
            return eventos
        }
    });


    const userId= req.session?.usuario?.id;
    
    req.session.destroy(err =>{
        if(err){
            return res.status(500).json({error: 'Error al cerrar sesion'})
        }
        if(userId){
            
            io.emit('session:updated')
         
        }
        
        io.emit("Turnos-Actualizados", EventVisibles)
    res.json({ok: true})
    })
}




const AltaPaciente =  async(req , res)=>{
    const paci = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        telefono: req.body.telefono,
        email: req.body.email,
        direccion: req.body.direccion,
        obrasocial: req.body.obraSocial,
        afiliado: req.body.afiliado,

    }

   let data = await bd.InsertPaciente(paci)

   if(data){
    console.log(`El Paciente ${paci.nombre} ingreso correctamente`)
    res.status(200).json({mensaje: `El Paciente ${paci.nombre} ingreso correctamente`})
   }
   else{
    console.log(`ocurrio un error al ingresar el paciente`)
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
           
            res.status(200).json(data);
        }
    } catch (error) {
        console.log('Error en la busqueda del paciente', error)
    }
};

const SearchTurno  = async (req, res)=>{
    try {
        const {apellido} = req.body;
        
        

        const data = await bd.consTurno(apellido)
        console.log(data)
        if(apellido === "" ){
            res.status(404).json({mensaje:'No existe el paciente'})
        }else{
           
            res.status(200).json(data);
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
    
    const paciente = {
        id: validar.id,
        nombre: req.body.nombre, 
        apellido: req.body.apellido,
        dni: req.body.dni,
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
   return res.status(500).json({ mensaje: "Error interno del servidor" });
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
    console.log(paci)

    const datos = await bd.AsignarTurno(paci);
    
    if(!datos){
        return res.status(409).json({mensaje:'No fue posible asignar el turno o esta ocupado'})
    }else{
        const eventos = FormatearEventos(await bd.ConsultarTurno())
        
        io.emit("Turnos-Actualizados", eventos);
        return res.status(200).json({mensaje: 'El turno fue asignado correctamente', ok: true})
    }


}
 catch (error) {
    console.log(error)
    return res.status(500).json({mensaje: 'Error interno del servidor', error})
 }
 };

 const ActualizarTurno = async (req, res)=>{
    try {
        const validar = await bd.ValidarTurno(req.params.id)

        if(!validar){
            return res.status(404).json({mensaje: "Turno no encontrado"});
        }

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

        console.log("En el back", paciente)
        await bd.UpdateTurno(paciente)
        const evento = FormatearEventos(await bd.ConsultarTurno())
        io.emit("Turnos-Actualizados", evento)
        return res.status(200).json({mensaje: 'Turno actualizado correctamente'})
    } catch (error) {
   return res.status(500).json({ mensaje: "Error interno del servidor", error });
        
    }
 };



 const EliminarTurno = async (req, res)=>{

    try {
        let id = await req.params.id;
        
        bd.DeleteTruno(id)
        
        const eventos = FormatearEventos(await bd.ConsultarTurno())
        io.emit("Turnos-Actualizados", eventos);
    } catch (error) {
        console.log("error al eliminar")
    }
 }

 const ConsultMedico = async (req, res)=>{
try {
    
    
    
    const datos = await bd.ConsMedico();
    

    if(!datos){
        console.log("No se encontraron medicos");
        return res.status(409).json({mensaje: "No se encontraron medicos"})
    }else{
        console.log(datos)
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
            console.log("Eventos segun el medico",apellido , eventos, userId)
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
         console.log(Validar);
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
                console.log("El id coincide" , Validar)
                console.log(medico)
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

    const paci ={
        paciente_id:validar.id,
        descripcion: req.body.Historial
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
        
        return res.status(200).json(historial)
     }  
    } catch (error) {
        console.log("Error al obtener el historial", error);
        return res.status(500).json({mensaje: "Error interno del servidor", error})
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
     ConsultRoles 
     

}