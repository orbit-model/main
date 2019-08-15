import { attr, hasMany, HasMany, model } from "@orbit-model/decorators";
import { ModelMixin } from "@orbit-model/model";
import Planet from "./Planet";

@model()
export default class SolarSystem extends ModelMixin() {

  @attr()
  name: string;

  @hasMany()
  planets: () => HasMany<Planet>;
}
