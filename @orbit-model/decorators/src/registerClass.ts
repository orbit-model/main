import { camelize } from "@orbit/utils";
import { DI } from "@orbit-model/di";

export default function registerClassGenerator(namespace: string, options: { name?: string } = {}) {
  return function registerClass(target: any): void {
    let diName = options.name || camelize(target.name);
    DI.register(namespace, diName, target);
  };
}
