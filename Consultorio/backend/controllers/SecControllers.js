import bd from "../model/bd.js";
import { io } from "../app.js";




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
                end: new Date(fecha.getTime() + 30 * 60000), // 30 minutos
            }
         });
        
};

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
        
        

        const data = await bd.consPaciente(apellido)
        
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

// Continuar con la eliminacion de turno

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
        
        return  res.status(200).json(datos);
    }
    
} catch (error) {
    
}
 };

 const ConsultarTurno = async (req,res)=>{
    try {
       const eventos = FormatearEventos(await bd.ConsultarTurno())
         
         return res.status(200).json(eventos)
   
         
    } catch (error) {
        return res.status(500).json({mensaje: 'Error interno en el servidor', error})
    }
 }

 
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
         const Validar = bd.ValidMedico(req.params.id);
         if(!Validar){
            return res.status(404).json({mensaje: 'Medico no encontrado'})
         }
         const medico = {
            id: Validar.id, 
            nombre: req.body.nombre, 
            apellido: req.body.apellido,
            matricula: req.body.matricula,
            especialidad: req.body.especialidad

         }
         await bd.UpdateMed(medico);
         return res.status(200).json({mensaje: 'Medico actualizado'})
  } catch (error) {
   return res.status(500).json({ mensaje: "Error interno del servidor", error });
    
  }
 }
export default {
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
     EditarMedico

}