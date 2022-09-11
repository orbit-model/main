import { Source, SourceSettings } from "@orbit/data";

export interface SourceFactory<SETTINGS extends SourceSettings, SOURCE extends Source> {
  (defaultSettings: SETTINGS): SOURCE;
}
