module.exports = {
  overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
    const {
      getLoader,
      loaderByName,
      throwUnexpectedConfigError
    } = require("@craco/craco");

    const throwError = (message, githubIssueQuery) =>
      throwUnexpectedConfigError({
        packageName: "@baristalabs/craco-raw-loader",
        githubRepo: "BaristaLabs/craco-raw-loader",
        message,
        githubIssueQuery
      });

    pluginOptions = pluginOptions || { test: /\.txt$/ };

    const rawLoaderRule = {
      test: pluginOptions.test,
      use: [
        {
          loader: require.resolve("raw-loader")
        },
      ]
    };

    const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
    if (!oneOfRule) {
      throwError(
        "Can't find a 'oneOf' rule under module.rules in the webpack config!",
        "webpack+rules+oneOf"
      );
    }
    oneOfRule.oneOf.push(rawLoaderRule);

    const { isFound, match: fileLoaderMatch } = getLoader(
      webpackConfig,
      loaderByName("file-loader")
    );
    if (!isFound) {
      throwError(
        "Can't find file-loader in the webpack config!",
        "webpack+file-loader"
      );
    }
    fileLoaderMatch.loader.exclude.push(pluginOptions.test);

    return webpackConfig;
  }
};
