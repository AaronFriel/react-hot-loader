 export =
    (process.env.NODE_ENV !== 'production' && module.hot !== undefined)
    // tslint:disable-next-line:no-var-requires
    ? require('./dev')
    : undefined;
