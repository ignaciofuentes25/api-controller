const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const msgHTTP = require("../mvc/v1/controller/mensajesHTTP");

const perfiles = require("../users.json");
const SECRET_KEY =
  process.env["AUTH_SECRETKEY"] ||
  "TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEu";

/************************************************************************************************
 * Se exponen dos funciones:
 *
 * login(req, res)              : endpoint para autentificar usuario y ver si está autorizado,
 *                                si es así devueve un JWT.
 * validarAcceso(req, res, next): middleware para validar si el token generado es válido para poder
 *                                acceder a los endpoints.
 *
 * **********************************************************************************************
 */

/* const templateBuscaDatos = {
    Respuesta: ['//BuscaDatosResult', {
        Rut:         'string[2]',       // "15343020-9",
        Nombres:     'string[3]',       // Francisco Javier",
        Apellidos:   'string[4]',       // "Puentes Rosales",
        Email:       'string[5]',       // "fpuentes@santotomas.cl",
        // el string[6], debiera ser el userPrincipalName
        // el string[7], debiera ser el nombreCuenta
        Cargo:       'string[8]',       // "Subdirector(a) Rec Académicos",
        Ubicacion:   'string[9]'        // "Casa Matriz Industria"
    }]
}; */

/**
 * Busca información de perfil del usuario en el archivo users.json
 * en el cual se definen quienes están autorizados
 */
function getPerfil(usuario: string, verbo?: string, ruta?: string) {
  const data = perfiles.autorizados.filter((u: any) => {
    return u.usuario === usuario;
  })[0];
  console.log("Perfil: " + data);
  return data;
}
function usuarioAutorizado(usr: string) {
  const perfil = getPerfil(usr);
  if (!perfil || perfil.estado !== "A") {
    return false;
  } else return true;
}

/**
 * Función que llama a la API de autentificación
 * consume la api definida en la vaiable AUTH_SERVICE.
 */
async function autentificar(usr: string, pwd: string, domain: string) {
  console.log(
    `Usuario (${usr}) accediendo a la API de autentificacion: ` +
      process.env["AUTH_SERVICE"]
  );

  let data = {
    usuario: usr, //"testdotacion",
    password: pwd, //"KrFuYD6E"
  };

  let apiURL = process.env["AUTH_SERVICE"] || "";
  let fetch_result;

  try {
    const fetch_response = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      dataType: "json",
    });
    //.then( (d: any) => console.log('then: ', d) )      // está demás
    //.catch( (e: any) => console.log('Catch: ', e) ) ;  // está demás

    fetch_result = await fetch_response.json();
    //setTimeout( (e:any) => { console.log('waiting...')}, 3000);
    fetch_result = fetch_result.ok
      ? { ...fetch_result, status: 1 } // autentificacion validada
      : { ...fetch_result, status: 0 }; // usuario o contraseña incorrecta
  } catch (error) {
    //console.log('cuek no hay servicio');
    fetch_result = {
      ok: false,
      respuesta: "Error en el servicio de autnticación: " + error,
      status: -1, // servicio no disponible
    };
  } finally {
    console.log("fetch result: ", JSON.stringify(fetch_result));
    return fetch_result;
  }
}

/**
 *  Este endopint permite hacer la autentificación y autorización a la API.
 * se deben enviar usaurio y contraseña en header como basic authentification
 */
export async function login(req: any, res: any) {
  let usr: string; // se extrae del Header
  let pwd: string; // se extrae del Header
  let domain: string = process.env["AUTH_DOMAIN"] || "stomas.cst";
  let expira: string = process.env["AUTH_EXPIRES"] || "1h";

  try {
    let tokeBasic64: string = req.headers["authorization"];

    if (!tokeBasic64) {
      res.sendStatus(403);
      return;
    }

    tokeBasic64 = tokeBasic64.replace("Basic ", "");

    let buffTemp = Buffer.from(tokeBasic64, "base64");
    const token = buffTemp.toString("utf-8");
    [usr, pwd] = token.split(":");
  } catch (error) {
    console.log("No pudo ser decifrado el tokenBasic: ");
    res.sendStatus(403);
    return;
  }

  // 1.- Ver si está autorizado para usar esta API, revisa el archivo users.json
  if (!usuarioAutorizado(usr)) {
    console.log("Usuario no autorizado: ", usr);
    res.sendStatus(401);
    return;
  }

  // 2.- Ver si se puede autentificar
  const respuesta = await autentificar(usr, pwd, domain);
  if (!respuesta.ok) {
    console.log(respuesta.respuesta);
    if (respuesta.status === -1) {
      res.sendStatus(503); // problemas para acceder al servicio de autentificación
    } else res.sendStatus(401); // usuario o contraseña incorrecta
    return;
  }
  console.log(
    "Yeahh! usuario autorizado y autentificado: ",
    JSON.stringify(respuesta.datos[0])
  );

  // Una vez autorizado y autentificado se le debe devolver el nuevo token para
  // ser utilizado en otros endpoints previa validación del token
  // crear token
  const newToken = jwt.sign(
    { user: usr },
    SECRET_KEY,
    { expiresIn: expira } // 60 seg * 60 min = 1h
  );
  res.json(
    { status: 1, message: "Welcome", user: respuesta.datos[0], token: newToken }
    // TODO: Aqui sería necesario guardar log de este evento de login
  );
}

/**
 * Este es el middleware que permite controlar acceso. Si no tiene acceso debe consumir endpoint de '/login'
 * Validar si el token es enviado, si es valido y no vencido y luego ver si tiene permisos a modulo
 * el token JWT debe ser enviado en header como: Authorization: Beared <token>
 * */
export async function validarAcceso(req: any, res: any, next: any) {
  console.log("usar auth: ", process.env["AUTH_ENABLED"]);

  if (process.env["AUTH_ENABLED"] === "false") {
    next();
    return;
  }

  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    await jwt.verify(bearerToken, SECRET_KEY, (err: any, data: any) => {
      if (err) {
        res = msgHTTP.error403(res);
      } else {
        // TODO: Verificar si el usuario que viene en 'data' tiene permiso para acceder al modulo
        console.log(
          "ruta accedida: ",
          req.method,
          req.baseUrl,
          req.originalUrl
        );
        next();
      }
    });
  } else {
    res = msgHTTP.error403(res);
  }
}
