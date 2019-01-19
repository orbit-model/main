import { dasherize } from "@orbit/utils";
import ApplicationDI from "../di/ApplicationDI";


export default function registerClassGenerator(namespace: string, options: { name?: string } = {}) {
  return function registerClass(target: any) {
    let diName = options.name || dasherize(target.name);
    ApplicationDI.getDI().register(namespace, diName, target);
  }
}
