import {
  getStopForeverModel,
  getStartForeverModel,
} from "../model/repositorio.model";

export async function getStopForever(req: any, res: any) {
  res = await getStopForeverModel(req, res);
  return res;
}
export async function getStartForever(req: any, res: any) {
  res = await getStartForeverModel(req, res);
  return res;
}
