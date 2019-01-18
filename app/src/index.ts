import 'reflect-metadata';
console.log('index 0');
import Planet from './Planet';
import {
  MiddlewareRegistry,
  DefaultMiddlewareRegistry,
  MiddlewareAdapter,
  DefaultMiddlewareAdapter,
  Container,
  DefaultContainer
} from "@orbit-model/main";


const di: Container = new DefaultContainer();

di.register("middleware", "adapter", DefaultMiddlewareAdapter);
di.register("middleware", "registry", DefaultMiddlewareRegistry);


console.log('index 1');

let planet = new Planet();

console.log('index 2');
