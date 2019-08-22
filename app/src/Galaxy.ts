import { ModelMixin } from "@orbit-model/model";
import { attr, hasMany, HasMany, model } from "@orbit-model/decorators";
import SolarSystem from "./SolarSystem";

@model()
export default class Galaxy extends ModelMixin() {
  @attr()
  name: string;

  @hasMany()
  solarSystems: () => HasMany<SolarSystem>;
}
