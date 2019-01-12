import Container from "../../contracts/Container";


declare class StringMap<T> extends Map<string, T> {};


interface ContainedObject<T> {
  get(): T;

  getClass(): { new(): T };

  isSingleton(): boolean;
}

class ContainedSimpleClass<T> implements ContainedObject<T>{

  private classObj: { new(): T };

  constructor(classObj: { new(): T }) {
    this.classObj = classObj;
  }

  get(): T {
    return new this.classObj();
  }

  getClass(): { new(): T } {
    return this.classObj;
  }

  isSingleton(): boolean {
    return false;
  }
}



export default class DefaultContainer implements Container {

  private container: StringMap<StringMap<ContainedObject<any>>>;


  public constructor() {
    this.container = new StringMap();
  }

  

  public get<T>(namespace: string, name: string): T {
    return undefined;
  }

  public getClass<T>(namespace: string, name: string): { new(): T } {
    return {};
  }

  public getNamespaceNames(namespace: string): string[] {
    return [];
  }

  public register(namespace: string, name: string, Klass: { new(): any }, options?: { singleton?: boolean }): void {
  }

  public registerObject(namespace: string, name: string, value: any): void {
  }



}
