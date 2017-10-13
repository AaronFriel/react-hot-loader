import { RawSourceMap, SourceMapGenerator } from 'source-map';

export function makeIdentitySourceMap(content: string, resourcePath: string): RawSourceMap {
  const map = new SourceMapGenerator();
  map.setSourceContent(resourcePath, content);

  content.split('\n').forEach((line, index) => {
    map.addMapping({
      generated: {
        column: 0,
        line: index + 1,
      },
      original: {
        column: 0,
        line: index + 1,
      },
      source: resourcePath,
    });
  });

  // Not defined in the .d.ts, but part of the API since late 2012.
  // @ts-ignore
  return map.toJSON();
}
