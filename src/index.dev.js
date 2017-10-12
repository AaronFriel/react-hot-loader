const AppContainer = require('./AppContainer')

module.exports = function warnAboutIncorrectUsage(arg) {
  if (this && this.callback) {
    throw new Error(
      'Rlyeh: The Webpack loader is now exported separately. ' +
        'If you use Babel, we recommend that you remove "rlyeh" ' +
        'from the "loaders" section of your Webpack configuration altogether, ' +
        'and instead add "rlyeh/lib/babel-plugin" to the "plugins" section ' +
        'of your .babelrc file. ' +
        'If you prefer not to use Babel, replace "rlyeh" or ' +
        '"react-hot" with "rlyeh/lib/webpack" in the "loaders" section ' +
        'of your Webpack configuration.',
    )
  } else if (arg && arg.types && arg.types.IfStatement) {
    throw new Error(
      'Rlyeh: The Babel plugin is exported separately. ' +
        'Replace "rlyeh" with "rlyeh/lib/babel-plugin" ' +
        'in the "plugins" section of your .babelrc file. ' +
        'While we recommend the above, if you prefer not to use Babel, ' +
        'you may remove "rlyeh" from the "plugins" section of ' +
        'your .babelrc file altogether, and instead add ' +
        '"rlyeh/lib/webpack" to the "loaders" section of your Webpack ' +
        'configuration.',
    )
  } else {
    throw new Error(
      'Rlyeh does not have a default export. ' +
        'If you use the import statement, make sure to include the ' +
        'curly braces: import { AppContainer } from "rlyeh". ' +
        'If you use CommonJS, make sure to read the named export: ' +
        'require("rlyeh").AppContainer.',
    )
  }
}

module.exports.AppContainer = AppContainer
