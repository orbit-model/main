import { RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';
import OrbitReflection from '../../contracts/OrbitReflection';
import HiddenOrbitProp from "../../contracts/HiddenOrbitProp";
import HiddenOrbit from '../../contracts/HiddenOrbit';
import Model from "../../contracts/Model";

export default interface ModelSerializer<H /* extends HiddenOrbitProp */, M /* extends Model */> {
  getOrbitReflection(klass: { new(): any }): OrbitReflection;
  setOrbitReflection(klass: { new(): any }, reflection: OrbitReflection): void;

  getHiddenOrbit(model: H, getter?: () => any): HiddenOrbit;
  setHiddenOrbit(model: H, value: HiddenOrbit, setter?: (value: HiddenOrbit) => void): void;

  getAttributeValues(model: M, getter?: (attr: string) => any): Dict<any>;
  setAttributeValues(model: M, attributes: Dict<any>, setter?: (attr: string, value: any) => void): void;

  getIdentity(model: M): RecordIdentity;

  // ...
}
