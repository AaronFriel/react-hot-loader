declare module 'global' {
  export var __RLYEH__: IRlyeh;

  let global: NodeJS.Global & { __RLYEH__: IRlyeh };
  export default global;
}
