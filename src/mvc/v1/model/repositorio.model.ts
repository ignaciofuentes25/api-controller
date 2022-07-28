import { exec } from "child_process";

const { spawn } = require("child_process");

const database = require("../../../services/database");
const msgHTTP = require("../controller/mensajesHTTP");

export async function getStopForeverModel(req: any, res: any) {
  console.log(req.query);
  try {
    if (req.query.uid_api !== undefined) {
      const mensaje = await detenerApi(req.query.uid_api);
      res = msgHTTP.read200(res, "Api cerrada Correctamente.");
    } else {
      res = msgHTTP.read200(res, "El nombre de la api es obligatorio.");
    }
  } catch (error) {
    res = msgHTTP.error(res, error);
  }
  return res;
}

export async function getStartForeverModel(req: any, res: any) {
  console.log(req.query);
  try {
    if (req.query.uid_api !== undefined) {
      const mensaje = await iniciarApi(req.query.uid_api);
      res = msgHTTP.read200(res, "La api ha sido iniciada correctamente.");
    } else {
      res = msgHTTP.read200(res, "El nombre de la api es obligatorio.");
    }
  } catch (error) {
    res = msgHTTP.error(res, error);
  }
  return res;
}

async function detenerApi(api: string) {
  const stopForever = exec("forever stop " + api);

  const resultado = stopForever.stdout?.pipe(process.stdout);

  return resultado;
}

async function iniciarApi(api: string) {
  const exportPath = exec(
    "export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_7:$LD_LIBRARY_PATH"
  );

  exportPath.stdout?.pipe(process.stdout);

  const startForever = exec(
    "forever -a --uid " +
      api +
      " start /home/ec2-user/sgb/" +
      api +
      "/build/index.js"
  );

  const resultado = startForever.stdout?.pipe(process.stdout);

  return resultado;
}
