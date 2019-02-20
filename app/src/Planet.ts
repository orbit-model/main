import SolarSystem from "./SolarSystem";
import { attr, HasOne, hasOne, model } from "@orbit-model/decorators";
import { ModelMixin } from "@orbit-model/model";


@model()
export default class Planet extends ModelMixin() {

  @attr()
  name: string;

  @hasOne()
  solarSystem: () => HasOne<SolarSystem>;
}

