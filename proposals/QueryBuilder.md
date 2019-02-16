# RFC QueryBuilder

- Start Date: 2019-02-13
- RFC PR: (leave this empty)
- Orbit Issue: (leave this empty)

## Summary
A query builder for orbit models

## Motivation
The query builder is supposed to be the core entry point into model-layer-land: It's supposed to be an easy yet powerful way to interact with the core orbit layer and the backend without the need to know the technical details of either.

This means that a query builder allows for further abstraction which means easier and/or less API for the user and thus makes orbit as a whole easier to use.

## Detailed design

Here is a first taste (copy from the models RFC):
```typescript
// /index.ts
import Planet from './Planet';
import Continent from './Continent';

// other stuff to setup orbit ...
export default async function() {
  let earth: Planet = await Planet.query().find(1);
  let europe: Continent = await earth.continents()
        .query()
        .sortBy('name')
        .filterAttr('population', '>', 1)
        .filterRaw('nameStartsWith', 'E')
        .first();
}

```


```typescript
import LiteBranch from '/src/contracts/Branch';
import Model from '/src/contracts/Model';

export interface QueryableBranch extends LiteBranch {
  
  query<Q = QueryBuilder>(queryBuilder = "query-builder"): Q;
}

export interface QueryBuilder {
  
  get(): Promise<Model[]>;
  
  find(id: string): Promise<Model>;
  
  first(): Promise<Model>;
  
  //## builder methods ####################################
  
  sortBy(...attr: string[]): QueryBuilder;
  
  /**
   * translates into: 
   *    q.filter({ attribute, op, value })
   */
  filter(attr: string, op: string, value: any): QueryBuilder;
  
  /**
   * shorthand for:
   *    this.filter(attr, "===", value);
   */
  filterEq(attr: string, value: any): QueryBuilder;
  
  
}

```








## How we teach this

> What names and terminology work best for these concepts and why? How is this
idea best presented? As a continuation of existing Ember patterns, or as a
wholly new one?

> Would the acceptance of this proposal mean the Ember guides must be
re-organized or altered? Does it change how Ember is taught to new users
at any level?

> How should this feature be introduced and taught to existing Ember
users?


## Drawbacks


## Alternatives

> What other designs have been considered? What is the impact of not doing this?

> This section could also include prior art, that is, how other frameworks in the same domain have solved this problem.

## Unresolved questions

