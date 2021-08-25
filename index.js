const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // para leer lo enviado por post
require('dotenv').config({path: 'variables.env'});


// Definir un dominio o dominios para recibir las peticiones
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        // Revisar si la petición viene de un server de la whitelist
        const existe = whitelist.some( dominio => dominio === origin);
        if(existe){
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

// Cors permite que un cliente se conecte a otro servidor para el intercambio de recursos
const cors = require('cors');

// Conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology : true
});

// Crear el servidor 
const app = express();

// Habilitar Json 
app.use(express.json());

// Habilitar el bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar CORS
app.use(cors(corsOptions));

// Rutas de la app
app.use('/', routes());

// Carpeta pública
app.use(express.static('uploads'));

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

// Iniciar App
app.listen(port, host, () => {
    console.log("El servidor está funcionando")
});