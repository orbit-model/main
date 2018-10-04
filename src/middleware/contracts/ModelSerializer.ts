import { RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';
import OrbitReflection from '../../contracts/OrbitReflection';
import HiddenOrbitProp from "../../contracts/HiddenOrbitProp";
import HiddenOrbit from '../../contracts/HiddenOrbit';
import Model from "../../contracts/Model";
import Injectable from "../../contracts/Injectable";

export default interface ModelSerializer<H /* extends HiddenOrbitProp */, MODEL /* extends Model */> extends Injectable {

  createInstance<M extends MODEL>(klass: { new(): M }): M;

  getOrbitReflection(klass: { new(): any }): OrbitReflection;
  setOrbitReflection(klass: { new(): any }, reflection: OrbitReflection): void;

  getHiddenOrbit(model: H, getter?: () => any): HiddenOrbit;
  setHiddenOrbit(model: H, value: HiddenOrbit, setter?: (value: HiddenOrbit) => void): void;

  getAttributeValues(model: MODEL, getter?: (attr: string) => any): Dict<any>;
  setAttributeValues(model: MODEL, attributes: Dict<any>, setter?: (attr: string, value: any) => void): void;

  getIdentity(model: MODEL): RecordIdentity;

  // ...
}
