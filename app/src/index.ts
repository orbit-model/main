import 'reflect-metadata';
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


const middlewareRegistry: MiddlewareRegistry = new DefaultMiddlewareRegistry();

let middlewareAdapter: MiddlewareAdapter = new DefaultMiddlewareAdapter();

console.log('test');

let planet = new Planet();
