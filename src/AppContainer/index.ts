// tslint:disable:no-require-imports
// tslint:disable:no-var-requires
import { IAppContainer } from './types';

export default IAppContainer;
module.exports =
    (process.env.NODE_ENV !== 'production' && module.hot !== undefined)
    ? require('./dev')
    : require('./prods');
