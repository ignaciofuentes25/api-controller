const { defaultEnv } = require('./config');
const database = require('./services/database');
const webApp = require('./services/webapp');

async function startup() {
  console.log(`Iniciando Aplicación en ambiente: **${process.env.NODE_ENV}**`);
  if (process.env.NODE_ENV === undefined) {
    console.log(`Ambiente por defecto: **${defaultEnv}**`);
  }

  try {
    console.log(
      `Inicializando módulo Base de Datos en: ${process.env.DB_CONNSTR}`
    );
    console.log(`Utilizar Base de Datos: ${process.env.USE_DATABASE}`);

    await database.initialize();
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }

  try {
    console.log(`Inicializando módulo web en: **${process.env.PORT}**`);
    await webApp.initialize('Servicio sgb-cargas-adm-api', process.env.PORT);
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }
}

startup();

async function shutdown(e?: any) {
  let err = e;

  console.log('Cerrando aplicación');

  try {
    console.log('Cerrando módulo servidor web');

    //await webServer.close();
  } catch (e) {
    console.error(e);

    err = err || e;
  }

  try {
    console.log('Cerrando módulo Base de Datos');
    await database.close();
  } catch (e) {
    console.error(e);

    err = err || e;
  }

  console.log('Saliendo del proceso');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => {
  console.log('Recibido SIGTERM');

  shutdown();
});

process.on('SIGINT', () => {
  console.log('Recibido SIGINT');

  shutdown();
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception');
  console.error(err);

  shutdown(err);
});

console.log('Hola mundo');
