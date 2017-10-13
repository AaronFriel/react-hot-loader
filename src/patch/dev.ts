import global = require('global');
import React =  require('react');
import createProxy from 'react-proxy';

type ReactType = { displayName?: string; name?: string } & React.StatelessComponent;

interface ISlot<V> {
  key: ReactType;
  value: V;
}

// tslint:disable-next-line:interface-name
interface WeakMap<K extends object, V> {
  delete(key: K): boolean;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): this;
}

// tslint:disable-next-line:interface-name
interface WeakMapConstructor {
  readonly prototype: WeakMap<object, any>;
  new (): WeakMap<object, any>;
  new <K extends object, V>(entries?: Array<[K, V]>): WeakMap<K, V>;
}

declare const WeakMap: WeakMapConstructor;

class ComponentMap<V> {
  // @ts-ignore
  private wm: WeakMap<ReactType, V>;
  private slots: { [key: string]: Array<ISlot<V>> };

  constructor(useWeakMap: boolean) {
    if (useWeakMap) {
      // @ts-ignore
      this.wm = new WeakMap<ReactType, V>();
    } else {
      this.slots = {};
    }
  }

  public getSlot(type: ReactType): Array<ISlot<V>> {
    const key = type.displayName || type.name || 'Unknown';
    if (!this.slots[key]) {
      this.slots[key] = [];
    }
    return this.slots[key];
  }

  public get(type: ReactType): V | undefined {
    if (this.wm) {
      return this.wm.get(type);
    }

    const slot = this.getSlot(type);
    for (const item of slot) {
      if (item.key === type) {
        return item.value;
      }
    }

    return undefined;
  }

  public set(type: ReactType, value: V): void {
    if (this.wm) {
      this.wm.set(type, value);
    } else {
      const slot = this.getSlot(type);
      for (const item of slot) {
        if (item.key === type) {
          item.value = value;
          return;
        }
      }
      slot.push({ key: type, value });
    }
  }

  public has(type: ReactType) {
    if (this.wm) {
      return this.wm.has(type);
    }

    const slot = this.getSlot(type);
    for (const item of slot) {
      if (item.key === type) {
        return true;
      }
    }
    return false;
  }
}

let proxiesByID: { [key: string]: any };
let didWarnAboutID: { [key: string]: boolean };
let hasCreatedElementsByType: ComponentMap<boolean>;
let idsByType: ComponentMap<string>;
let knownSignatures: { [key: string]: ReactType };
let didUpdateProxy: boolean;

const hooks = {
  register(type: ReactType, uniqueLocalName: string, fileName: string) {
    if (typeof type !== 'function') {
      return;
    }
    if (!uniqueLocalName || !fileName) {
      return;
    }
    if (typeof uniqueLocalName !== 'string' || typeof fileName !== 'string') {
      return;
    }
    const id = fileName + '#' + uniqueLocalName; // eslint-disable-line prefer-template
    if (!idsByType.has(type) && hasCreatedElementsByType.has(type)) {
      if (!didWarnAboutID[id]) {
        didWarnAboutID[id] = true;
        const baseName = fileName.replace(/^.*[\\/]/, '');
        console.error(
          `Rlyeh: ${uniqueLocalName} in ${fileName} will not hot reload ` +
            `correctly because ${baseName} uses <${uniqueLocalName} /> during ` +
            `module definition. For hot reloading to work, move ${uniqueLocalName} ` +
            `into a separate file and import it from ${baseName}.`,
        );
      }
      return;
    }

    // Remember the ID.
    idsByType.set(type, id);

    // We use React Proxy to generate classes that behave almost
    // the same way as the original classes but are updatable with
    // new versions without destroying original instances.
    if (!proxiesByID[id]) {
      proxiesByID[id] = createProxy(type);
    } else {
      proxiesByID[id].update(type);
      didUpdateProxy = true;
    }
  },

  reset(useWeakMap: boolean) {
    proxiesByID = {};
    didWarnAboutID = {};
    hasCreatedElementsByType = new ComponentMap(useWeakMap);
    idsByType = new ComponentMap(useWeakMap);
    knownSignatures = {};
    didUpdateProxy = false;
  },
};

hooks.reset(WeakMap !== undefined && typeof WeakMap === 'function');

function warnAboutUnnacceptedClass(typeSignature: string) {
  if (didUpdateProxy) {
    console.warn(
      'Rlyeh: this component is not accepted by Hot Loader. \n' +
        'Please check is it extracted as a top level class, a function or a variable. \n' +
        'Click below to reveal the source location: \n',
      typeSignature,
    );
  }
}

function resolveType(type: ReactType) {
  // We only care about composite components
  if (typeof type !== 'function') {
    return type;
  }

  const wasKnownBefore = hasCreatedElementsByType.get(type);
  hasCreatedElementsByType.set(type, true);

  // When available, give proxy class to React instead of the real class.
  const id = idsByType.get(type);
  if (!id) {
    if (!wasKnownBefore) {
      const signature = type.toString();
      if (knownSignatures[signature]) {
        warnAboutUnnacceptedClass(signature);
      } else {
        knownSignatures[signature] = type;
      }
    }
    return type;
  }

  const proxy = proxiesByID[id];
  if (!proxy) {
    return type;
  }

  return proxy.get();
}

const createElement = React.createElement;
function patchedCreateElement(type: any, ...args: any[]) {
  // Trick React into rendering a proxy so that
  // its state is preserved when the class changes.
  // This will update the proxy if it's for a known type.
  const resolvedType = resolveType(type);
  return createElement(resolvedType, ...args);
}

function patchedCreateFactory(type: any) {
  // Patch React.createFactory to use patched createElement
  // because the original implementation uses the internal,
  // unpatched ReactElement.createElement
  const factory = patchedCreateElement.bind(null, type);
  factory.type = type;
  return factory;
}

if (typeof global.__RLYEH__ === 'undefined') {
  // @ts-ignore
  React.createElement = patchedCreateElement as any;
  // @ts-ignore
  React.createFactory = patchedCreateFactory as any;
  // @ts-ignore
  global.__RLYEH__ = hooks;
}
