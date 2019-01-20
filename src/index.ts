import 'reflect-metadata';

export { default as attr } from './decorators/attr';
export { default as model } from './decorators/model';
export { default as registerClass } from './decorators/registerClass';

// core contracts
export { default as MiddlewareAdapter } from './contracts/Adapter';
export { default as Container } from './contracts/Container';
export { default as Injectable } from './contracts/Injectable';

// DI
export { default as MigratableContainer } from './di/MigratableContainer';
export { default as ApplicationDI } from './di/ApplicationDI';
export { default as DefaultContainer } from './di/impl/DefaultContainer';

// meta / reflection
export { default as ModelMetaAccessors } from './meta/ModelMetaAccessors';

// middleware contracts
export { default as MiddlewareRegistry } from './middleware/MiddlewareRegistry';

// middleware implementaions
export { default as DefaultMiddelwareAdapter } from './middleware/impl/Adapter';
export { default as DefaultMiddleWareRegistry } from './middleware/impl/MiddlewareRegistry';
