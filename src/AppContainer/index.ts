// tslint:disable:no-require-imports
// tslint:disable:no-var-requires
import { IAppContainer } from './types';

export default IAppContainer;
// tslint:disable-next-line:prefer-conditional-expression
if (process.env.NODE_ENV !== 'production' && module.hot !== undefined) {
    module.exports = require('./dev');
} else {
    module.exports = require('./prod');
}
