# standard-codeclimate [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/jden/standard-codeclimate.svg?style=flat
[travis-url]: https://travis-ci.org/jden/standard-codeclimate
[npm-image]: https://img.shields.io/npm/v/standard-codeclimate?style=flat
[npm-url]: https://npmjs.org/package/standard-codeclimate
[downloads-image]: https://img.shields.io/npm/dm/standard-codeclimate.svg?style=flat
[downloads-url]: https://npmjs.org/package/standard-codeclimate

### Format [JavaScript Standard Style](https://github.com/feross/standard) as json output for the CodeClimate platform

See the [CodeClimate spec](https://github.com/codeclimate/spec/blob/master/SPEC.md) detailing required output format

## install

```
npm install -g standard-codeclimate
```

## usage

Pipe "compact" text into the `standard-codeclimate` command to get back pretty results:

```bash
$ standard --verbose | standard-codeclimate
```

Or, just run `standard-codeclimate` directly and it will run `standard` and give you pretty results:

```bash
$ standard-codeclimate
```

### null byte-delimited flag

CodeClimate [requires each issue to be delimited by a null byte (`\0`)](https://github.com/codeclimate/spec/blob/master/SPEC.md#output). Use the `--null-delimited` flag if you're using this in a CodeClimate engine, e.g.

```sh
$ standard-codeclimate --null-delimited
```

Additionally, `standard-codeclimate` supports all command line flags that `standard` supports:

```bash
$ standard-codeclimate --format --verbose test1.js test2.js
```

## license

ISC. Copyright (c) [jden](https://jden.us).
