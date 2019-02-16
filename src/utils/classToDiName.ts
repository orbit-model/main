import { dasherize } from "@orbit/utils";

export default function classToDiName<C = any>(klass: { new(...args): C }) {
  return dasherize(klass.name);
}
