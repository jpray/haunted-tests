import { hook, Hook } from '../haunted-custom/hook.js';
import { sharedStateSymbol } from '../haunted-custom/symbols.js';


const sharedState = new Map();
const subscribersByKey = new Map();

function hasSharedState(stateKey): boolean {
  return sharedState.has(stateKey);
}

function getSharedState(stateKey): any {
  return sharedState.get(stateKey);
}

function setSharedState(stateKey, value): void {
  sharedState.set(stateKey, value);
  (subscribersByKey.get(stateKey) || []).forEach((el) => {
    el.update();
  })
}

function registerSharedState(el, consumer): void {
    if(!(sharedStateSymbol in el)) {
      el[sharedStateSymbol] = [];
    }
    el[sharedStateSymbol].push(consumer);
  }

const useSharedState = hook(class extends Hook {
    stateKey: string;
    el: any;
  constructor(id, el, stateKey, initialValue) {
    super(id, el);
    registerSharedState(el, this);
    this.stateKey = stateKey;
    this.updater = this.updater.bind(this);
    if (typeof initialValue !== 'undefined') {
        setSharedState(this.stateKey, initialValue);
    }
    
    if (!subscribersByKey.get(stateKey)) {
        subscribersByKey.set(stateKey, new Map());
    }
    subscribersByKey.get(stateKey).set(el, el); //TODO: maybe use Set()
  }

  update(): [any, (arg0: any) => void] {
    return [sharedState.get(this.stateKey), this.updater];
  }

  unsubscribe(): void {
    subscribersByKey.get(this.stateKey).delete(this.el);
  }

  updater(value: any): void {
    if (typeof value === "function") {
      const updaterFn = value;
      value = updaterFn(sharedState.get(this.stateKey));
    }

    setSharedState(this.stateKey, value);
  }
});

export { useSharedState, hasSharedState, setSharedState, getSharedState };
