import OrbitReflection from "../contracts/OrbitReflection";
import { AttributeInfo } from "../contracts/ModelInfo";

/**
 * find the `AttributeInfo` within reflection data by it's internal name (server name)
 *
 * @param reflection {OrbitReflection} the reflection data to search
 * @param name {string} the name of the attribute of a `Record` within the orbit internals
 */
export default function findAttributeInfoByName(reflection: OrbitReflection, name: string): AttributeInfo {
  let attrs = reflection.modelInfo.attributes;
  // try fast track (attributeName === name)
  if (typeof attrs[name] === 'object' && attrs[name].name === name) {
    return attrs[name];
  }

  for(let attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      if (attrs[attr].name === name) {
        return attrs[attr];
      }
    }
  }

  return null;
}
