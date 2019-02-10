import { attr, registerClass, hasOne, HasOne } from "@orbit-model/main";


@registerClass('class')
export default class Planet {

  @attr()
  name: string;

  @hasOne()
  solarSystem: () => HasOne<SolarSystem>;
}

class SolarSystem {

}

let planet = new Planet();
planet.name = "myPlanet";
planet.solarSystem();
