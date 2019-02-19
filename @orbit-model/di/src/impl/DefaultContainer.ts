import Injectable from "../Injectable";
import MigratableContainer from "../MigratableContainer";


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

class ContainedSingletonClass<T> implements Contained<T> {
  private klass: { new(): T };
  private instance: T | undefined;

  constructor(klass: { new(): T }, instance: T | undefined = undefined) {
    this.klass = klass;
    this.instance = instance;
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

  hasInstance(): boolean {
    return this.instance !== undefined;
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


export default class DefaultContainer implements MigratableContainer {

  private container: Map<string, Map<string, Contained<any>>>;


  public constructor() {
    this.container = new Map<string, Map<string, Contained<any>>>();
  }


  private resolveNamespace<T>(namespace: string): Map<string, Contained<T>> {
    let ns = this.container.get(namespace);
    if (ns === undefined) {
      throw new Error("container could not find namespace '" + namespace + "'");
    }
    return ns;
  }

  private resolve<T>(namespace: string, name: string): Contained<T> {
    let namespaceMap = this.resolveNamespace<T>(namespace);
    let c = namespaceMap.get(name);
    if (c === undefined) {
      throw new Error("container could not find name '" + name + "'");
    }
    return c;
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
    let namespaceMap = this.container.get(namespace);
    if (namespaceMap === undefined) {
      namespaceMap = new Map<string, Contained<any>>();
      this.container.set(namespace, namespaceMap);
    }
    namespaceMap.set(name, contained);
  }

  public register<K = any>(namespace: string, name: string, klass: { new(): K }, options: { singleton: boolean } = { singleton: false }): void {
    let contained: Contained<K>;
    if (options.singleton) {
      contained = new ContainedSingletonClass(klass);
    } else {
      contained = new ContainedSimpleClass(klass)
    }
    this.setter(namespace, name, contained);
  }

  public registerObject(namespace: string, name: string, value: any): void {
    this.setter(namespace, name, new ContainedObject(value));
  }

  public registerInstantiatedSingleton<T = any>(namespace: string, name: string, klass: { new(): T }, instance: T): void {
    this.setter(namespace, name, new ContainedSingletonClass(klass, instance));
  }


  public migrateTo(other: MigratableContainer): void {
    for (let namespace of this.container.keys()) {
      let nsMap = this.container.get(namespace);
      if (nsMap === undefined){
        throw new Error("not happening!")
      }
      for (let name of nsMap.keys()) {
        let entry = nsMap.get(name);
        if (entry === undefined){
          throw new Error("not happening!")
        }

        if (entry instanceof ContainedSingletonClass) {
          if (entry.hasInstance()) {
            other.registerInstantiatedSingleton(namespace, name, entry.getClass(), entry.get());
          } else {
            other.register(namespace, name, entry.getClass(), { singleton: true });
          }
        } else if (entry instanceof ContainedObject) {
          other.registerObject(namespace, name, entry.get());
        }

        other.register(namespace, name, entry.getClass());
      }
    }
  }

}
