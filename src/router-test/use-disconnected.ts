import { hook, Hook } from "haunted-w-microtask";

/**
 * Purpose: Provided callback will be called when containerement is disconnected from DOM.
 *          Useful for doing cleanup.
 * Example Usage:
 * ```
 * useDisconnected(callback)
 * ```
 */
const useDisconnected = hook(
  class extends Hook {
    _callback: Function;
    constructor(id, container, callback) {
      super(id, container);
      this._callback = callback;
    }

    update(): void {}

    teardown(): void {
      this._callback();
    }
  }
);

export { useDisconnected };
