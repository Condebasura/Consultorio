import sqlite3 from 'sqlite3';
let bd = new sqlite3.Database('./data/BaseConsultorio.bd');
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
const saltRounds = 10;

bd.run('CREATE TABLE IF NOT EXISTS  pacientes (id TEXT PRIMARY KEY, nombre TEXT , apellido TEXT , dni INTEGRER , telefono INTEGRER , email TEXT ,  direccion TEXT , obraSocial TEXT , afiliado INTEGRER )');



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
                    console.log('Pacientes encontrados', rows)
                    resolve(rows);
                }
            })
         })        
    } catch (error) {
        console.log('El error del catch', error)
    }
}

export default {
    InsertPaciente,
    consPaciente
}