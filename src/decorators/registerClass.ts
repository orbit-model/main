import { camelize } from "@orbit/utils";
import ApplicationDI from "../di/ApplicationDI";


export default function registerClassGenerator(namespace: string, options: { name?: string } = {}) {
  return function registerClass(target: any) {
    let diName = options.name || camelize(target.name);
    ApplicationDI.getDI().register(namespace, diName, target);
  }
}
