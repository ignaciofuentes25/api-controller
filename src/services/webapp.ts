import express from 'express';
import bodyParser from 'body-parser';
const cors = require('cors');
const morgan = require('morgan');

const imalive = require('../routes/imalive');
const imaliveHtmlFile = './public/imalive.html';  //ruta relativa al proyecto

const routes = require('../routes/routes');


//let httpServer: Express;

export function initialize(appDescription: string, puerto: number) {

    return new Promise((resolve, reject) => {
        const app = express();

        app.use(cors());

        //para reconocer archivos públicos de imagenes o iconos etc.
        app.use(express.static('./public'));        

        // Combines logging info from request and response
        app.use(morgan('combined'));
        app.use(bodyParser.json());

        // Parse incoming JSON requests and revive JSON.
        app.use(express.json({ reviver: reviveJson }));

        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }));
        
        // el resto de las rutas
        app.use('/api/v1', routes.v1);
        //app.use('/api/v2', routes.v2);
        
        app.use('/api/api-docs', routes.swaggerDoc);

        // ruta por defecto que sirve para saber si está montada la api
        app.use('/', imalive.showImAlive(imaliveHtmlFile, { titulo: appDescription }))

        // en caso que ninguna ruta esté dentro de las definidas
        app.use('*', (req, res) => { res.status(400).send('Recurso no válido') })
        
        app.listen(puerto)
            .on('listening', () => {
                console.log(`Web server activo en localhost:${puerto}`);
                resolve(null);
            })
            .on('error', err => {
                console.log('Error en el Listening: ', err)
                reject(err);
            });

    });
}

/* export function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
} */


function reviveJson(key: any, value: string) {
    const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    // revive ISO 8601 date strings to instances of Date
    if (typeof value === 'string' && iso8601RegExp.test(value)) {
        return new Date(value);
    } else {
        return value;
    }
}