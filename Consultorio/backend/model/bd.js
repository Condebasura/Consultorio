import sqlite3 from 'sqlite3';
let bd = new sqlite3.Database('./data/BaseConsultorio.bd');
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
const saltRounds = 10;

bd.run('CREATE TABLE IF NOT EXISTS  pacientes (id TEXT PRIMARY KEY, nombre TEXT , apellido TEXT , dni INTEGRER , telefono INTEGRER , email TEXT ,  direccion TEXT , obraSocial TEXT , afiliado INTEGRER )');

bd.run('CREATE TABLE IF NOT EXISTS turnos (id TEXT PRIMARY KEY , nombre TEXT , apellido TEXT , dni TEXT , telefono TEXT, fecha TEXT, hora TEXT , observaciones TEXT , medico TEXT)');

bd.run("CREATE TABLE IF NOT EXISTS medicos(id TEXT PRIMARY KEY , nombre TEXT , apellido TEXT , matricula TEXT , especialidad TEXT )")

bd.run("CREATE TABLE IF NOT EXISTS usuarios(id TEXT PRIMARY KEY , medico_id TEXT , apellido TEXT , contraseña TEXT , cargo TEXT , tipo TEXT, FOREIGN KEY (medico_id) REFERENCES medicos(id))")

bd.run("CREATE TABLE IF NOT EXISTS historial(id TEXT PRIMARY KEY ,paciente_id TEXT NOT NULL, fecha TEXT NOT NULL DEFAULT (datetime('now', '-3 hours')), descripcion TEXT NOT NULL , FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ) ")

bd.run("CREATE TABLE IF NOT EXISTS roles(tipo TEXT)")

const InsertPaciente = async (paci)=>{
    try {
        const id = uuidv4();
        let stmt = bd.prepare('INSERT INTO pacientes(id , nombre , apellido, dni , telefono , email , direccion , obraSocial, afiliado ) VALUES(?,?,?,?,?,?,?,?,?)');
        stmt.run(id, paci.nombre , paci.apellido , paci.dni , paci.telefono , paci.email , paci.direccion , paci.obrasocial , paci.afiliado);
        stmt.finalize();
        return "Paciente ingresado con exito";
    } catch (err) {
        console.log("Error", err);
    }
};

const consPaciente = async (paciente)=>{
    try {
         return await new Promise((resolve,reject)=>{
            let sql = 'SELECT * FROM pacientes WHERE apellido LIKE ?';
            let paci = paciente;
            bd.all(sql, [`%${paci}%`], (err,rows)=>{
                if(err)
                {
                    console.log('El error del reject', err)
                reject(err)
                }else{
                    
                    resolve(rows);
                }
            })
         })        
    } catch (error) {
        console.log('El error del catch', error)
    }
}

const validarPaciente = (id)=>{

    return new Promise((resolve, reject)=>{
        let sql = 'SELECT * FROM pacientes WHERE id = ?';

        bd.get(sql , [id], (err , row)=>{
            if(err){
                
                 reject(err)
            }    
            if(row){
               
                resolve(row)
            }
        })
    })
}

const UpdatePaciente =  (paciente)=>{
    return new Promise((resolve, reject)=>{

        const sql = 'UPDATE pacientes SET id = ? , nombre = ? , apellido = ? , dni = ? , telefono = ? , email = ? , direccion = ? , obraSocial = ?, afiliado = ?  WHERE id = ?';
        bd.run(sql, [paciente.id, paciente.nombre , paciente.apellido , paciente.dni, paciente.telefono , paciente.email , paciente.direccion, paciente.obraSocial , paciente.afiliado, paciente.id], (err)=>{
            if(err){
                reject(err);
                console.log(err.mensaje)
            }else{
                resolve("el paciente se actualizo correctamente")
              
            }
        })
        
    })
};



const AsignarTurno = async (paci)=>{
    try {
        const id = uuidv4();
        let stmt = bd.prepare('INSERT INTO turnos(id , nombre , apellido, dni, telefono, fecha, hora , observaciones , medico) VALUES(?,?,?,?,?,?,?,?,?)');
        stmt.run(id, paci.nombre , paci.apellido, paci.dni, paci.telefono, paci.fecha, paci.hora , paci.observaciones , paci.medico);
        stmt.finalize();
        return "Turno asignado correctmente";
    } catch (error) {
        console.log("Ocurrio un error al asignar el turno", error)
    }
};


const IngresarMedico = async (medico)=>{
    try {
        const id = uuidv4();
        let stmt = bd.prepare('INSERT INTO medicos(id , nombre , apellido , matricula , especialidad) VALUES(?,?,?,?,?)');

        stmt.run(id , medico.nombre , medico.apellido , medico.matricula , medico.especialidad);
        stmt.finalize();
        return 'Medico ingrsado con exito';
    } catch (error) {
        console.log('Ocurrio un error al ingresar el  medico', error)
    }

};

const ConsMedico = ()=>{
    return new Promise((resolve, reject)=>{

        bd.all('SELECT * FROM medicos', (err , rows)=>{
            if(err){
                console.log(err.mensaje)
                reject(err)
            }else{
               
                resolve(rows)
            }
        })
})
};

const SearchMedico = (apellido)=>{
    return new Promise((resolve , reject)=>{

        let sql = 'SELECT * FROM medicos WHERE apellido LIKE ?';
        bd.all(sql, [`%${apellido}%`], (err , rows)=>{
            if(err){
                reject(err.mensaje)
            }else{
                resolve(rows)
            }
        })
    })
};

const ValidMedico = (id)=>{
    return new Promise((resolve, reject)=>{
        let sql = 'SELECT * FROM medicos WHERE id = ?';
        bd.get(sql, [id], (err,row)=>{
            if(err){
                
                reject(err)
            }if(row){
                
                resolve(row);
            }
        }
        )
    })
};

const UpdateMed = (medico)=>{
    return new Promise((resolve,reject)=>{
        const sql = 'UPDATE medicos SET id = ? , nombre = ? , apellido = ? , matricula = ?, especialidad = ? WHERE id = ?';
        bd.run(sql, [medico.id , medico.nombre, medico.apellido, medico.matricula, medico.especialidad, medico.id],
            (err)=>{
                if(err){
                    reject(err);

                }else{
                    resolve("Medico actualizado correctamente")
                   
                }
            }
        )
    })
};


const DeleteMedico =(id)=>{
    let sql = 'DELETE FROM medicos WHERE id = ?';
    bd.run(sql, [id], (err) =>{
        if(err){
             console.log("Error al eliminar el medico seleccionado")
        }else{
            console.log("Medico eliminado con éxito")
        }
    })
}

const ConsultarTurno = async ()=>{
    return  await new Promise((resolve, reject)=>{
        bd.all('SELECT * FROM turnos', (err,rows)=>{
            if(err){
                
                reject(err)
            }else{
                resolve(rows)
            }
        })
    })
};

 const ConsultTurnoPorMedico = async (apellido)=>{
    try {
        return await new Promise((resolve, reject)=>{
            let sql = 'SELECT * FROM turnos WHERE medico = ?';
            
            bd.all(sql, [apellido], (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    } catch (error) {
        console.log("se produjo un error en la busqueda de los turnos", error)
    }
 }

const consTurno = async (paciente)=>{
    try {
         return await new Promise((resolve,reject)=>{
            let sql = 'SELECT * FROM turnos WHERE apellido LIKE ?';
            let paci = paciente;
            bd.all(sql, [`%${paci}%`], (err,rows)=>{
                if(err)
                {
                    console.log('El error del reject', err)
                reject(err)
                }else{
                    
                    resolve(rows);
                }
            })
         })        
    } catch (error) {
        console.log('El error del catch', error)
    }
}

const ValidarTurno = (id)=>{
    return new Promise((resolve, reject)=>{
        let sql = 'SELECT * FROM turnos WHERE id = ?';
        bd.get(sql , [id], (err , row)=>{
            if(err){
                console.log(err)
                reject(err);
            }else{
                
                resolve(row)
            }
        })
    })
}

  const UpdateTurno = (paciente)=>{
    return new Promise((resolve, reject)=>{
         const sql = 'UPDATE turnos SET id = ? , nombre = ? , apellido = ? ,  dni = ? , telefono = ? , fecha = ? , hora = ? , observaciones = ? , medico = ?  WHERE id = ?';

         bd.run(sql, [paciente.id , paciente.nombre , paciente.apellido , paciente.dni , paciente.telefono , paciente.fecha , paciente.hora , paciente.observaciones , paciente.medico , paciente.id],
            (err)=>{
                if(err){
                    reject(err)
                    console.log(err.mensaje)
                }else{
                    resolve('Turno modificado correctamente');
                    
                }
            }
         )
    })
  };

const DeleteTruno =(id)=>{
    let sql = 'DELETE FROM turnos WHERE id = ?';
    bd.run(sql,[id],(err)=>{
        if(err){
            console.log( "error al eliminar")
        }else{
            console.log("Turno eliminado")
        }
    })
};


const ConsRol = ()=>{
    return new Promise((resolve, reject)=>{

        bd.all('SELECT * FROM roles', (err , rows)=>{
            if(err){
                console.log(err.mensaje)
                reject(err)
            }else{
               
                resolve(rows)
            }
        })
})
};

const ConnsultarUsuario = () =>{

        return new Promise((resolve, reject)=>{

        bd.all('SELECT * FROM usuarios', (err , rows)=>{
            if(err){
                console.log(err.mensaje)
                reject(err)
            }else{
               
                resolve(rows)
            }
        })
})
};



const InsertUsuario = async(usuario)=>{
    try {
        const id = uuidv4();
        const crakedPassword = await bcrypt.hash(usuario.contraseña , saltRounds)
        let stmt = bd.prepare('INSERT INTO usuarios(id ,medico_id, apellido , contraseña , cargo, tipo) VALUES(?,?,?,?,?,?)');
        stmt.run(id, usuario.medico_id ,usuario.apellido, crakedPassword , usuario.cargo , usuario.tipo);
        stmt.finalize();
        return "Usuario ingresado con exito";
    } catch (error) {
        console.log("Error", error)
    }
};

const SesionUsuario = (user)=>{
    return new Promise((resolve , reject)=>{
        let sql = 'SELECT * FROM  usuarios WHERE apellido = ?';
       
        let usuario = user.apellido;
        let contraseña = user.contraseña;
        bd.get(sql , [usuario], async (err, row)=>{
           
            if(err){
                console.log(err.mensaje);
                return reject(err);
            }if(!row){
                return resolve(false)
                
            }
            
                
                try {
                    
                    const PasswordMatch = await bcrypt.compare(contraseña , row.contraseña);
                   if(!PasswordMatch){

                      return resolve(false);
                   }
                    return resolve(row)
                    
                    
                } catch (bcryptError) {
                    console.error('Error al comparar contraseñas', bcryptError);
                    reject(bcryptError)
                
            }
        })

    })
};


const SearchUsuario = (apellido)=>{

    return new Promise((resolve , reject)=>{

        let sql = 'SELECT * FROM usuarios WHERE apellido LIKE ?';
        bd.all(sql, [`%${apellido}%`], (err , rows)=>{
            if(err){
                reject(err.mensaje)
            }else{
                resolve(rows)
            }
        })
    })

}


const DeleteUsuario = (id)=>{
    let sql = 'DELETE  FROM usuarios WHERE id = ?';
    bd.run(sql,[id],(err)=>{
        if(err){
            console.log( "error al eliminar")
        }else{
            console.log("Usuario eliminado")
        }
    })
}



const InsertPaciHisto = async(paci)=>{
    try {
        const id = uuidv4();
        let stmt = bd.prepare('INSERT INTO historial(id , paciente_id , descripcion) VALUES(?,?,?)');
        stmt.run(id, paci.paciente_id ,  paci.descripcion);
        stmt.finalize();
        return "historial agragado  con exito";
    } catch (err) {
        console.log("Error", err);
    }
}

const ConsHistorial = (id)=>{

    return new Promise((resolve , reject)=>{
        let sql = ("SELECT * FROM historial WHERE paciente_id = ? ORDER BY fecha DESC");

        bd.all(sql, [id], (err, rows)=>{
            if(err){
                console.log(err.mensaje);
                reject(err)
            }if(rows){
               
                resolve(rows)
            }
        })
    })
}

export default {
    InsertPaciente,
    consPaciente, 
    validarPaciente,
     UpdatePaciente,
     AsignarTurno, 
     IngresarMedico,
     ConsMedico,
     ConsultarTurno,
     ConsultTurnoPorMedico,
     consTurno,
     ValidarTurno, 
     UpdateTurno,
     DeleteTruno,
     SearchMedico, 
     ValidMedico,
     UpdateMed,
     DeleteMedico,
     InsertUsuario,
     InsertPaciHisto,
     ConsHistorial,
     ConnsultarUsuario,
     SesionUsuario,
     DeleteUsuario,
     SearchUsuario,
     ConsRol,
     

}