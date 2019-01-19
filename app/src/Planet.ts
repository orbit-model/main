import { attr, registerClass } from "@orbit-model/main";


@registerClass('class')
export default class Planet {

  @attr()
  name: string;
}
