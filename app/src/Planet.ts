import { attr, registerClass, hasOne, HasOne } from "@orbit-model/main";
import SolarSystem from "./SolarSystem";


@registerClass('class')
export default class Planet {

  @attr()
  name: string;

  @hasOne()
  solarSystem: () => HasOne<SolarSystem>;
}

