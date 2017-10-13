 export =
    (process.env.NODE_ENV !== 'production' && module.hot !== undefined)
    ? require('./dev')
    : undefined;
