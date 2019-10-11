const CracoRawLoaderPlugin = require("./craco-raw-loader");

const {
  applyCracoConfigPlugins,
  applyWebpackConfigPlugins
} = require("@craco/craco/lib/features/plugins");

const clone = require("clone");

const { craPaths, loadWebpackDevConfig } = require("@craco/craco/lib/cra");

const context = { env: "development", paths: craPaths };

let originalWebpackConfig;
let webpackConfig;
beforeEach(() => {
  if (!originalWebpackConfig) {
    process.env.NODE_ENV = context.env;
    originalWebpackConfig = loadWebpackDevConfig({
      reactScriptsVersion: "react-scripts"
    });
    process.env.NODE_ENV = "test";
  }

  webpackConfig = clone(originalWebpackConfig);
});

const applyCracoConfigAndOverrideWebpack = cracoConfig => {
  cracoConfig = applyCracoConfigPlugins(cracoConfig, context);
  webpackConfig = applyWebpackConfigPlugins(
    cracoConfig,
    webpackConfig,
    context
  );
};

test("the webpack config is modified correctly without raw-loader options", () => {
  applyCracoConfigAndOverrideWebpack({ plugins: [{ plugin: CracoRawLoaderPlugin }] });
  const oneOfRules = webpackConfig.module.rules.find(r => r.oneOf);
  expect(oneOfRules).not.toBeUndefined();
  const rawLoaderRule = oneOfRules.oneOf.find(
    r => r.test && r.test.toString() === "/\\.txt$/"
  );
  expect(rawLoaderRule).not.toBeUndefined();
  expect(rawLoaderRule.use[0].loader).toContain("/raw-loader");
  expect(rawLoaderRule.use[0].options).toEqual(undefined);
});

test("the webpack config is modified correctly with raw-loader options", () => {
  applyCracoConfigAndOverrideWebpack({
    plugins: [
      {
        plugin: CracoRawLoaderPlugin,
        options: {
          test: /\.foo$/
        }
      }
    ]
  });

  const oneOfRules = webpackConfig.module.rules.find(r => r.oneOf);
  expect(oneOfRules).not.toBeUndefined();
  const rawLoaderRule = oneOfRules.oneOf.find(
    r => r.test && r.test.toString() === "/\\.foo$/"
  );
  expect(rawLoaderRule).not.toBeUndefined();
  expect(rawLoaderRule.use[0].loader).toContain("/raw-loader");
  expect(rawLoaderRule.use[0].options).toEqual(undefined);
});

test("throws an error when we can't find file-loader in the webpack config", () => {
  let oneOfRules = webpackConfig.module.rules.find(r => r.oneOf);
  oneOfRules.oneOf = oneOfRules.oneOf.filter(
    r => !(r.loader && r.loader.includes("file-loader"))
  );

  const runTest = () => {
    applyCracoConfigAndOverrideWebpack({
      plugins: [{ plugin: CracoRawLoaderPlugin }]
    });
  };

  expect(runTest).toThrowError(
    "Can't find file-loader in the webpack config!\n\n" +
    "This error probably occurred because you updated react-scripts or craco. " +
    "Please try updating @baristalabs/craco-raw-loader to the latest version:\n\n" +
    "   $ yarn upgrade @baristalabs/craco-raw-loader\n\n" +
    "Or:\n\n" +
    "   $ npm update @baristalabs/craco-raw-loader\n\n" +
    "If that doesn't work, @baristalabs/craco-raw-loader needs to be fixed to support the latest version.\n" +
    "Please check to see if there's already an issue in the BaristaLabs/craco-raw-loader repo:\n\n" +
    "   * https://github.com/BaristaLabs/craco-raw-loader/issues?q=is%3Aissue+webpack+file-loader\n\n" +
    "If not, please open an issue and we'll take a look. (Or you can send a PR!)\n\n" +
    "You might also want to look for related issues in the " +
    "craco and create-react-app repos:\n\n" +
    "   * https://github.com/sharegate/craco/issues?q=is%3Aissue+webpack+file-loader\n" +
    "   * https://github.com/facebook/create-react-app/issues?q=is%3Aissue+webpack+file-loader\n"
  );
});

test("throws an error when we can't find the oneOf rules in the webpack config", () => {
  let oneOfRules = webpackConfig.module.rules.find(r => r.oneOf);
  oneOfRules.oneOf = null;

  const runTest = () => {
    applyCracoConfigAndOverrideWebpack({
      plugins: [{ plugin: CracoRawLoaderPlugin }]
    });
  };

  expect(runTest).toThrowError(
    "Can't find a 'oneOf' rule under module.rules in the webpack config!\n\n" +
    "This error probably occurred because you updated react-scripts or craco. " +
    "Please try updating @baristalabs/craco-raw-loader to the latest version:\n\n" +
    "   $ yarn upgrade @baristalabs/craco-raw-loader\n\n" +
    "Or:\n\n" +
    "   $ npm update @baristalabs/craco-raw-loader\n\n" +
    "If that doesn't work, @baristalabs/craco-raw-loader needs to be fixed to support the latest version.\n" +
    "Please check to see if there's already an issue in the BaristaLabs/craco-raw-loader repo:\n\n" +
    "   * https://github.com/BaristaLabs/craco-raw-loader/issues?q=is%3Aissue+webpack+rules+oneOf\n\n" +
    "If not, please open an issue and we'll take a look. (Or you can send a PR!)\n\n" +
    "You might also want to look for related issues in the " +
    "craco and create-react-app repos:\n\n" +
    "   * https://github.com/sharegate/craco/issues?q=is%3Aissue+webpack+rules+oneOf\n" +
    "   * https://github.com/facebook/create-react-app/issues?q=is%3Aissue+webpack+rules+oneOf\n"
  );
});
