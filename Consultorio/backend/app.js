import express from 'express';
import cors from 'cors';
import path, {win32} from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import { fileURLToPath } from 'url';
import http from 'http';
import {Server} from 'socket.io';
import SecControllers from './controllers/SecControllers.js';


const _dirname = (process.platform === 'win32')? fileURLToPath(new URL(".", import.meta.url)): path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

io.on('conection', (socket)=>{
    console.log("🟢 Cliente conectado", socket.id)
    
    io.on("disconect", ()=>{
        console.log("🔴 Cliente desconectado", socket.id)
    })
})

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods:["GET" , "POST" , "PUT" , "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use( helmet.contentSecurityPolicy({
        directives:{
            scriptSrc: [
                "'self'",
                "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
            ], styleSrc:[
                "'self'",
                'usafe-inline',
                "https://cdn.jsdelivr.net/npm/bootstrap@5.0.3/dist/css/bootstrap.min.css"
            ]
        }
    }));

    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.post("/AltaPaciente", SecControllers.AltaPaciente);
    app.post("/SearchPaciente", SecControllers.SearchPaciente);
    app.put("/UpdatePaciente/:id", SecControllers.ActualizarPaciente);
    app.post("/CrearTurno", SecControllers.CrearTurno);
    app.post("/IngresarMedico", SecControllers.IngresoMedico);
    app.get("/ConsMedico", SecControllers.ConsultMedico);
    app.get("/ConsTurno", SecControllers.ConsultarTurno);
    app.post("/SearchTurno", SecControllers.SearchTurno);
    app.put("/UpdateTurno/:id", SecControllers.ActualizarTurno);
    app.delete("/EliminarTurno/:id", SecControllers.EliminarTurno);
    app.post("/SearchMedico", SecControllers.SearchMed);
    server.listen(port , ()=>{
        console.log(`El backend esta corriendo en el puerto ${port}`);
    })

    export {
        _dirname, 
        io
    }