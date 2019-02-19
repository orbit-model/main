import { RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';
import {Injectable} from "@orbit-model/di";
import { Model } from "@orbit-model/model";

export default interface ModelSerializer extends Injectable {

  setAttributeValues<M extends Model>(model: M, attributes: Dict<any>): void;

  getIdentity(model: Model): RecordIdentity;

}
