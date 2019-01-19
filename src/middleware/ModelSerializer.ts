import { RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';
import OrbitModelReflection from '../contracts/OrbitModelReflection';
import HiddenOrbitProp from "../contracts/HiddenOrbitProp";
import HiddenOrbit from '../contracts/HiddenOrbit';
import Model from "../contracts/Model";
import Injectable from "../contracts/Injectable";
import Getter from "../contracts/Getter";
import Setter from "../contracts/Setter";

export default interface ModelSerializer<H /* extends HiddenOrbitProp */, MODEL /* extends Model */> extends Injectable {

  getOrbitReflection(klass: { new(): any }): OrbitModelReflection;
  setOrbitReflection(klass: { new(): any }, reflection: OrbitModelReflection): void;

  getHiddenOrbit(model: H): HiddenOrbit;
  setHiddenOrbit(model: H, value: HiddenOrbit): void;

  getAttributeValues<M extends MODEL>(model: M, getter: Getter<M>): Dict<any>;
  setAttributeValues<M extends MODEL>(model: M, attributes: Dict<any>, setter: Setter<M>): void;

  getIdentity(model: MODEL): RecordIdentity;

  getId<M extends MODEL>(model: M, getter: Getter<M>): string;
  setId<M extends MODEL>(model: M, value: string, setter: Setter<M>);

}
