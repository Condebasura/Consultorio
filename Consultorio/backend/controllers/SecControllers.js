import bd from "../model/bd.js";

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
 }

export default {
    AltaPaciente,
    SearchPaciente,
     ActualizarPaciente
}