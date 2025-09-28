import bd from "../model/bd.js";

const AltaPaciente =  async(req , res)=>{
    const paci = {
        nombre: req.body.Nombre,
        apellido: req.body.Apellido,
        dni: req.body.DNI,
        telefono: req.body.Telefono,
        email: req.body.Email,
        direccion: req.body.Direccion,
        obrasocial: req.body.ObraSocial,
        afiliado: req.body.Afiliado,

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
        const paciente = req.body.valor;
        console.log(paciente);

    } catch (error) {
        
    }
}

export default {
    AltaPaciente,
    SearchPaciente
}