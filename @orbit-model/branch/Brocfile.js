"use strict";

const build = require('@glimmer/build');
const packageDist = require('@glimmer/build/lib/package-dist');

let buildOptions = {
  external: [
    '@orbit/coordinator',
    '@orbit/store',
    '@orbit/utils',
    '@orbit-model/core',
    '@orbit-model/di',
    '@orbit-model/query'
  ]
};

// if (process.env.BROCCOLI_ENV === 'tests') {
//   buildOptions.vendorTrees = [
//     packageDist('@orbit-model/core'),
//     packageDist('@orbit-model/di'),
//     packageDist('@orbit-model/query'),
//   ];
// }

module.exports = build(buildOptions);
