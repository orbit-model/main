import AppDI from "../AppDI";
import Container from "../Container";

export const DI: Container = new Proxy(
  {},
  {
    get(target: {}, p: string | number | symbol, receiver: any): any {
      let container: any = AppDI.getDI();
      return container[p];
    }
  }
) as Container;
