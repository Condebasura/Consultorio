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
        const {apellido} = req.body;
        
        console.log("El apellido desde el front", apellido);

        const data = await bd.consPaciente(apellido)
        console.log('el data', data)
        if(!data){
            res.status(209).json({mensaje:'No existe el paciente'})
        }else{
            console.log("El paciente es", data)
            res.status(200).json(data);
        }
    } catch (error) {
        console.log('Error en la busqueda del paciente', error)
    }
}

export default {
    AltaPaciente,
    SearchPaciente
}