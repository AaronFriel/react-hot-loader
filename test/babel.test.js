import path from 'path'
import fs from 'fs'
import { transformFileSync } from 'babel-core'
import escapeStringRegexp from 'escape-string-regexp'

const FIXTURES_DIR = path.join(__dirname, '__babel_fixtures__')

function trim(str) {
  return str.replace(/^\s+|\s+$/, '')
}



describe('tags potential React components', () => {
  fs.readdirSync(FIXTURES_DIR).forEach(fixtureName => {
    const fixtureFile = path.join(FIXTURES_DIR, fixtureName)
    if (fs.statSync(fixtureFile).isFile()) {
      it(fixtureName.split('-').join(' '), () => {
        const actual = transformFileSync(fixtureFile).code
        const filename = makeAmbiguousPathSep(fixtureFile)
        const codeWithoutFilename = generalizeFixture(actual, filename)
        expect(trim(codeWithoutFilename)).toMatchSnapshot()
      })
    }
  })
})

describe('copies arrow function body block onto hidden class methods', () => {
  const fixturesDir = path.join(FIXTURES_DIR, 'class-properties')
  fs.readdirSync(fixturesDir).forEach(fixtureName => {
    const fixtureFile = path.join(fixturesDir, fixtureName)
    if (fs.statSync(fixtureFile).isFile()) {
      it(fixtureName.split('-').join(' '), () => {
        const actual = transformFileSync(fixtureFile).code
        const filename = makeAmbiguousPathSep(fixtureFile)
        const codeWithoutFilename = generalizeFixture(actual, filename)
        expect(trim(codeWithoutFilename)).toMatchSnapshot()
      })
    }
  })
})


/**
 * @type {string} RegExp that matches a Posix or Windows path separator.
 */
const pathSepRegExp = new RegExp(/[\\/]/, 'g');

/**
 * Replace path separators with the string [\\/], to match either
 * Posix or Windows.
 *
 * @param {string} path An input path.
 */
function makeAmbiguousPathSep(path) {
  return path.replace(pathSepRegExp, String.raw`[\\/]`);
}

/**
 * Replace instances of the fixture's filename with the generic __FILENAME__
 * for reliable testing.
 *
 * @param {string} actual Source code from fixture.
 * @param {string} filename The file name to substitute.
 */
function generalizeFixture(actual, filename) {
  return actual.replace(new RegExp(`['"]${filename}['"]`, 'g'), '__FILENAME__');
}

