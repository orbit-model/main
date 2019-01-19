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

di.register("middleware", "adapter", DefaultMiddlewareAdapter);
di.register("middleware", "registry", DefaultMiddlewareRegistry);


let planet = new Planet();
