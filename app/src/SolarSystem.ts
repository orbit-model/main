import { attr, hasMany, HasMany, hasOne, HasOne, model } from "@orbit-model/decorators";
import { ModelMixin } from "@orbit-model/model";
import Planet from "./Planet";
import Galaxy from "./Galaxy";

@model()
export default class SolarSystem extends ModelMixin() {
  @attr()
  name: string;

  @hasMany()
  planets: () => HasMany<Planet>;

  @hasOne()
  galaxy: () => HasOne<Galaxy>;
}
