// tslint:disable:no-var-requires
import { AppContainer as ProdAppContainer } from './prod';

export let AppContainer: typeof ProdAppContainer = (process.env.NODE_ENV !== 'production' && module.hot !== undefined)
    ? require('./dev').AppContainer
    : require('./prod').AppContainer;
