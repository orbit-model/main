[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Build Status](https://travis-ci.com/orbit-model/main.svg?branch=develop)](https://travis-ci.com/orbit-model/main)
[![Greenkeeper badge](https://badges.greenkeeper.io/orbit-model/main.svg)](https://greenkeeper.io/)

# orbit-model

This is the playground for creating a first version of a model based abstraction layer for the [orbit.js](http://orbitjs.com) data orchestration library.

## RFCs

For more details of what we want to create here, please read the related RFCs posted as issues 
on the [orbit.js monorepo](https://github.com/orbitjs/orbit):


- [RFC: The Model](https://github.com/orbitjs/orbit/issues/529) (scroll to the end for related RFCs)
- [more RFCs](https://github.com/orbitjs/orbit/issues?utf8=✓&q=is%3Aissue+label%3ARFC+model+layer)

## Contributing

This repository is a so called "monorepo", managed by `lerna` - don't worry, you won't need to know `lerna` to contribute, the scripts defined in the `package.json` should take care of everything for you.

This project requires `yarn`! Please do not use it with `npm`.

### project tl;dr

In the project root directory you can run these (and more) commands:

```bash
# installs everything for every project and links them
yarn install

# after code changes
yarn run lint

# before committing (optional, will be run within git-hooks)
yarn run test
```


## License

Copyright 2018-2019 Bernhard Halbartschlager. MIT License (see LICENSE for details).
