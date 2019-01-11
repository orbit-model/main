import Setter from "../contracts/Setter";
import { Dict } from "@orbit/utils";
import { AttributeInfo } from "../contracts/ModelInfo";


export default interface ModelSerializerService<MODEL> {

  /**
   *
   * @param args
   * @param args.model      is read-only
   * @param args.attributes is read-only
   * @param args.setter     is read-only
   * @param args.name       attribute name of the api
   */
  beforeSetAttribute?<M extends MODEL>(args: {
    model: M,
    attributes: Dict<any>,
    setter: Setter<M>,
    name: string,
    attributeInfo: AttributeInfo,
  }): void;


}
