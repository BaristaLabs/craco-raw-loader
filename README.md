# Craco Raw-Loader Plugin

This is a [craco](https://github.com/sharegate/craco) plugin that adds [raw-loader](https://github.com/webpack-contrib/raw-loader) to [create-react-app](https://facebook.github.io/create-react-app/) version >= 2.

## Supported Versions

`craco-raw-loader` is tested with:

- `react-scripts`: `^2.1.1`
- `@craco/craco`: `^3.1.1`

## Installation

First, follow the [`craco` Installation Instructions](https://github.com/sharegate/craco/blob/master/packages/craco/README.md##installation) to install the `craco` package, create a `craco.config.js` file, and modify the scripts in your `package.json`.

Then install `@baristalabs/craco-raw-loader`:

```bash
$ yarn add @baristalabs/craco-raw-loader

# OR

$ npm i -S @baristalabs/craco-raw-loader
```

## Usage

Here is a complete `craco.config.js` configuration file that adds raw-loader to `create-react-app`:

```js
const CracoRawLoaderPlugin = require("@baristalabs/craco-raw-loader");

module.exports = {
  plugins: [{ plugin: CracoRawLoaderPlugin }]
};
```

using craco-raw-loader without any configuration will use .txt as the pattern that raw-loader will use.

## Configuration

A single option named test sets the pattern that will be used

For example, to configure `raw-loader` to return files ending with .foo as a string:

```js
const CracoRawLoaderPlugin = require("@baristalabs/craco-raw-loader");

module.exports = {
  plugins: [
    {
      plugin: CracoRawLoaderPlugin,
      options: {
        test: /\.foo$/,
      }
    }
  ]
};
```

## Further Configuration

If you need to configure anything else for the webpack build, take a look at the
[Configuration Overview section in the `craco` README](https://github.com/sharegate/craco/blob/master/packages/craco/README.md#configuration-overview). You can use `CracoRawLoaderPlugin` while making other changes to `babel` and `webpack`, etc.

## Contributing

Install dependencies:

```bash
$ yarn install

# OR

$ npm install
```

Run tests:

```
$ yarn test
```

Before submitting a pull request, please check the following:

- All tests are passing
  - Run `yarn test`
- 100% test coverage
  - Coverage will be printed after running tests.
  - Open the coverage results in your browser: `open coverage/lcov-report/index.html`
- All code is formatted with [Prettier](https://prettier.io/)
  - Run `prettier --write **/*.js`
  - If you use VS Code, I recommend enabling the `formatOnSave` option.

## License

[MIT](./LICENSE)

Thanks to Form Applications, Inc. and [cracao-less](https://github.com/FormAPI/craco-less) for the project standup.
