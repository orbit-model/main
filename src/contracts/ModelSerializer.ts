import { RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';
import OrbitReflection from './OrbitReflection';
import HiddenOrbitProp from "./HiddenOrbitProp";
import HiddenOrbit from './HiddenOrbit';
import Model from "./Model";

export default interface ModelSerializer<T /* extends HiddenOrbitProp */, M /* extends Model */> {
  getOrbitReflection(klass: { new(): any }): OrbitReflection;
  setOrbitReflection(klass: { new(): any }, reflection: OrbitReflection): void;

  getHiddenOrbit(model: T, getter?: () => any): HiddenOrbit;
  setHiddenOrbit(model: T, value: HiddenOrbit, setter?: (value: HiddenOrbit) => void): void;

  getAttributeValues(model: M, getter?: (attr: string) => any): Dict<any>;
  setAttributeValues(model: M, attributes: Dict<any>, setter?: (attr: string, value: any) => void): void;

  getIdentity(model: M): RecordIdentity;

  // ...
}
