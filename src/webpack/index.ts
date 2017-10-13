import { loader } from 'webpack';

import fs from 'fs';
import path from 'path';
import { SourceMapConsumer, SourceNode } from 'source-map';
import { makeIdentitySourceMap } from './makeIdentitySourceMap';

declare var tagCommonJSExportsSource: any;
declare var map: any;

const transform: loader.Loader = function transform(this, source, sourceMap) {
  // This is a Webpack loader, but the user put it in the Babel config.
  {
    const babel: any = source;
    if (babel && babel.types && babel.types.IfStatement) {
      throw new Error(
        'Rlyeh: You are erroneously trying to use a Webpack loader ' +
          'as a Babel plugin. Replace "rlyeh/lib/webpack" with ' +
          '"rlyeh/lib/babel-plugin" in the "plugins" section of your .babelrc file. ' +
          'While we recommend the above, if you prefer not to use Babel, ' +
          'you may remove "rlyeh/lib/webpack" from the "plugins" section of ' +
          'your .babelrc file altogether, and instead add "rlyeh/lib/webpack" ' +
          'to the "loaders" section of your Webpack configuration.',
      );
    }
  }

  if (source instanceof Buffer) {
    return;
  }

  if (this.cacheable) {
    this.cacheable();
  }

  // Read the helper once.
  if (!tagCommonJSExportsSource) {
    tagCommonJSExportsSource = fs
      .readFileSync(path.join(__dirname, 'tagCommonJSExports.js'), 'utf8')
      // Babel inserts these.
      // Ideally we'd opt out for one file but this is simpler.
      .replace(/['"]use strict['"];/, '')
      // eslint comments don't need to end up in the output
      .replace(/\/\/ eslint-disable-line .*\n/g, '\n')
      .replace(/\/\* global.*\*\//, '')
      .split(/\n\s*/)
      .join(' ');
  }

  // Parameterize the helper with the current filename.
  const separator = '\n\n';
  const appendText = tagCommonJSExportsSource.replace(
    /__FILENAME__/g,
    JSON.stringify(this.resourcePath),
  );

  if (this.sourceMap === false) {
    return this.callback(null, [source, appendText].join(separator));
  }

  if (!map) {
    map = makeIdentitySourceMap(source, this.resourcePath); // eslint-disable-line no-param-reassign
  }
  const node = new SourceNode(null, null, null, [
    SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map)),
    new SourceNode(null, null, this.resourcePath, appendText),
  ]).join(separator);

  const result = node.toStringWithSourceMap();
  return this.callback(null, result.code, result.map.toString());
};

export default transform;
