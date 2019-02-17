import { attr, model, registerClass, hasOne, HasOne, ModelMixin } from "@orbit-model/main";
import SolarSystem from "./SolarSystem";


@model()
export default class Planet extends ModelMixin() {

  @attr()
  name: string;

  @hasOne()
  solarSystem: () => HasOne<SolarSystem>;
}

