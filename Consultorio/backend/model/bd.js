import sqlite3 from 'sqlite3';
let bd = new sqlite3.Database('./data/BaseConsultorio.bd');
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
const saltRounds = 10;

bd.run('CREATE TABLE IF NOT EXISTS  pacientes (id TEXT PRIMARY KEY, nombre TEXT , apellido TEXT , dni INTEGRER , telefono INTEGRER , email TEXT ,  direccion TEXT , obraSocial TEXT , afiliado INTEGRER )');

bd.run('CREATE TABLE IF NOT EXISTS turnos (id TEXT PRIMARY KEY , nombre TEXT , apellido TEXT , dni TEXT , telefono TEXT, fecha TEXT, hora TEXT , observaciones TEXT , medico TEXT)');


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
}

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
                console.log(err.mensaje)
                 reject(err)
            }    
            if(row){
                console.log(row)
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
                console.log("el paciente se actualizo correctamente")
            }
        })
        
    })
}

export default {
    InsertPaciente,
    consPaciente, 
    validarPaciente,
     UpdatePaciente,
     AsignarTurno
}