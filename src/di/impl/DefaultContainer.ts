import Container from "../../contracts/Container";
import Injectable from "../../contracts/Injectable";


declare class StringMap<T> extends Map<string, T> {
};


interface Contained<T> {
  get(): T;

  getClass(): { new(): T };
}

class ContainedSimpleClass<T> implements Contained<T> {
  private klass: { new(): T };

  constructor(klass: { new(): T }) {
    this.klass = klass;
  }

  get(): T {
    return new this.klass();
  }

  getClass(): { new(): T } {
    return this.klass;
  }
}

class ContainedSingeltonClass<T> implements Contained<T> {
  private klass: { new(): T };
  private instance: T;

  constructor(klass: { new(): T }) {
    this.klass = klass;
  }

  get(): T {
    if (typeof this.instance === "undefined") {
      this.instance = new this.klass();
    }
    return this.instance;
  }

  getClass(): { new(): T } {
    return this.klass;
  }
}

class ContainedObject<T> implements Contained<T> {
  private instance: T;

  constructor(instance: T) {
    this.instance = instance;
  }

  get(): T {
    return this.instance;
  }

  getClass(): { new(): T } {
    throw new Error("Container doesn't have a class in the registry, only an instance");
  }
}


export default class DefaultContainer implements Container {

  private container: StringMap<StringMap<Contained<any>>>;


  public constructor() {
    this.container = new Map<string, Map<string, Contained<any>>>();
  }


  private resolveNamespace<T>(namespace: string): StringMap<Contained<T>> {
    if (!this.container.has(namespace)) {
      throw new Error("container could not find namespace '" + namespace + "'");
    }
    return this.container.get(namespace);
  }

  private resolve<T>(namespace: string, name: string): Contained<T> {
    let namespaceMap = this.resolveNamespace<T>(namespace);
    if (!namespaceMap.has(name)) {
      throw new Error("container could not find name '" + name + "'");
    }
    return namespaceMap.get(name);
  }

  public get<T extends Injectable>(namespace: string, name: string): T;
  public get<T>(namespace: string, name: string): T;
  public get<T extends Injectable = any>(namespace: string, name: string): T {
    let instance = this.resolve<T>(namespace, name).get();
    if (typeof instance['_setOrbitDi'] === "function") {
      instance._setOrbitDi(this);
    }
    return instance;
  }

  public getClass<T>(namespace: string, name: string): { new(): T } {
    return this.resolve<T>(namespace, name).getClass();
  }

  public getNames(namespace: string): string[] {
    return Array.from(this.resolveNamespace(namespace).keys());
  }

  private setter<T>(namespace: string, name: string, contained: Contained<T>): void {
    let namespaceMap: StringMap<Contained<any>>;
    if (!this.container.has(namespace)) {
      namespaceMap = new Map<string, Contained<any>>();
      this.container.set(namespace, namespaceMap);
    } else {
      namespaceMap = this.container.get(namespace);
    }

    namespaceMap.set(name, contained);
  }

  public register(namespace: string, name: string, klass: { new(): any }, options: { singleton: boolean } = { singleton: false }): void {
    let contained: Contained<any>;
    if (options.singleton) {
      contained = new ContainedSingeltonClass(klass);
    } else {
      contained = new ContainedSimpleClass(klass)
    }
    this.setter(namespace, name, contained);
  }

  public registerObject(namespace: string, name: string, value: any): void {
    this.setter(namespace, name, new ContainedObject(value));
  }


}