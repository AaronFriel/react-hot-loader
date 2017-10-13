// Global:
declare var __RLYEH__: IRlyeh;
// Local?:
declare var __webpack_exports__: any;

(function register() {
  // eslint-disable-line no-extra-semi
  /* rlyeh/lib/webpack */
  if (process.env.NODE_ENV !== 'production') {
    if (typeof __RLYEH__ === 'undefined') {
      return;
    }

    /* eslint-disable camelcase, no-undef */
    const webpackExports =
      typeof __webpack_exports__ !== 'undefined'
        ? __webpack_exports__
        : module.exports;
    /* eslint-enable camelcase, no-undef */

    if (typeof webpackExports === 'function') {
      __RLYEH__.register(
        webpackExports,
        'module.exports',
        __filename,
      );
      return;
    }

    /* eslint-disable no-restricted-syntax */
    for (const key in webpackExports) {
      /* eslint-enable no-restricted-syntax */
      if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) {
        continue;
      }

      let namedExport;
      try {
        namedExport = webpackExports[key];
      } catch (err) {
        continue;
      }

      __RLYEH__.register(namedExport, key, __filename);
    }
  }
})();
