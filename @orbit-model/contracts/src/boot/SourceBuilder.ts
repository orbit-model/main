import {Source, SourceSettings} from "@orbit/data";
import {OrbitKlass} from "./OrbitFactorySources";

export default interface SourceBuilder<SOURCE_SETTINGS extends SourceSettings, SOURCE extends Source> {

  klass<SS extends SOURCE_SETTINGS, S extends SOURCE>(klass: OrbitKlass<S, SS>): SourceBuilder<SOURCE_SETTINGS, SOURCE>

  name(name: string): SourceBuilder<SOURCE_SETTINGS, SOURCE>
}


export interface SourceBuilderFN<SETTINGS extends SourceSettings, SOURCE extends Source> {
  (sourceBuilder: SourceBuilder<SETTINGS, SOURCE>): void
}
