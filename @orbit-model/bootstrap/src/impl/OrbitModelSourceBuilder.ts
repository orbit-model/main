import {OrbitKlass, SourceBuilder} from "@orbit-model/contracts";
import {Source, SourceSettings} from "@orbit/data";

export default class OrbitModelSourceBuilder<SOURCE_SETTINGS extends SourceSettings, SOURCE extends Source> implements SourceBuilder<SOURCE_SETTINGS, SOURCE> {

  private _klass?: OrbitKlass<any, any>;
  private _name?: string;

  getKlass(): OrbitKlass<any, any> | undefined {
    return this._klass;
  }

  getName(): string | undefined {
    return this._name;
  }

  klass<SS extends SOURCE_SETTINGS, S extends SOURCE>(klass: OrbitKlass<S, SS>): OrbitModelSourceBuilder<SOURCE_SETTINGS, SOURCE> {
    this._klass = klass;
    return this;
  }

  name(name: string): OrbitModelSourceBuilder<SOURCE_SETTINGS, SOURCE> {
    this._name = name
    return this;
  }

}
