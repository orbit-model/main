# Decorators

> TODO: update docs

## @registerClass

This is the most basic helper for our dependency injection system. It simply registers the class it's applied on with the application DI container.

**Example Usage:**

```typescript
import { registerClass } from "@orbit-model/main";

@registerClass("my-solar-system")
class Planet {
    // ...
}
```

**Method declaration:**

```typescript
declare function registerClass(namespace: string, options?: { name: string });
```

The `namespace` parameter is required. It defines the classes registration namespace on the container.

The `name` parameter inside the options hash on the other hand is optional.
This parameter allows you to define the name parameter of the containers register method.
By default it will be the dasherized name of the given class or constructor function.
