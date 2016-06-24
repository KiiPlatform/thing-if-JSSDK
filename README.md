Javascript SDK for Kii Thing Interaction Framework.

## Build SDK

### Install NPM packages

```
$ cd thing-if-sdk
$ npm install
```
### Build SDK

```
$ gulp
```

## Test

### Install typyings for test framework
We use Mocha together with Chai for unit-testing.

```
$ npm install typings -g
$ typings install env~mocha --global
$ typings install dt~chai --global
```

### Run npm test
```
$ npm test
```