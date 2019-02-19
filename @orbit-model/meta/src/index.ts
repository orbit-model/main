// register with application DI:
import './impl/DefaultModelMetaAccessor';


export { default as MetaDataModel } from './MetaDataModel';
export { default as ModelMetaAccessor } from './ModelMetaAccessor';
export { default as ModelInfo, AttributeInfo, RelationInfo } from './ModelInfo';
export { default as OrbitModelMeta } from './OrbitModelMeta';
export { default as OrbitModelReflection } from './OrbitModelReflection';

// POJOs (private)
export { default as DefaultAttributeInfo } from './pojos/DefaultAttributeInfo';
export { default as DefaultModelInfo } from './pojos/DefaultModelInfo';
export { default as DefaultOrbitModelMeta } from './pojos/DefaultOrbitModelMeta';
export { default as DefaultOrbitModelReflection } from './pojos/DefaultOrbitModelReflection';
export { default as DefaultRelationInfo } from './pojos/DefaultRelationInfo';
