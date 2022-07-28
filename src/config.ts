import assert from 'assert';
const config = require('./env.json');

const defaultEnv = 'development';

const env = process.env.NODE_ENV || defaultEnv;

const configEnv = config[env];
const LOG_PATH = './';

//Las variables que mandan son las definidas por el servidor,
//ya que las define Explotación de Sistemas y no
//las definidas en la configuración. Sólo en caso de que no
//existan, se deben usar las del archivo de configuración

/*
Reset Variables de Ambiente
*/
//process.env.PORT ='';
//process.env.FACTURADOR_DTE_URL = '';

configEnv.PORT = process.env.PORT || configEnv.PORT; //
configEnv.HOST_URL = process.env.HOST_URL || configEnv.HOST_URL; //
//
configEnv.DB_USR = process.env.DB_USR || configEnv.DB_USR; //
configEnv.DB_PWD = process.env.DB_PWD || configEnv.DB_PWD; //
configEnv.DB_CONNSTR = process.env.DB_CONNSTR || configEnv.DB_CONNSTR; //

//servicio de autentificación
configEnv.AUTH_SERVICE = process.env.AUTH_SERVICE || configEnv.AUTH_SERVICE; //
configEnv.AUTH_DOMAIN = process.env.AUTH_DOMAIN || configEnv.AUTH_DOMAIN; //
configEnv.AUTH_ENABLED = process.env.AUTH_ENABLED || configEnv.AUTH_ENABLED; //
configEnv.AUTH_EXPIRES = process.env.AUTH_EXPIRES || configEnv.AUTH_EXPIRES; //
configEnv.AUTH_SECRETKEY =
  process.env.AUTH_SECRETKEY || configEnv.AUTH_SECRETKEY; //

configEnv.LIB_ORACLE_WINDOWS =
  process.env.LIB_ORACLE_WINDOWS || configEnv.LIB_ORACLE_WINDOWS; //

process.env['PORT'] = configEnv.PORT;
process.env['HOST_URL'] = configEnv.HOST_URL;
//
process.env['DB_USR'] = configEnv.DB_USR;
process.env['DB_PWD'] = configEnv.DB_PWD;
process.env['DB_CONNSTR'] = configEnv.DB_CONNSTR;

process.env['AUTH_SERVICE'] = configEnv.AUTH_SERVICE;
process.env['AUTH_DOMAIN'] = configEnv.AUTH_DOMAIN;
process.env['AUTH_ENABLED'] = configEnv.AUTH_ENABLED;
process.env['AUTH_EXPIRES'] = configEnv.AUTH_EXPIRES;
process.env['AUTH_SECRETKEY'] = configEnv.AUTH_SECRETKEY;

process.env['LIB_ORACLE_WINDOWS'] = configEnv.LIB_ORACLE_WINDOWS;
//revisar si las variables de entorno fueron establecidas

//assert(process.env.DB_USR, "** Variable de entorno DB_USR no definida **");
//assert(process.env.DB_PWD, "** Variable de entorno DB_PWD no definida **");
//assert(process.env.DB_CONNSTR, "** Variable de entorno DB_CONNSTR no definida **");

assert(process.env.PORT, `** Variable de entorno PORT no definida [${env}] **`);
assert(
  process.env.HOST_URL,
  `** Variable de entorno HOST_URL no definida [${env}] **`
);
//
assert(
  process.env.DB_USR,
  `** Variable de entorno DB_USR no definida [${env}] **`
);
assert(
  process.env.DB_PWD,
  `** Variable de entorno DB_PWD no definida [${env}] **`
);
assert(
  process.env.DB_CONNSTR,
  `** Variable de entorno DB_CONNSTR no definida [${env}] **`
);

//assert(process.env.XYZ, "** Variable de entorno XYZ no definida **");

//assert(process.env.FACTURADOR_DTE_URL, "** Variable de entorno FACTURADOR_DTE_URL no definida **");

module.exports = { configEnv, defaultEnv };
