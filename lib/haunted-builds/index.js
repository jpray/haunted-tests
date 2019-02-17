import { render, directive } from 'lit-html';
export { html, render } from 'lit-html';

const symbolFor = typeof Symbol === 'function' ? Symbol.for : str => str;

const phaseSymbol = symbolFor('haunted.phase');
const hookSymbol = symbolFor('haunted.hook');

const updateSymbol = symbolFor('haunted.update');
const commitSymbol = symbolFor('haunted.commit');
const effectsSymbol = symbolFor('haunted.effects');
const contextSymbol = symbolFor('haunted.context');

const contextEvent = 'haunted.context';

let current;
let currentId = 0;

function setCurrent(element) {
  current = element;
}

function clear() {
  current = null;
  currentId = 0;
}

function notify() {
  let id = currentId;
  currentId++;
  return id;
}

function scheduler() {
  let tasks = [];
  let id;

  function runTasks() {
    id = null;
    let t = tasks;
    tasks = [];
    for(var i = 0, len = t.length; i < len; i++) {
      t[i]();
    }
  }

  return function(task) {
    tasks.push(task);
    if(id == null) {
      id = requestAnimationFrame(runTasks);
    }
  };
}

const read = scheduler();
const write = scheduler();

class Container {
  constructor(renderer, frag, host) {
    this.renderer = renderer;
    this.frag = frag;
    this.host = host || frag;
    this[hookSymbol] = new Map();
    this[phaseSymbol] = null;
    this._updateQueued = false;
  }

  update() {
    if(this._updateQueued) return;
    read(() => {
      let result = this.handlePhase(updateSymbol);
      write(() => {
        this.handlePhase(commitSymbol, result);

        if(this[effectsSymbol]) {
          write(() => {
            this.handlePhase(effectsSymbol);
          });
        }
      });
      this._updateQueued = false;
    });
    this._updateQueued = true;
  }

  handlePhase(phase, arg) {
    this[phaseSymbol] = phase;
    switch(phase) {
      case commitSymbol: return this.commit(arg);
      case updateSymbol: return this.render();
      case effectsSymbol: return this.runEffects(effectsSymbol);
    }
    this[phaseSymbol] = null;
  }

  commit(result) {
    render(result, this.frag);
    this.runEffects(commitSymbol);
  }

  render() {
    setCurrent(this);
    let result = this.args ?
      this.renderer.apply(this.host, this.args) :
      this.renderer.call(this.host, this.host);
    clear();
    return result;
  }

  runEffects(symbol) {
    let effects = this[symbol];
    if(effects) {
      setCurrent(this);
      for(let effect of effects) {
        effect.call(this);
      }
      clear();
    }
  }

  teardown() {
    let hooks = this[hookSymbol];
    hooks.forEach((hook) => {
      if (typeof hook.teardown === 'function') {
        hook.teardown();
      }
    });
  }
}

function toCamelCase(val = '') {
  return val.indexOf('-') === -1 ? val.toLowerCase() : val.toLowerCase().split('-').reduce((out, part) => {
    return out ? out + part.charAt(0).toUpperCase() + part.slice(1) : part;
  },'') 
}

function component(renderer, BaseElement = HTMLElement, options = {useShadowDOM: true}) {
  class Element extends BaseElement {
    static get observedAttributes() {
      return renderer.observedAttributes || [];
    }

    constructor() {
      super();
      if (options.useShadowDOM === false) {
        this._container = new Container(renderer, this);
      } else {
        this.attachShadow({ mode: 'open' });
        this._container = new Container(renderer, this.shadowRoot, this);        
      }
    }

    connectedCallback() {
      this._container.update();
    }

    disconnectedCallback() {
      this._container.teardown();
    }

    attributeChangedCallback(name, _, newValue) {
      let val = newValue === '' ? true : newValue;
      Reflect.set(this, toCamelCase(name), val);
    }
  }
  function reflectiveProp(initialValue) {
    let value = initialValue;
    return Object.freeze({
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        this._container.update();
      }
    })
  }

  const proto = new Proxy(BaseElement.prototype, {
    set(target, key, value, receiver) {
      if(key in target) {
        Reflect.set(target, key, value);
      }
      let desc;
      if(typeof key === 'symbol' || key[0] === '_') {
        desc = {
          enumerable: true,
          configurable: true,
          writable: true,
          value
        }; 
      } else {
        desc = reflectiveProp(value);
      }
      Object.defineProperty(receiver, key, desc);

      if(desc.set) {
        desc.set.call(receiver, value);
      }

      return true;
    }
  });

  Object.setPrototypeOf(Element.prototype, proto);


  return Element;
}

class Hook {
  constructor(id, el) {
    this.id = id;
    this.el = el;
  }
}

function use(Hook, ...args) {
  let id = notify();
  let hooks = current[hookSymbol];
  
  let hook = hooks.get(id);
  if(!hook) {
    hook = new Hook(id, current, ...args);
    hooks.set(id, hook);
  }

  return hook.update(...args);
}

function hook(Hook) {
  return use.bind(null, Hook);
}

const useMemo = hook(class extends Hook {
  constructor(id, el, fn, values) {
    super(id, el);
    this.value = fn();
    this.values = values;
  }

  update(fn, values) {
    if(this.hasChanged(values)) {
      this.values = values;
      this.value = fn();
    }
    return this.value;
  }

  hasChanged(values) {
    return values.some((value, i) => this.values[i] !== value);
  }
});

const useCallback = (fn, inputs) => useMemo(() => fn, inputs);

function setEffects(el, cb) {
  if(!(effectsSymbol in el)) {
    el[effectsSymbol] = [];
  }
  el[effectsSymbol].push(cb);
}

const useEffect = hook(class extends Hook {
  constructor(id, el) {
    super(id, el);
    this.values = false;
    setEffects(el, this);
  }

  update(callback, values) {
    this.callback = callback;
    this.lastValues = this.values;
    this.values = values;
  }

  call() {
    if(this.values) {
      if(this.hasChanged()) {
        this.run();
      }
    } else {
      this.run();
    }
  }

  run() {
    this.teardown();
    this._teardown = this.callback.call(this.el);
  }

  teardown() {
    if(this._teardown) {
      this._teardown();
    }
  }

  hasChanged() {
    return this.lastValues === false || this.values.some((value, i) => this.lastValues[i] !== value);
  }
});

const useState = hook(class extends Hook {
  constructor(id, el, initialValue) {
    super(id, el);
    this.updater = this.updater.bind(this);
    this.makeArgs(initialValue);
  }

  update() {
    return this.args;
  }

  updater(value) {
    if (typeof value === "function") {
      const updaterFn = value;
      const [previousValue] = this.args;
      value = updaterFn(previousValue);
    }

    this.makeArgs(value);
    this.el.update();
  }

  makeArgs(value) {
    this.args = Object.freeze([value, this.updater]);
  }
});

const useReducer = hook(class extends Hook {
  constructor(id, el, _, initialState) {
    super(id, el);
    this.dispatch = this.dispatch.bind(this);
    this.state = initialState;
  }

  update(reducer) {
    this.reducer = reducer;
    return [this.state, this.dispatch];
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.el.update();
  }
});

class DirectiveContainer extends Container {
  constructor(renderer, part) {
    super(renderer, part);
    this.virtual = true;
  }

  commit(result) {
    this.host.setValue(result);
    this.host.commit();
  }
}

const map = new WeakMap();

function withHooks(renderer) {
  function factory(...args) {
    return part => {
      let cont = map.get(part);
      if(!cont) {
        cont = new DirectiveContainer(renderer, part);
        map.set(part, cont);
      }
      cont.args = args;
      cont.update();
    };
  }

  return directive(factory);
}

function setContexts(el, consumer) {
  if(!(contextSymbol in el)) {
    el[contextSymbol] = [];
  }
  el[contextSymbol].push(consumer);
}

const useContext = hook(class extends Hook {
  constructor(id, el) {
    super(id, el);
    setContexts(el, this);
    this._updater = this._updater.bind(this);
  }

  update(Context) {
    if (this.el.virtual) {
      throw new Error('can\'t be used with virtual components');
    }

    if (this.Context !== Context) {
      this._subscribe(Context);
      this.Context = Context;
    }

    return this.value;
  }

  _updater(value) {
    this.value = value;
    this.el.update();
  }

  _subscribe(Context) {
    const detail = { Context, callback: this._updater };

    this.el.host.dispatchEvent(new CustomEvent(contextEvent, {
      detail, // carrier
      bubbles: true, // to bubble up in tree
      cancelable: true, // to be able to cancel
      composed: true, // to pass ShadowDOM boundaries
    }));

    const { unsubscribe, value } = detail;

    this.value = unsubscribe ? value : Context.defaultValue;

    this._unsubscribe = unsubscribe;
  }

  teardown() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
});

const createContext = (defaultValue) => {
  const Context = {};
  
  Context.Provider = class extends HTMLElement {
    constructor() {
      super();
      this.listeners = [];
  
      this.eventHandler = (event) => {
        const { detail } = event;
      
        if (detail.Context === Context) {
          detail.value = this.value;
      
          detail.unsubscribe = () => {
            const index = this.listeners.indexOf(detail.callback);

            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          };

          this.listeners.push(detail.callback);
  
          event.stopPropagation();
        }
      };
  
      this.addEventListener(contextEvent, this.eventHandler);
    }
  
    disconnectedCallback() {
      this.removeEventListener(contextEvent, this.eventHandler);
    }

    set value(value) {
      this._value = value;
      this.listeners.forEach(callback => callback(value));
    }

    get value() {
      return this._value;
    }
  };

  Context.Consumer = component(function ({ render: render$$1 }) {
    const context = useContext(Context);

    return render$$1(context);
  });

  Context.defaultValue = defaultValue;

  return Context;
};

export { component, useCallback, useEffect, useState, useReducer, useMemo, withHooks, withHooks as virtual, useContext, createContext, hook, Hook };
