// register with application DI:
import "./impl/DefaultAdapter";
import "./impl/DefaultModelSerializer";
import "./impl/DefaultRecordSerializer";
import "./impl/DefaultRelationshipAdapter";


export { default as Adapter } from './Adapter';
export { default as RelationshipAdapter } from './RelationshipAdapter';

export { default as ModelSerializer } from './ModelSerializer';
export { default as RecordSerializer } from './RecordSerializer';
