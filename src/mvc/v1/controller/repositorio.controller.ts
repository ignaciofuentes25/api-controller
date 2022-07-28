import { getStopForeverModel } from "../model/repositorio.model";

export async function getStopForever(req: any, res: any) {
  res = await getStopForeverModel(req, res);
  return res;
}
