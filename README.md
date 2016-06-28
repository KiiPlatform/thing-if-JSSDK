Javascript SDK for Kii Thing Interaction Framework.

## Build SDK

### Install NPM packages

```
$ cd thing-if-sdk
$ npm install
```
### Build SDK
thing-if-sdk is built as UMD(Universal Module Definition) library.
So your code can load it either with CommonJS style, AMD style or script tag.

#### Normal build

Built with `gulp` command

```
$ gulp
```

If succeeded, library file named `thing-if-sdk.js` is available under `./dist/` folder.

#### Uglify build
Built with `--u` option.

```
$ gulp --u
```

If succeeded, uglified library file named `thing-if-sdk.min.js` is available under `./dist/` folder.

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

##TODO
- Declaration File for SDK