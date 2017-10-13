/// <reference types='node' />

interface IRlyeh {
  register(type: any, uniqueLocalName: string, fileName: string): void;
}

interface NodeModule {
    hot?: boolean
}

declare namespace NodeJS {
  interface Global {
    __RLYEH__: IRlyeh;
  }
}
