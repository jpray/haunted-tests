import { hook, Hook } from "haunted-w-microtask";

/**
 * Purpose: Returns a function that will queue the element for updating
 * Example Usage:
 * ```
 * const updateFn = useTriggerUpdate();
 * ```
 */
const useTriggerUpdate = hook(
  class extends Hook {
    _container: { update: Function };
    constructor(id, container) {
      super(id, container);
      this._container = container;
    }

    update(): Function {
      return this._container.update.bind(this._container);
    }
  }
);

export { useTriggerUpdate };
