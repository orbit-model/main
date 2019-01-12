import 'reflect-metadata';
import Planet from './Planet';
import { MiddlewareRegistry, DefaultMiddlewareRegistry, MiddlewareAdapter, DefaultMiddlewareAdapter } from "@orbit-model/main";


const middlewareRegistry: MiddlewareRegistry = new DefaultMiddlewareRegistry();

let middlewareAdapter: MiddlewareAdapter = new DefaultMiddlewareAdapter();

console.log('test');

let planet = new Planet();
