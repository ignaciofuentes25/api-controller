import { exec } from "child_process";

const { spawn } = require("child_process");

const database = require("../../../services/database");
const msgHTTP = require("../controller/mensajesHTTP");

export async function getStopForeverModel(req: any, res: any) {
  console.log(req.query);
  try {
    if (req.query.uid_api !== undefined) {
      const mensaje = await detenerApi(req.query.uid_api);
      res = msgHTTP.read200(res, mensaje);
    } else {
      res = msgHTTP.read200(res, "El nombre de la api es obligatorio");
    }
  } catch (error) {
    res = msgHTTP.error(res, error);
  }
  return res;
}

async function detenerApi(api: string) {
  const apisEnEjeccion = exec("forever stop " + api);

  const resultado = apisEnEjeccion.stdout?.pipe(process.stdout);

  return resultado;
}
