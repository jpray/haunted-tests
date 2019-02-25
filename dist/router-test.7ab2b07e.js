// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../../node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive so that lit-html will call the function
 * during template rendering, rather than passing as a value.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object
 *
 * @example
 *
 * ```
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 * ```
 */
// tslint:disable-next-line:no-any

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};

exports.isDirective = isDirective;
},{}],"../../node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), into another container (could be the same container), before
 * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
 * container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  let node = start;

  while (node !== end) {
    const n = node.nextSibling;
    container.insertBefore(node, before);
    node = n;
  }
};
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, startNode, endNode = null) => {
  let node = startNode;

  while (node !== endNode) {
    const n = node.nextSibling;
    container.removeChild(node);
    node = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"../../node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.noChange = void 0;

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

exports.noChange = noChange;
const nothing = {};
exports.nothing = nothing;
},{}],"../../node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    let index = -1;
    let partIndex = 0;
    const nodesToRemove = [];

    const _prepareTemplate = template => {
      const content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null

      const walker = document.createTreeWalker(content, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false); // Keeps track of the last index associated with a part. We try to delete
      // unnecessary nodes, but we never want to associate two different parts
      // to the same index. They must have a constant node between.

      let lastPartIndex = 0;

      while (walker.nextNode()) {
        index++;
        const node = walker.currentNode;

        if (node.nodeType === 1
        /* Node.ELEMENT_NODE */
        ) {
            if (node.hasAttributes()) {
              const attributes = node.attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondance between part index and attribute index.

              let count = 0;

              for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].value.indexOf(marker) >= 0) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                const stringForPart = result.strings[partIndex]; // Find the attribute name

                const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // All bound attributes have had a suffix added in
                // TemplateResult#getHTML to opt out of special attribute
                // handling. To look up the attribute value we also need to add
                // the suffix.

                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                const attributeValue = node.getAttribute(attributeLookupName);
                const strings = attributeValue.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings
                });
                node.removeAttribute(attributeLookupName);
                partIndex += strings.length - 1;
              }
            }

            if (node.tagName === 'TEMPLATE') {
              _prepareTemplate(node);
            }
          } else if (node.nodeType === 3
        /* Node.TEXT_NODE */
        ) {
            const data = node.data;

            if (data.indexOf(marker) >= 0) {
              const parent = node.parentNode;
              const strings = data.split(markerRegex);
              const lastIndex = strings.length - 1; // Generate a new text node for each literal section
              // These nodes are also used as the markers for node parts

              for (let i = 0; i < lastIndex; i++) {
                parent.insertBefore(strings[i] === '' ? createMarker() : document.createTextNode(strings[i]), node);
                this.parts.push({
                  type: 'node',
                  index: ++index
                });
              } // If there's no text, we must insert a comment to mark our place.
              // Else, we can trust it will stick around after cloning.


              if (strings[lastIndex] === '') {
                parent.insertBefore(createMarker(), node);
                nodesToRemove.push(node);
              } else {
                node.data = strings[lastIndex];
              } // We have a part for each match found


              partIndex += lastIndex;
            }
          } else if (node.nodeType === 8
        /* Node.COMMENT_NODE */
        ) {
            if (node.data === marker) {
              const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * The previousSibling is already the start of a previous part

              if (node.previousSibling === null || index === lastPartIndex) {
                index++;
                parent.insertBefore(createMarker(), node);
              }

              lastPartIndex = index;
              this.parts.push({
                type: 'node',
                index
              }); // If we don't have a nextSibling, keep this node so we have an end.
              // Else, we can remove it to save future costs.

              if (node.nextSibling === null) {
                node.data = '';
              } else {
                nodesToRemove.push(node);
                index--;
              }

              partIndex++;
            } else {
              let i = -1;

              while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                this.parts.push({
                  type: 'node',
                  index: -1
                });
              }
            }
          }
      }
    };

    _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"../../node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this._parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this._parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this._parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // When using the Custom Elements polyfill, clone the node, rather than
    // importing it, to keep the fragment in the template's document. This
    // leaves the fragment inert so custom elements won't upgrade and
    // potentially modify their contents by creating a polyfilled ShadowRoot
    // while we traverse the tree.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const parts = this.template.parts;
    let partIndex = 0;
    let nodeIndex = 0;

    const _prepareInstance = fragment => {
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null
      const walker = document.createTreeWalker(fragment, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false);
      let node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length && node !== null) {
        const part = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
        // multiple bound attributes on an element. So each iteration we either
        // increment the nodeIndex, if we aren't on a node with a part, or the
        // partIndex if we are. By not incrementing the nodeIndex when we find a
        // part, we allow for the next part to be associated with the current
        // node if neccessasry.

        if (!(0, _template.isTemplatePartActive)(part)) {
          this._parts.push(undefined);

          partIndex++;
        } else if (nodeIndex === part.index) {
          if (part.type === 'node') {
            const part = this.processor.handleTextExpression(this.options);
            part.insertAfterNode(node.previousSibling);

            this._parts.push(part);
          } else {
            this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
          }

          partIndex++;
        } else {
          nodeIndex++;

          if (node.nodeName === 'TEMPLATE') {
            _prepareInstance(node.content);
          }

          node = walker.nextNode();
        }
      }
    };

    _prepareInstance(fragment);

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"../../node_modules/lit-html/lib/dom.js","./template.js":"../../node_modules/lit-html/lib/template.js"}],"../../node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const endIndex = this.strings.length - 1;
    let html = '';

    for (let i = 0; i < endIndex; i++) {
      const s = this.strings[i]; // This exec() call does two things:
      // 1) Appends a suffix to the bound attribute name to opt out of special
      // attribute value parsing that IE11 and Edge do, like for style and
      // many SVG attributes. The Template class also appends the same suffix
      // when looking up attributes to create Parts.
      // 2) Adds an unquoted-attribute-safe marker for the first expression in
      // an attribute. Subsequent attribute expressions will use node markers,
      // and this is safe since attributes with multiple expressions are
      // guaranteed to be quoted.

      const match = _template.lastAttributeNameRegex.exec(s);

      if (match) {
        // We're starting a new bound attribute.
        // Add the safe attribute suffix, and use unquoted-attribute-safe
        // marker.
        html += s.substr(0, match.index) + match[1] + match[2] + _template.boundAttributeSuffix + match[3] + _template.marker;
      } else {
        // We're either in a bound node, or trailing bound attribute.
        // Either way, nodeMarker is safe to use.
        html += s + _template.nodeMarker;
      }
    }

    return html + this.strings[endIndex];
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"../../node_modules/lit-html/lib/dom.js","./template.js":"../../node_modules/lit-html/lib/template.js"}],"../../node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};
/**
 * Sets attribute values for AttributeParts, so that the value is only set once
 * even if there are multiple parts for an attribute.
 */


exports.isPrimitive = isPrimitive;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (v != null && (Array.isArray(v) || // tslint:disable-next-line:no-any
        typeof v !== 'string' && v[Symbol.iterator])) {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        } else {
          text += typeof v === 'string' ? v : String(v);
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}

exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(comitter) {
    this.value = undefined;
    this.committer = comitter;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}

exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.options = options;
  }
  /**
   * Inserts this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
   * its next sibling must be static, unchanging nodes such as those that appear
   * in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part._insert(this.startNode = (0, _template.createMarker)());

    part._insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Appends this part after `ref`
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref._insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    const value = this._pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this._commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this._commitTemplateResult(value);
    } else if (value instanceof Node) {
      this._commitNode(value);
    } else if (Array.isArray(value) || // tslint:disable-next-line:no-any
    value[Symbol.iterator]) {
      this._commitIterable(value);
    } else if (value === _part.nothing) {
      this.value = _part.nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this._commitText(value);
    }
  }

  _insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  _commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this._insert(value);

    this.value = value;
  }

  _commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value;

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = value;
      } else {
      this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
    }

    this.value = value;
  }

  _commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this._commitNode(fragment);

      this.value = instance;
    }
  }

  _commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this._pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    if (this._pendingValue === _part.noChange) {
      return;
    }

    const value = !!this._pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }
    }

    this.value = value;
    this._pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // tslint:disable-next-line:no-any

      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  }; // tslint:disable-next-line:no-any

  window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this._boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    if (this._pendingValue === _part.noChange) {
      return;
    }

    const newListener = this._pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
    }

    if (shouldAddListener) {
      this._options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
    }

    this.value = newListener;
    this._pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"../../node_modules/lit-html/lib/directive.js","./dom.js":"../../node_modules/lit-html/lib/dom.js","./part.js":"../../node_modules/lit-html/lib/part.js","./template-instance.js":"../../node_modules/lit-html/lib/template-instance.js","./template-result.js":"../../node_modules/lit-html/lib/template-result.js","./template.js":"../../node_modules/lit-html/lib/template.js"}],"../../node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const comitter = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return comitter.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const comitter = new _parts.AttributeCommitter(element, name, strings);
    return comitter.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"../../node_modules/lit-html/lib/parts.js"}],"../../node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"../../node_modules/lit-html/lib/template.js"}],"../../node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */
const parts = new WeakMap();
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"../../node_modules/lit-html/lib/dom.js","./parts.js":"../../node_modules/lit-html/lib/parts.js","./template-factory.js":"../../node_modules/lit-html/lib/template-factory.js"}],"../../node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "nothing", {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @module lit-html
 * @preferred
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */

const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"../../node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"../../node_modules/lit-html/lib/template-result.js","./lib/directive.js":"../../node_modules/lit-html/lib/directive.js","./lib/dom.js":"../../node_modules/lit-html/lib/dom.js","./lib/part.js":"../../node_modules/lit-html/lib/part.js","./lib/parts.js":"../../node_modules/lit-html/lib/parts.js","./lib/render.js":"../../node_modules/lit-html/lib/render.js","./lib/template-factory.js":"../../node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"../../node_modules/lit-html/lib/template-instance.js","./lib/template.js":"../../node_modules/lit-html/lib/template.js"}],"../../lib/haunted-builds/index-w-microtask.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.component = component;
exports.virtual = exports.withHooks = withHooks;
exports.hook = hook;
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml.html;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _litHtml.render;
  }
});
exports.Hook = exports.createContext = exports.useContext = exports.useMemo = exports.useReducer = exports.useState = exports.useEffect = exports.useCallback = void 0;

var _litHtml = require("lit-html");

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var symbolFor = typeof Symbol === 'function' ? Symbol.for : function (str) {
  return str;
};
var phaseSymbol = symbolFor('haunted.phase');
var hookSymbol = symbolFor('haunted.hook');
var updateSymbol = symbolFor('haunted.update');
var commitSymbol = symbolFor('haunted.commit');
var effectsSymbol = symbolFor('haunted.effects');
var contextSymbol = symbolFor('haunted.context');
var contextEvent = 'haunted.context';
var current;
var currentId = 0;

function setCurrent(element) {
  current = element;
}

function clear() {
  current = null;
  currentId = 0;
}

function notify() {
  var id = currentId;
  currentId++;
  return id;
}

var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function scheduler() {
  var tasks = [];
  var id;

  function runTasks() {
    id = null;
    var t = tasks;
    tasks = [];

    for (var i = 0, len = t.length; i < len; i++) {
      t[i]();
    }
  }

  return function (task) {
    tasks.push(task);

    if (id == null) {
      id = defer(runTasks);
    }
  };
}

var read = scheduler();
var write = scheduler();

var Container =
/*#__PURE__*/
function () {
  function Container(renderer, frag, host) {
    _classCallCheck(this, Container);

    this.renderer = renderer;
    this.frag = frag;
    this.host = host || frag;
    this[hookSymbol] = new Map();
    this[phaseSymbol] = null;
    this._updateQueued = false;
  }

  _createClass(Container, [{
    key: "update",
    value: function update() {
      var _this = this;

      if (this._updateQueued) return;
      read(function () {
        var result = _this.handlePhase(updateSymbol);

        write(function () {
          _this.handlePhase(commitSymbol, result);

          if (_this[effectsSymbol]) {
            write(function () {
              _this.handlePhase(effectsSymbol);
            });
          }
        });
        _this._updateQueued = false;
      });
      this._updateQueued = true;
    }
  }, {
    key: "handlePhase",
    value: function handlePhase(phase, arg) {
      this[phaseSymbol] = phase;

      switch (phase) {
        case commitSymbol:
          return this.commit(arg);

        case updateSymbol:
          return this.render();

        case effectsSymbol:
          return this.runEffects(effectsSymbol);
      }

      this[phaseSymbol] = null;
    }
  }, {
    key: "commit",
    value: function commit(result) {
      (0, _litHtml.render)(result, this.frag);
      this.runEffects(commitSymbol);
    }
  }, {
    key: "render",
    value: function render() {
      setCurrent(this);
      var result = this.args ? this.renderer.apply(this.host, this.args) : this.renderer.call(this.host, this.host);
      clear();
      return result;
    }
  }, {
    key: "runEffects",
    value: function runEffects(symbol) {
      var effects = this[symbol];

      if (effects) {
        setCurrent(this);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = effects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var effect = _step.value;
            effect.call(this);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        clear();
      }
    }
  }, {
    key: "teardown",
    value: function teardown() {
      var hooks = this[hookSymbol];
      hooks.forEach(function (hook) {
        if (typeof hook.teardown === 'function') {
          hook.teardown();
        }
      });
    }
  }]);

  return Container;
}();

function toCamelCase() {
  var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return val.indexOf('-') === -1 ? val.toLowerCase() : val.toLowerCase().split('-').reduce(function (out, part) {
    return out ? out + part.charAt(0).toUpperCase() + part.slice(1) : part;
  }, '');
}

function component(renderer) {
  var BaseElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : HTMLElement;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    useShadowDOM: true
  };

  var Element =
  /*#__PURE__*/
  function (_BaseElement) {
    _inherits(Element, _BaseElement);

    _createClass(Element, null, [{
      key: "observedAttributes",
      get: function get() {
        return renderer.observedAttributes || [];
      }
    }]);

    function Element() {
      var _this2;

      _classCallCheck(this, Element);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Element).call(this));

      if (options.useShadowDOM === false) {
        _this2._container = new Container(renderer, _assertThisInitialized(_this2));
      } else {
        _this2.attachShadow({
          mode: 'open'
        });

        _this2._container = new Container(renderer, _this2.shadowRoot, _assertThisInitialized(_this2));
      }

      return _this2;
    }

    _createClass(Element, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        this._container.update();
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this._container.teardown();
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, _, newValue) {
        var val = newValue === '' ? true : newValue;
        Reflect.set(this, toCamelCase(name), val);
      }
    }]);

    return Element;
  }(BaseElement);

  function reflectiveProp(initialValue) {
    var value = initialValue;
    return Object.freeze({
      enumerable: true,
      configurable: true,
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        value = newValue;

        this._container.update();
      }
    });
  }

  var proto = new Proxy(BaseElement.prototype, {
    set: function set(target, key, value, receiver) {
      if (key in target) {
        Reflect.set(target, key, value);
      }

      var desc;

      if (_typeof(key) === 'symbol' || key[0] === '_') {
        desc = {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
        };
      } else {
        desc = reflectiveProp(value);
      }

      Object.defineProperty(receiver, key, desc);

      if (desc.set) {
        desc.set.call(receiver, value);
      }

      return true;
    }
  });
  Object.setPrototypeOf(Element.prototype, proto);
  return Element;
}

var Hook = function Hook(id, el) {
  _classCallCheck(this, Hook);

  this.id = id;
  this.el = el;
};

exports.Hook = Hook;

function use(Hook) {
  var _hook;

  var id = notify();
  var hooks = current[hookSymbol];
  var hook = hooks.get(id);

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (!hook) {
    hook = _construct(Hook, [id, current].concat(args));
    hooks.set(id, hook);
  }

  return (_hook = hook).update.apply(_hook, args);
}

function hook(Hook) {
  return use.bind(null, Hook);
}

var useMemo = hook(
/*#__PURE__*/
function (_Hook) {
  _inherits(_class, _Hook);

  function _class(id, el, fn, values) {
    var _this3;

    _classCallCheck(this, _class);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, id, el));
    _this3.value = fn();
    _this3.values = values;
    return _this3;
  }

  _createClass(_class, [{
    key: "update",
    value: function update(fn, values) {
      if (this.hasChanged(values)) {
        this.values = values;
        this.value = fn();
      }

      return this.value;
    }
  }, {
    key: "hasChanged",
    value: function hasChanged(values) {
      var _this4 = this;

      return values.some(function (value, i) {
        return _this4.values[i] !== value;
      });
    }
  }]);

  return _class;
}(Hook));
exports.useMemo = useMemo;

var useCallback = function useCallback(fn, inputs) {
  return useMemo(function () {
    return fn;
  }, inputs);
};

exports.useCallback = useCallback;

function setEffects(el, cb) {
  if (!(effectsSymbol in el)) {
    el[effectsSymbol] = [];
  }

  el[effectsSymbol].push(cb);
}

var useEffect = hook(
/*#__PURE__*/
function (_Hook2) {
  _inherits(_class2, _Hook2);

  function _class2(id, el) {
    var _this5;

    _classCallCheck(this, _class2);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(_class2).call(this, id, el));
    _this5.values = false;
    setEffects(el, _assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(_class2, [{
    key: "update",
    value: function update(callback, values) {
      this.callback = callback;
      this.lastValues = this.values;
      this.values = values;
    }
  }, {
    key: "call",
    value: function call() {
      if (this.values) {
        if (this.hasChanged()) {
          this.run();
        }
      } else {
        this.run();
      }
    }
  }, {
    key: "run",
    value: function run() {
      this.teardown();
      this._teardown = this.callback.call(this.el);
    }
  }, {
    key: "teardown",
    value: function teardown() {
      if (this._teardown) {
        this._teardown();
      }
    }
  }, {
    key: "hasChanged",
    value: function hasChanged() {
      var _this6 = this;

      return this.lastValues === false || this.values.some(function (value, i) {
        return _this6.lastValues[i] !== value;
      });
    }
  }]);

  return _class2;
}(Hook));
exports.useEffect = useEffect;
var useState = hook(
/*#__PURE__*/
function (_Hook3) {
  _inherits(_class3, _Hook3);

  function _class3(id, el, initialValue) {
    var _this7;

    _classCallCheck(this, _class3);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(_class3).call(this, id, el));
    _this7.updater = _this7.updater.bind(_assertThisInitialized(_this7));

    _this7.makeArgs(initialValue);

    return _this7;
  }

  _createClass(_class3, [{
    key: "update",
    value: function update() {
      return this.args;
    }
  }, {
    key: "updater",
    value: function updater(value) {
      if (typeof value === "function") {
        var updaterFn = value;

        var _this$args = _slicedToArray(this.args, 1),
            previousValue = _this$args[0];

        value = updaterFn(previousValue);
      }

      this.makeArgs(value);
      this.el.update();
    }
  }, {
    key: "makeArgs",
    value: function makeArgs(value) {
      this.args = Object.freeze([value, this.updater]);
    }
  }]);

  return _class3;
}(Hook));
exports.useState = useState;
var useReducer = hook(
/*#__PURE__*/
function (_Hook4) {
  _inherits(_class4, _Hook4);

  function _class4(id, el, _, initialState) {
    var _this8;

    _classCallCheck(this, _class4);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(_class4).call(this, id, el));
    _this8.dispatch = _this8.dispatch.bind(_assertThisInitialized(_this8));
    _this8.state = initialState;
    return _this8;
  }

  _createClass(_class4, [{
    key: "update",
    value: function update(reducer) {
      this.reducer = reducer;
      return [this.state, this.dispatch];
    }
  }, {
    key: "dispatch",
    value: function dispatch(action) {
      this.state = this.reducer(this.state, action);
      this.el.update();
    }
  }]);

  return _class4;
}(Hook));
exports.useReducer = useReducer;

var DirectiveContainer =
/*#__PURE__*/
function (_Container) {
  _inherits(DirectiveContainer, _Container);

  function DirectiveContainer(renderer, part) {
    var _this9;

    _classCallCheck(this, DirectiveContainer);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(DirectiveContainer).call(this, renderer, part));
    _this9.virtual = true;
    return _this9;
  }

  _createClass(DirectiveContainer, [{
    key: "commit",
    value: function commit(result) {
      this.host.setValue(result);
      this.host.commit();
    }
  }]);

  return DirectiveContainer;
}(Container);

var map = new WeakMap();

function withHooks(renderer) {
  function factory() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return function (part) {
      var cont = map.get(part);

      if (!cont) {
        cont = new DirectiveContainer(renderer, part);
        map.set(part, cont);
      }

      cont.args = args;
      cont.update();
    };
  }

  return (0, _litHtml.directive)(factory);
}

function setContexts(el, consumer) {
  if (!(contextSymbol in el)) {
    el[contextSymbol] = [];
  }

  el[contextSymbol].push(consumer);
}

var useContext = hook(
/*#__PURE__*/
function (_Hook5) {
  _inherits(_class5, _Hook5);

  function _class5(id, el) {
    var _this10;

    _classCallCheck(this, _class5);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(_class5).call(this, id, el));
    setContexts(el, _assertThisInitialized(_this10));
    _this10._updater = _this10._updater.bind(_assertThisInitialized(_this10));
    return _this10;
  }

  _createClass(_class5, [{
    key: "update",
    value: function update(Context) {
      if (this.el.virtual) {
        throw new Error('can\'t be used with virtual components');
      }

      if (this.Context !== Context) {
        this._subscribe(Context);

        this.Context = Context;
      }

      return this.value;
    }
  }, {
    key: "_updater",
    value: function _updater(value) {
      this.value = value;
      this.el.update();
    }
  }, {
    key: "_subscribe",
    value: function _subscribe(Context) {
      var detail = {
        Context: Context,
        callback: this._updater
      };
      this.el.host.dispatchEvent(new CustomEvent(contextEvent, {
        detail: detail,
        // carrier
        bubbles: true,
        // to bubble up in tree
        cancelable: true,
        // to be able to cancel
        composed: true // to pass ShadowDOM boundaries

      }));
      var unsubscribe = detail.unsubscribe,
          value = detail.value;
      this.value = unsubscribe ? value : Context.defaultValue;
      this._unsubscribe = unsubscribe;
    }
  }, {
    key: "teardown",
    value: function teardown() {
      if (this._unsubscribe) {
        this._unsubscribe();
      }
    }
  }]);

  return _class5;
}(Hook));
exports.useContext = useContext;

var createContext = function createContext(defaultValue) {
  var Context = {};

  Context.Provider =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(_class6, _HTMLElement);

    function _class6() {
      var _this11;

      _classCallCheck(this, _class6);

      _this11 = _possibleConstructorReturn(this, _getPrototypeOf(_class6).call(this));
      _this11.listeners = [];

      _this11.eventHandler = function (event) {
        var detail = event.detail;

        if (detail.Context === Context) {
          detail.value = _this11.value;

          detail.unsubscribe = function () {
            var index = _this11.listeners.indexOf(detail.callback);

            if (index > -1) {
              _this11.listeners.splice(index, 1);
            }
          };

          _this11.listeners.push(detail.callback);

          event.stopPropagation();
        }
      };

      _this11.addEventListener(contextEvent, _this11.eventHandler);

      return _this11;
    }

    _createClass(_class6, [{
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this.removeEventListener(contextEvent, this.eventHandler);
      }
    }, {
      key: "value",
      set: function set(value) {
        this._value = value;
        this.listeners.forEach(function (callback) {
          return callback(value);
        });
      },
      get: function get() {
        return this._value;
      }
    }]);

    return _class6;
  }(_wrapNativeSuper(HTMLElement));

  Context.Consumer = component(function (_ref) {
    var render$$1 = _ref.render;
    var context = useContext(Context);
    return render$$1(context);
  });
  Context.defaultValue = defaultValue;
  return Context;
};

exports.createContext = createContext;
},{"lit-html":"../../node_modules/lit-html/lit-html.js"}],"../router-test/router-test.scss":[function(require,module,exports) {

},{}],"../router-test/use-disconnected.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

exports.__esModule = true;

var haunted_w_microtask_1 = require("haunted-w-microtask");
/**
 * Purpose: Provided callback will be called when containerement is disconnected from DOM.
 *          Useful for doing cleanup.
 * Example Usage:
 * ```
 * useDisconnected(callback)
 * ```
 */


var useDisconnected = haunted_w_microtask_1.hook(
/** @class */
function (_super) {
  __extends(class_1, _super);

  function class_1(id, container, callback) {
    var _this = _super.call(this, id, container) || this;

    _this._callback = callback;
    return _this;
  }

  class_1.prototype.update = function () {};

  class_1.prototype.teardown = function () {
    this._callback();
  };

  return class_1;
}(haunted_w_microtask_1.Hook));
exports.useDisconnected = useDisconnected;
},{"haunted-w-microtask":"../../lib/haunted-builds/index-w-microtask.js"}],"../router-test/use-trigger-update.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

exports.__esModule = true;

var haunted_w_microtask_1 = require("haunted-w-microtask");
/**
 * Purpose: Returns a function that will queue the element for updating
 * Example Usage:
 * ```
 * const updateFn = useTriggerUpdate();
 * ```
 */


var useTriggerUpdate = haunted_w_microtask_1.hook(
/** @class */
function (_super) {
  __extends(class_1, _super);

  function class_1(id, container) {
    var _this = _super.call(this, id, container) || this;

    _this._container = container;
    return _this;
  }

  class_1.prototype.update = function () {
    return this._container.update.bind(this._container);
  };

  return class_1;
}(haunted_w_microtask_1.Hook));
exports.useTriggerUpdate = useTriggerUpdate;
},{"haunted-w-microtask":"../../lib/haunted-builds/index-w-microtask.js"}],"../../node_modules/router5/node_modules/symbol-observable/es/ponyfill.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = symbolObservablePonyfill;

function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      result = Symbol('observable');
      Symbol.observable = result;
    }
  } else {
    result = '@@observable';
  }

  return result;
}

;
},{}],"../../node_modules/router5/node_modules/symbol-observable/es/index.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ponyfill = _interopRequireDefault(require("./ponyfill.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */
var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill.default)(root);
var _default = result;
exports.default = _default;
},{"./ponyfill.js":"../../node_modules/router5/node_modules/symbol-observable/es/ponyfill.js"}],"../../node_modules/search-params/dist/cjs/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var makeOptions = function (opts) {
    if (opts === void 0) { opts = {}; }
    return ({
        arrayFormat: opts.arrayFormat || 'none',
        booleanFormat: opts.booleanFormat || 'none',
        nullFormat: opts.nullFormat || 'default'
    });
};
var encodeValue = function (value) { return encodeURIComponent(value); };
var decodeValue = function (value) { return decodeURIComponent(value); };
var encodeBoolean = function (name, value, opts) {
    if (opts.booleanFormat === 'empty-true' && value) {
        return name;
    }
    var encodedValue;
    if (opts.booleanFormat === 'unicode') {
        encodedValue = value ? '✓' : '✗';
    }
    else {
        encodedValue = value.toString();
    }
    return name + "=" + encodedValue;
};
var encodeNull = function (name, opts) {
    if (opts.nullFormat === 'hidden') {
        return '';
    }
    if (opts.nullFormat === 'string') {
        return name + "=null";
    }
    return name;
};
var getNameEncoder = function (opts) {
    if (opts.arrayFormat === 'index') {
        return function (name, index) { return name + "[" + index + "]"; };
    }
    if (opts.arrayFormat === 'brackets') {
        return function (name) { return name + "[]"; };
    }
    return function (name) { return name; };
};
var encodeArray = function (name, arr, opts) {
    var encodeName = getNameEncoder(opts);
    return arr
        .map(function (val, index) { return encodeName(name, index) + "=" + encodeValue(val); })
        .join('&');
};
var encode = function (name, value, opts) {
    if (value === null) {
        return encodeNull(name, opts);
    }
    if (typeof value === 'boolean') {
        return encodeBoolean(name, value, opts);
    }
    if (Array.isArray(value)) {
        return encodeArray(name, value, opts);
    }
    return name + "=" + encodeValue(value);
};
var decode = function (value, opts) {
    if (value === undefined) {
        return opts.booleanFormat === 'empty-true' ? true : null;
    }
    if (opts.booleanFormat === 'string') {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
    }
    else if (opts.booleanFormat === 'unicode') {
        if (decodeValue(value) === '✓') {
            return true;
        }
        if (decodeValue(value) === '✗') {
            return false;
        }
    }
    else if (opts.nullFormat === 'string') {
        if (value === 'null') {
            return null;
        }
    }
    return decodeValue(value);
};

var getSearch = function (path) {
    var pos = path.indexOf('?');
    if (pos === -1) {
        return path;
    }
    return path.slice(pos + 1);
};
var isSerialisable = function (val) { return val !== undefined; };
var parseName = function (name) {
    var bracketPosition = name.indexOf('[');
    var hasBrackets = bracketPosition !== -1;
    return {
        hasBrackets: hasBrackets,
        name: hasBrackets ? name.slice(0, bracketPosition) : name
    };
};

/**
 * Parse a querystring and return an object of parameters
 */
var parse = function (path, opts) {
    var options = makeOptions(opts);
    return getSearch(path)
        .split('&')
        .reduce(function (params, param) {
        var _a = param.split('='), rawName = _a[0], value = _a[1];
        var _b = parseName(rawName), hasBrackets = _b.hasBrackets, name = _b.name;
        var currentValue = params[name];
        var decodedValue = decode(value, options);
        if (currentValue === undefined) {
            params[name] = hasBrackets ? [decodedValue] : decodedValue;
        }
        else {
            params[name] = [].concat(currentValue, decodedValue);
        }
        return params;
    }, {});
};
/**
 * Build a querystring from an object of parameters
 */
var build = function (params, opts) {
    var options = makeOptions(opts);
    return Object.keys(params)
        .filter(function (paramName) { return isSerialisable(params[paramName]); })
        .map(function (paramName) { return encode(paramName, params[paramName], options); })
        .filter(Boolean)
        .join('&');
};
/**
 * Remove a list of parameters from a querystring
 */
var omit = function (path, paramsToOmit, opts) {
    var options = makeOptions(opts);
    var searchPart = getSearch(path);
    if (searchPart === '') {
        return {
            querystring: '',
            removedParams: {}
        };
    }
    var _a = path.split('&').reduce(function (_a, chunk) {
        var left = _a[0], right = _a[1];
        var rawName = chunk.split('=')[0];
        var name = parseName(rawName).name;
        return paramsToOmit.indexOf(name) === -1
            ? [left.concat(chunk), right]
            : [left, right.concat(chunk)];
    }, [[], []]), kept = _a[0], removed = _a[1];
    return {
        querystring: kept.join('&'),
        removedParams: parse(removed.join('&'), options)
    };
};
/**
 * Remove a list of parameters from a querystring
 */
var keep = function (path, paramsToKeep, opts) {
    var options = makeOptions(opts);
    var searchPart = getSearch(path);
    if (searchPart === '') {
        return {
            keptParams: {},
            querystring: ''
        };
    }
    var _a = path.split('&').reduce(function (_a, chunk) {
        var left = _a[0], right = _a[1];
        var rawName = chunk.split('=')[0];
        var name = parseName(rawName).name;
        return paramsToKeep.indexOf(name) >= 0
            ? [left.concat(chunk), right]
            : [left, right.concat(chunk)];
    }, [[], []]), kept = _a[0], removed = _a[1];
    return {
        keptParams: parse(kept.join('&'), options),
        querystring: kept.join('&')
    };
};

exports.parse = parse;
exports.build = build;
exports.omit = omit;
exports.keep = keep;

},{}],"../../node_modules/path-parser/dist/es/path-parser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Path = exports.default = void 0;

var _searchParams = require("search-params");

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var __assign = Object.assign || function __assign(t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];

    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
  }

  return t;
};

var defaultOrConstrained = function (match) {
  return '(' + (match ? match.replace(/(^<|>$)/g, '') : "[a-zA-Z0-9-_.~%':|=+\\*@]+") + ')';
};

var rules = [{
  name: 'url-parameter',
  pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
  regex: function (match) {
    return new RegExp(defaultOrConstrained(match[2]));
  }
}, {
  name: 'url-parameter-splat',
  pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
  regex: /([^?]*)/
}, {
  name: 'url-parameter-matrix',
  pattern: /^;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
  regex: function (match) {
    return new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]));
  }
}, {
  name: 'query-parameter',
  pattern: /^(?:\?|&)(?::)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
}, {
  name: 'delimiter',
  pattern: /^(\/|\?)/,
  regex: function (match) {
    return new RegExp('\\' + match[0]);
  }
}, {
  name: 'sub-delimiter',
  pattern: /^(!|&|-|_|\.|;)/,
  regex: function (match) {
    return new RegExp(match[0]);
  }
}, {
  name: 'fragment',
  pattern: /^([0-9a-zA-Z]+)/,
  regex: function (match) {
    return new RegExp(match[0]);
  }
}];

var tokenise = function (str, tokens) {
  if (tokens === void 0) {
    tokens = [];
  } // Look for a matching rule


  var matched = rules.some(function (rule) {
    var match = str.match(rule.pattern);

    if (!match) {
      return false;
    }

    tokens.push({
      type: rule.name,
      match: match[0],
      val: match.slice(1, 2),
      otherVal: match.slice(2),
      regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex
    });

    if (match[0].length < str.length) {
      tokens = tokenise(str.substr(match[0].length), tokens);
    }

    return true;
  }); // If no rules matched, throw an error (possible malformed path)

  if (!matched) {
    throw new Error("Could not parse path '" + str + "'");
  }

  return tokens;
};

var identity = function (_) {
  return _;
};

var exists = function (val) {
  return val !== undefined && val !== null;
};

var optTrailingSlash = function (source, strictTrailingSlash) {
  if (strictTrailingSlash) {
    return source;
  }

  if (source === '\\/') {
    return source;
  }

  return source.replace(/\\\/$/, '') + '(?:\\/)?';
};

var upToDelimiter = function (source, delimiter) {
  if (!delimiter) {
    return source;
  }

  return /(\/)$/.test(source) ? source : source + '(\\/|\\?|\\.|;|$)';
};

var appendQueryParam = function (params, param, val) {
  if (val === void 0) {
    val = '';
  }

  var existingVal = params[param];

  if (existingVal === undefined) {
    params[param] = val;
  } else {
    params[param] = Array.isArray(existingVal) ? existingVal.concat(val) : [existingVal, val];
  }

  return params;
};

var Path =
/** @class */
function () {
  function Path(path) {
    if (!path) {
      throw new Error('Missing path in Path constructor');
    }

    this.path = path;
    this.tokens = tokenise(path);
    this.hasUrlParams = this.tokens.filter(function (t) {
      return /^url-parameter/.test(t.type);
    }).length > 0;
    this.hasSpatParam = this.tokens.filter(function (t) {
      return /splat$/.test(t.type);
    }).length > 0;
    this.hasMatrixParams = this.tokens.filter(function (t) {
      return /matrix$/.test(t.type);
    }).length > 0;
    this.hasQueryParams = this.tokens.filter(function (t) {
      return /^query-parameter/.test(t.type);
    }).length > 0; // Extract named parameters from tokens

    this.spatParams = this.getParams('url-parameter-splat');
    this.urlParams = this.getParams(/^url-parameter/); // Query params

    this.queryParams = this.getParams('query-parameter'); // All params

    this.params = this.urlParams.concat(this.queryParams); // Check if hasQueryParams
    // Regular expressions for url part only (full and partial match)

    this.source = this.tokens.filter(function (t) {
      return t.regex !== undefined;
    }).map(function (r) {
      return r.regex.source;
    }).join('');
  }

  Path.createPath = function (path) {
    return new Path(path);
  };

  Path.prototype.isQueryParam = function (name) {
    return this.queryParams.indexOf(name) !== -1;
  };

  Path.prototype.test = function (path, opts) {
    var _this = this;

    var options = __assign({
      strictTrailingSlash: false,
      queryParams: {}
    }, opts); // trailingSlash: falsy => non optional, truthy => optional


    var source = optTrailingSlash(this.source, options.strictTrailingSlash); // Check if exact match

    var match = this.urlTest(path, source + (this.hasQueryParams ? '(\\?.*$|$)' : '$'), opts); // If no match, or no query params, no need to go further

    if (!match || !this.hasQueryParams) {
      return match;
    } // Extract query params


    var queryParams = (0, _searchParams.parse)(path, options.queryParams);
    var unexpectedQueryParams = Object.keys(queryParams).filter(function (p) {
      return !_this.isQueryParam(p);
    });

    if (unexpectedQueryParams.length === 0) {
      // Extend url match
      Object.keys(queryParams).forEach(function (p) {
        return match[p] = queryParams[p];
      });
      return match;
    }

    return null;
  };

  Path.prototype.partialTest = function (path, opts) {
    var _this = this;

    var options = __assign({
      delimited: true,
      queryParams: {}
    }, opts); // Check if partial match (start of given path matches regex)
    // trailingSlash: falsy => non optional, truthy => optional


    var source = upToDelimiter(this.source, options.delimited);
    var match = this.urlTest(path, source, options);

    if (!match) {
      return match;
    }

    if (!this.hasQueryParams) {
      return match;
    }

    var queryParams = (0, _searchParams.parse)(path, options.queryParams);
    Object.keys(queryParams).filter(function (p) {
      return _this.isQueryParam(p);
    }).forEach(function (p) {
      return appendQueryParam(match, p, queryParams[p]);
    });
    return match;
  };

  Path.prototype.build = function (params, opts) {
    var _this = this;

    if (params === void 0) {
      params = {};
    }

    var options = __assign({
      ignoreConstraints: false,
      ignoreSearch: false,
      queryParams: {}
    }, opts);

    var encodedUrlParams = Object.keys(params).filter(function (p) {
      return !_this.isQueryParam(p);
    }).reduce(function (acc, key) {
      if (!exists(params[key])) {
        return acc;
      }

      var val = params[key];
      var encode = _this.isQueryParam(key) ? identity : encodeURI;

      if (typeof val === 'boolean') {
        acc[key] = val;
      } else if (Array.isArray(val)) {
        acc[key] = val.map(encode);
      } else {
        acc[key] = encode(val);
      }

      return acc;
    }, {}); // Check all params are provided (not search parameters which are optional)

    if (this.urlParams.some(function (p) {
      return !exists(params[p]);
    })) {
      var missingParameters = this.urlParams.filter(function (p) {
        return !exists(params[p]);
      });
      throw new Error("Cannot build path: '" + this.path + "' requires missing parameters { " + missingParameters.join(', ') + ' }');
    } // Check constraints


    if (!options.ignoreConstraints) {
      var constraintsPassed = this.tokens.filter(function (t) {
        return /^url-parameter/.test(t.type) && !/-splat$/.test(t.type);
      }).every(function (t) {
        return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(encodedUrlParams[t.val]);
      });

      if (!constraintsPassed) {
        throw new Error("Some parameters of '" + this.path + "' are of invalid format");
      }
    }

    var base = this.tokens.filter(function (t) {
      return /^query-parameter/.test(t.type) === false;
    }).map(function (t) {
      if (t.type === 'url-parameter-matrix') {
        return ";" + t.val + "=" + encodedUrlParams[t.val[0]];
      }

      return /^url-parameter/.test(t.type) ? encodedUrlParams[t.val[0]] : t.match;
    }).join('');

    if (options.ignoreSearch) {
      return base;
    }

    var searchParams = this.queryParams.filter(function (p) {
      return Object.keys(params).indexOf(p) !== -1;
    }).reduce(function (sparams, paramName) {
      sparams[paramName] = params[paramName];
      return sparams;
    }, {});
    var searchPart = (0, _searchParams.build)(searchParams, options.queryParams);
    return searchPart ? base + '?' + searchPart : base;
  };

  Path.prototype.getParams = function (type) {
    var predicate = type instanceof RegExp ? function (t) {
      return type.test(t.type);
    } : function (t) {
      return t.type === type;
    };
    return this.tokens.filter(predicate).map(function (t) {
      return t.val[0];
    });
  };

  Path.prototype.urlTest = function (path, source, _a) {
    var _this = this;

    var _b = (_a === void 0 ? {} : _a).caseSensitive,
        caseSensitive = _b === void 0 ? false : _b;
    var regex = new RegExp('^' + source, caseSensitive ? '' : 'i');
    var match = path.match(regex);

    if (!match) {
      return null;
    } else if (!this.urlParams.length) {
      return {};
    } // Reduce named params to key-value pairs


    return match.slice(1, this.urlParams.length + 1).reduce(function (params, m, i) {
      params[_this.urlParams[i]] = decodeURIComponent(m);
      return params;
    }, {});
  };

  return Path;
}();

exports.Path = Path;
var _default = Path;
exports.default = _default;
},{"search-params":"../../node_modules/search-params/dist/cjs/index.js"}],"../../node_modules/route-node/dist/es/route-node.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _searchParams = require("search-params");

var _pathParser = require("path-parser");

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var __assign = Object.assign || function __assign(t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];

    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
  }

  return t;
};

var getMetaFromSegments = function (segments) {
  var accName = '';
  return segments.reduce(function (meta, segment) {
    var urlParams = segment.parser.urlParams.reduce(function (params, p) {
      params[p] = 'url';
      return params;
    }, {});
    var allParams = segment.parser.queryParams.reduce(function (params, p) {
      params[p] = 'query';
      return params;
    }, urlParams);

    if (segment.name !== undefined) {
      accName = accName ? accName + '.' + segment.name : segment.name;
      meta[accName] = allParams;
    }

    return meta;
  }, {});
};

var buildStateFromMatch = function (match) {
  if (!match || !match.segments || !match.segments.length) {
    return null;
  }

  var name = match.segments.map(function (segment) {
    return segment.name;
  }).filter(function (name) {
    return name;
  }).join('.');
  var params = match.params;
  return {
    name: name,
    params: params,
    meta: getMetaFromSegments(match.segments)
  };
};

var buildPathFromSegments = function (segments, params, options) {
  if (params === void 0) {
    params = {};
  }

  if (options === void 0) {
    options = {};
  }

  if (!segments) {
    return null;
  }

  var _a = options.queryParamsMode,
      queryParamsMode = _a === void 0 ? 'default' : _a,
      _b = options.trailingSlashMode;
  var searchParams = [];
  var nonSearchParams = [];

  for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
    var segment = segments_1[_i];
    var parser = segment.parser;
    searchParams.push.apply(searchParams, parser.queryParams);
    nonSearchParams.push.apply(nonSearchParams, parser.urlParams);
    nonSearchParams.push.apply(nonSearchParams, parser.spatParams);
  }

  if (queryParamsMode === 'loose') {
    var extraParams = Object.keys(params).reduce(function (acc, p) {
      return searchParams.indexOf(p) === -1 && nonSearchParams.indexOf(p) === -1 ? acc.concat(p) : acc;
    }, []);
    searchParams.push.apply(searchParams, extraParams);
  }

  var searchParamsObject = searchParams.reduce(function (acc, paramName) {
    if (Object.keys(params).indexOf(paramName) !== -1) {
      acc[paramName] = params[paramName];
    }

    return acc;
  }, {});
  var searchPart = (0, _searchParams.build)(searchParamsObject, options.queryParams);
  var path = segments.reduce(function (path, segment) {
    var segmentPath = segment.parser.build(params, {
      ignoreSearch: true,
      queryParams: options.queryParams
    });
    return segment.absolute ? segmentPath : path + segmentPath;
  }, '').replace(/\/\/{1,}/g, '/');
  var finalPath = path;

  if (options.trailingSlashMode === 'always') {
    finalPath = /\/$/.test(path) ? path : path + "/";
  } else if (options.trailingSlashMode === 'never' && path !== '/') {
    finalPath = /\/$/.test(path) ? path.slice(0, -1) : path;
  }

  return finalPath + (searchPart ? '?' + searchPart : '');
};

var getPathFromSegments = function (segments) {
  return segments ? segments.map(function (segment) {
    return segment.path;
  }).join('') : null;
};

var getPath = function (path) {
  return path.split('?')[0];
};

var getSearch = function (path) {
  return path.split('?')[1] || '';
};

var matchChildren = function (nodes, pathSegment, currentMatch, options, consumedBefore) {
  if (options === void 0) {
    options = {};
  }

  var _a = options.queryParamsMode,
      queryParamsMode = _a === void 0 ? 'default' : _a,
      _b = options.strictTrailingSlash,
      strictTrailingSlash = _b === void 0 ? false : _b,
      _c = options.strongMatching,
      strongMatching = _c === void 0 ? true : _c,
      _d = options.caseSensitive,
      caseSensitive = _d === void 0 ? false : _d;
  var isRoot = nodes.length === 1 && nodes[0].name === '';

  var _loop_1 = function (child) {
    // Partially match path
    var match;
    var remainingPath = void 0;
    var segment = pathSegment;

    if (consumedBefore === '/' && child.path === '/') {
      // when we encounter repeating slashes we add the slash
      // back to the URL to make it de facto pathless
      segment = '/' + pathSegment;
    }

    if (!child.children.length) {
      match = child.parser.test(segment, {
        caseSensitive: caseSensitive,
        strictTrailingSlash: strictTrailingSlash,
        queryParams: options.queryParams
      });
    }

    if (!match) {
      match = child.parser.partialTest(segment, {
        delimited: strongMatching,
        caseSensitive: caseSensitive,
        queryParams: options.queryParams
      });
    }

    if (match) {
      // Remove consumed segment from path
      var consumedPath = child.parser.build(match, {
        ignoreSearch: true
      });

      if (!strictTrailingSlash && !child.children.length) {
        consumedPath = consumedPath.replace(/\/$/, '');
      } // Can't create a regexp from the path because it might contain a
      // regexp character.


      if (segment.toLowerCase().indexOf(consumedPath.toLowerCase()) === 0) {
        remainingPath = segment.slice(consumedPath.length);
      } else {
        remainingPath = segment;
      }

      if (!strictTrailingSlash && !child.children.length) {
        remainingPath = remainingPath.replace(/^\/\?/, '?');
      }

      var querystring = (0, _searchParams.omit)(getSearch(segment.replace(consumedPath, '')), child.parser.queryParams, options.queryParams).querystring;
      remainingPath = getPath(remainingPath) + (querystring ? "?" + querystring : '');

      if (!strictTrailingSlash && !isRoot && remainingPath === '/' && !/\/$/.test(consumedPath)) {
        remainingPath = '';
      }

      currentMatch.segments.push(child);
      Object.keys(match).forEach(function (param) {
        return currentMatch.params[param] = match[param];
      });

      if (!isRoot && !remainingPath.length) {
        return {
          value: currentMatch
        };
      }

      if (!isRoot && queryParamsMode !== 'strict' && remainingPath.indexOf('?') === 0) {
        // unmatched queryParams in non strict mode
        var remainingQueryParams_1 = (0, _searchParams.parse)(remainingPath.slice(1), options.queryParams);
        Object.keys(remainingQueryParams_1).forEach(function (name) {
          return currentMatch.params[name] = remainingQueryParams_1[name];
        });
        return {
          value: currentMatch
        };
      } // Continue matching on non absolute children


      var children = child.getNonAbsoluteChildren(); // If no children to match against but unmatched path left

      if (!children.length) {
        return {
          value: null
        };
      }

      return {
        value: matchChildren(children, remainingPath, currentMatch, options, consumedPath)
      };
    }
  }; // for (child of node.children) {


  for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
    var child = nodes_1[_i];

    var state_1 = _loop_1(child);

    if (typeof state_1 === "object") return state_1.value;
  }

  return null;
};

function sortChildren(children) {
  var originalChildren = children.slice(0);
  return children.sort(sortPredicate(originalChildren));
}

var sortPredicate = function (originalChildren) {
  return function (left, right) {
    var leftPath = left.path.replace(/<.*?>/g, '').split('?')[0].replace(/(.+)\/$/, '$1');
    var rightPath = right.path.replace(/<.*?>/g, '').split('?')[0].replace(/(.+)\/$/, '$1'); // '/' last

    if (leftPath === '/') {
      return 1;
    }

    if (rightPath === '/') {
      return -1;
    } // Spat params last


    if (left.parser.hasSpatParam) {
      return 1;
    }

    if (right.parser.hasSpatParam) {
      return -1;
    } // No spat, number of segments (less segments last)


    var leftSegments = (leftPath.match(/\//g) || []).length;
    var rightSegments = (rightPath.match(/\//g) || []).length;

    if (leftSegments < rightSegments) {
      return 1;
    }

    if (leftSegments > rightSegments) {
      return -1;
    } // Same number of segments, number of URL params ascending


    var leftParamsCount = left.parser.urlParams.length;
    var rightParamsCount = right.parser.urlParams.length;

    if (leftParamsCount < rightParamsCount) {
      return -1;
    }

    if (leftParamsCount > rightParamsCount) {
      return 1;
    } // Same number of segments and params, last segment length descending


    var leftParamLength = (leftPath.split('/').slice(-1)[0] || '').length;
    var rightParamLength = (rightPath.split('/').slice(-1)[0] || '').length;

    if (leftParamLength < rightParamLength) {
      return 1;
    }

    if (leftParamLength > rightParamLength) {
      return -1;
    } // Same last segment length, preserve definition order. Note that we
    // cannot just return 0, as sort is not guaranteed to be a stable sort.


    return originalChildren.indexOf(left) - originalChildren.indexOf(right);
  };
};

var defaultBuildOptions = {
  queryParamsMode: 'default',
  trailingSlashMode: 'default'
};

var defaultMatchOptions = __assign({}, defaultBuildOptions, {
  strongMatching: true
});

var RouteNode =
/** @class */
function () {
  function RouteNode(name, path, childRoutes, cb, parent, finalSort, sort) {
    if (name === void 0) {
      name = '';
    }

    if (path === void 0) {
      path = '';
    }

    if (childRoutes === void 0) {
      childRoutes = [];
    }

    if (finalSort === void 0) {
      finalSort = true;
    }

    this.name = name;
    this.absolute = /^~/.test(path);
    this.path = this.absolute ? path.slice(1) : path;
    this.parser = this.path ? new _pathParser.Path(this.path) : null;
    this.children = [];
    this.parent = parent;
    this.checkParents();
    this.add(childRoutes, cb, finalSort ? false : sort !== false);

    if (finalSort) {
      this.sortDescendants();
    }

    return this;
  }

  RouteNode.prototype.getParentSegments = function (segments) {
    if (segments === void 0) {
      segments = [];
    }

    return this.parent && this.parent.parser ? this.parent.getParentSegments(segments.concat(this.parent)) : segments.reverse();
  };

  RouteNode.prototype.setParent = function (parent) {
    this.parent = parent;
    this.checkParents();
  };

  RouteNode.prototype.setPath = function (path) {
    if (path === void 0) {
      path = '';
    }

    this.path = path;
    this.parser = path ? new _pathParser.Path(path) : null;
  };

  RouteNode.prototype.add = function (route, cb, sort) {
    var _this = this;

    if (sort === void 0) {
      sort = true;
    }

    if (route === undefined || route === null) {
      return;
    }

    if (route instanceof Array) {
      route.forEach(function (r) {
        return _this.add(r, cb, sort);
      });
      return;
    }

    if (!(route instanceof RouteNode) && !(route instanceof Object)) {
      throw new Error('RouteNode.add() expects routes to be an Object or an instance of RouteNode.');
    } else if (route instanceof RouteNode) {
      route.setParent(this);
      this.addRouteNode(route, sort);
    } else {
      if (!route.name || !route.path) {
        throw new Error('RouteNode.add() expects routes to have a name and a path defined.');
      }

      var routeNode = new RouteNode(route.name, route.path, route.children, cb, this, false, sort);
      var fullName = routeNode.getParentSegments([routeNode]).map(function (_) {
        return _.name;
      }).join('.');

      if (cb) {
        cb(__assign({}, route, {
          name: fullName
        }));
      }

      this.addRouteNode(routeNode, sort);
    }

    return this;
  };

  RouteNode.prototype.addNode = function (name, path) {
    this.add(new RouteNode(name, path));
    return this;
  };

  RouteNode.prototype.getPath = function (routeName) {
    return getPathFromSegments(this.getSegmentsByName(routeName));
  };

  RouteNode.prototype.getNonAbsoluteChildren = function () {
    return this.children.filter(function (child) {
      return !child.absolute;
    });
  };

  RouteNode.prototype.sortChildren = function () {
    if (this.children.length) {
      sortChildren(this.children);
    }
  };

  RouteNode.prototype.sortDescendants = function () {
    this.sortChildren();
    this.children.forEach(function (child) {
      return child.sortDescendants();
    });
  };

  RouteNode.prototype.buildPath = function (routeName, params, options) {
    if (params === void 0) {
      params = {};
    }

    if (options === void 0) {
      options = {};
    }

    var path = buildPathFromSegments(this.getSegmentsByName(routeName), params, options);
    return path;
  };

  RouteNode.prototype.buildState = function (name, params) {
    if (params === void 0) {
      params = {};
    }

    var segments = this.getSegmentsByName(name);

    if (!segments || !segments.length) {
      return null;
    }

    return {
      name: name,
      params: params,
      meta: getMetaFromSegments(segments)
    };
  };

  RouteNode.prototype.matchPath = function (path, options) {
    if (options === void 0) {
      options = {};
    }

    if (path === '' && !options.strictTrailingSlash) {
      path = '/';
    }

    var match = this.getSegmentsMatchingPath(path, options);

    if (match) {
      var matchedSegments = match.segments;

      if (matchedSegments[0].absolute) {
        var firstSegmentParams = matchedSegments[0].getParentSegments();
        matchedSegments.reverse();
        matchedSegments.push.apply(matchedSegments, firstSegmentParams);
        matchedSegments.reverse();
      }

      var lastSegment = matchedSegments[matchedSegments.length - 1];
      var lastSegmentSlashChild = lastSegment.findSlashChild();

      if (lastSegmentSlashChild) {
        matchedSegments.push(lastSegmentSlashChild);
      }
    }

    return buildStateFromMatch(match);
  };

  RouteNode.prototype.addRouteNode = function (route, sort) {
    if (sort === void 0) {
      sort = true;
    }

    var names = route.name.split('.');

    if (names.length === 1) {
      // Check duplicated routes
      if (this.children.map(function (child) {
        return child.name;
      }).indexOf(route.name) !== -1) {
        throw new Error("Alias \"" + route.name + "\" is already defined in route node");
      } // Check duplicated paths


      if (this.children.map(function (child) {
        return child.path;
      }).indexOf(route.path) !== -1) {
        throw new Error("Path \"" + route.path + "\" is already defined in route node");
      }

      this.children.push(route);

      if (sort) {
        this.sortChildren();
      }
    } else {
      // Locate parent node
      var segments = this.getSegmentsByName(names.slice(0, -1).join('.'));

      if (segments) {
        route.name = names[names.length - 1];
        segments[segments.length - 1].add(route);
      } else {
        throw new Error("Could not add route named '" + route.name + "', parent is missing.");
      }
    }

    return this;
  };

  RouteNode.prototype.checkParents = function () {
    if (this.absolute && this.hasParentsParams()) {
      throw new Error('[RouteNode] A RouteNode with an abolute path cannot have parents with route parameters');
    }
  };

  RouteNode.prototype.hasParentsParams = function () {
    if (this.parent && this.parent.parser) {
      var parser = this.parent.parser;
      var hasParams = parser.hasUrlParams || parser.hasSpatParam || parser.hasMatrixParams || parser.hasQueryParams;
      return hasParams || this.parent.hasParentsParams();
    }

    return false;
  };

  RouteNode.prototype.findAbsoluteChildren = function () {
    return this.children.reduce(function (absoluteChildren, child) {
      return absoluteChildren.concat(child.absolute ? child : []).concat(child.findAbsoluteChildren());
    }, []);
  };

  RouteNode.prototype.findSlashChild = function () {
    var slashChildren = this.getNonAbsoluteChildren().filter(function (child) {
      return child.parser && /^\/(\?|$)/.test(child.parser.path);
    });
    return slashChildren[0];
  };

  RouteNode.prototype.getSegmentsByName = function (routeName) {
    var findSegmentByName = function (name, routes) {
      var filteredRoutes = routes.filter(function (r) {
        return r.name === name;
      });
      return filteredRoutes.length ? filteredRoutes[0] : undefined;
    };

    var segments = [];
    var routes = this.parser ? [this] : this.children;
    var names = (this.parser ? [''] : []).concat(routeName.split('.'));
    var matched = names.every(function (name) {
      var segment = findSegmentByName(name, routes);

      if (segment) {
        routes = segment.children;
        segments.push(segment);
        return true;
      }

      return false;
    });
    return matched ? segments : null;
  };

  RouteNode.prototype.getSegmentsMatchingPath = function (path, options) {
    var topLevelNodes = this.parser ? [this] : this.children;
    var startingNodes = topLevelNodes.reduce(function (nodes, node) {
      return nodes.concat(node, node.findAbsoluteChildren());
    }, []);
    var currentMatch = {
      segments: [],
      params: {}
    };
    var finalMatch = matchChildren(startingNodes, path, currentMatch, options);

    if (finalMatch && finalMatch.segments.length === 1 && finalMatch.segments[0].name === '') {
      return null;
    }

    return finalMatch;
  };

  return RouteNode;
}();

var _default = RouteNode;
exports.default = _default;
},{"search-params":"../../node_modules/search-params/dist/cjs/index.js","path-parser":"../../node_modules/path-parser/dist/es/path-parser.js"}],"../../node_modules/router5-transition-path/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldUpdateNode = shouldUpdateNode;
exports.nameToIDs = exports.default = void 0;

var nameToIDs = function (name) {
  return name.split('.').reduce(function (ids, name) {
    return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
  }, []);
};

exports.nameToIDs = nameToIDs;

var exists = function (val) {
  return val !== undefined && val !== null;
};

var hasMetaParams = function (state) {
  return state && state.meta && state.meta.params;
};

var extractSegmentParams = function (name, state) {
  if (!hasMetaParams(state) || !exists(state.meta.params[name])) return {};
  return Object.keys(state.meta.params[name]).reduce(function (params, p) {
    params[p] = state.params[p];
    return params;
  }, {});
};

function transitionPath(toState, fromState) {
  var toStateOptions = toState.meta && toState.meta && toState.meta.options || {};
  var fromStateIds = fromState ? nameToIDs(fromState.name) : [];
  var toStateIds = nameToIDs(toState.name);
  var maxI = Math.min(fromStateIds.length, toStateIds.length);

  function pointOfDifference() {
    var i;

    var _loop_1 = function () {
      var left = fromStateIds[i];
      var right = toStateIds[i];
      if (left !== right) return {
        value: i
      };
      var leftParams = extractSegmentParams(left, toState);
      var rightParams = extractSegmentParams(right, fromState);
      if (Object.keys(leftParams).length !== Object.keys(rightParams).length) return {
        value: i
      };
      if (Object.keys(leftParams).length === 0) return "continue";
      var different = Object.keys(leftParams).some(function (p) {
        return rightParams[p] !== leftParams[p];
      });

      if (different) {
        return {
          value: i
        };
      }
    };

    for (i = 0; i < maxI; i += 1) {
      var state_1 = _loop_1();

      if (typeof state_1 === "object") return state_1.value;
    }

    return i;
  }

  var i;

  if (!fromState || toStateOptions.reload) {
    i = 0;
  } else if (!hasMetaParams(fromState) && !hasMetaParams(toState)) {
    i = 0;
  } else {
    i = pointOfDifference();
  }

  var toDeactivate = fromStateIds.slice(i).reverse();
  var toActivate = toStateIds.slice(i);
  var intersection = fromState && i > 0 ? fromStateIds[i - 1] : '';
  return {
    intersection: intersection,
    toDeactivate: toDeactivate,
    toActivate: toActivate
  };
}

function shouldUpdateNode(nodeName) {
  return function (toState, fromSate) {
    var _a = transitionPath(toState, fromSate),
        intersection = _a.intersection,
        toActivate = _a.toActivate,
        toDeactivateReversed = _a.toDeactivate;

    var toDeactivate = toDeactivateReversed.slice().reverse();

    if (toState.meta.options && toState.meta.options.reload) {
      return true;
    }

    if (nodeName === intersection) {
      return true;
    }

    if (toActivate.indexOf(nodeName) === -1) {
      return false;
    }

    var matching = true;

    for (var i = 0; i < toActivate.length; i += 1) {
      var activatedSegment = toActivate[i];
      var sameLevelDeactivatedSegment = toDeactivate[i];
      matching = activatedSegment === sameLevelDeactivatedSegment;

      if (matching && activatedSegment === nodeName) {
        return true;
      }

      if (!matching) {
        return false;
      }
    }

    return false;
  };
}

var _default = transitionPath;
exports.default = _default;
},{}],"../../node_modules/router5/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneRouter = cloneRouter;
Object.defineProperty(exports, "RouteNode", {
  enumerable: true,
  get: function () {
    return _routeNode.default;
  }
});
Object.defineProperty(exports, "transitionPath", {
  enumerable: true,
  get: function () {
    return _router5TransitionPath.default;
  }
});
exports.errorCodes = exports.constants = exports.createRouter = exports.default = void 0;

var _symbolObservable = _interopRequireDefault(require("symbol-observable"));

var _routeNode = _interopRequireDefault(require("route-node"));

var _router5TransitionPath = _interopRequireWildcard(require("router5-transition-path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var defaultOptions = {
  trailingSlashMode: 'default',
  queryParamsMode: 'default',
  strictTrailingSlash: false,
  autoCleanUp: true,
  allowNotFound: false,
  strongMatching: true,
  rewritePathOnMatch: true,
  caseSensitive: false
};

function withOptions(options) {
  return function (router) {
    var routerOptions = __assign({}, defaultOptions, options);

    router.getOptions = function () {
      return routerOptions;
    };

    router.setOption = function (option, value) {
      routerOptions[option] = value;
      return router;
    };

    return router;
  };
}

var errorCodes = {
  ROUTER_NOT_STARTED: 'NOT_STARTED',
  NO_START_PATH_OR_STATE: 'NO_START_PATH_OR_STATE',
  ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  SAME_STATES: 'SAME_STATES',
  CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
  CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
  TRANSITION_ERR: 'TRANSITION_ERR',
  TRANSITION_CANCELLED: 'CANCELLED'
};
exports.errorCodes = errorCodes;
var constants = {
  UNKNOWN_ROUTE: '@@router5/UNKNOWN_ROUTE',
  ROUTER_START: '$start',
  ROUTER_STOP: '$stop',
  TRANSITION_START: '$$start',
  TRANSITION_CANCEL: '$$cancel',
  TRANSITION_SUCCESS: '$$success',
  TRANSITION_ERROR: '$$error'
};
exports.constants = constants;

function withRoutes(routes) {
  return function (router) {
    router.forward = function (fromRoute, toRoute) {
      router.config.forwardMap[fromRoute] = toRoute;
      return router;
    };

    var rootNode = routes instanceof _routeNode.default ? routes : new _routeNode.default('', '', routes, onRouteAdded);

    function onRouteAdded(route) {
      if (route.canActivate) router.canActivate(route.name, route.canActivate);
      if (route.forwardTo) router.forward(route.name, route.forwardTo);
      if (route.decodeParams) router.config.decoders[route.name] = route.decodeParams;
      if (route.encodeParams) router.config.encoders[route.name] = route.encodeParams;
      if (route.defaultParams) router.config.defaultParams[route.name] = route.defaultParams;
    }

    router.rootNode = rootNode;

    router.add = function (routes, finalSort) {
      rootNode.add(routes, onRouteAdded, !finalSort);

      if (finalSort) {
        rootNode.sortDescendants();
      }

      return router;
    };

    router.addNode = function (name, path, canActivateHandler) {
      rootNode.addNode(name, path);
      if (canActivateHandler) router.canActivate(name, canActivateHandler);
      return router;
    };

    router.isActive = function (name, params, strictEquality, ignoreQueryParams) {
      if (params === void 0) {
        params = {};
      }

      if (strictEquality === void 0) {
        strictEquality = false;
      }

      if (ignoreQueryParams === void 0) {
        ignoreQueryParams = true;
      }

      var activeState = router.getState();
      if (!activeState) return false;

      if (strictEquality || activeState.name === name) {
        return router.areStatesEqual(router.makeState(name, params), activeState, ignoreQueryParams);
      }

      return router.areStatesDescendants(router.makeState(name, params), activeState);
    };

    router.buildPath = function (route, params) {
      if (route === constants.UNKNOWN_ROUTE) {
        return params.path;
      }

      var paramsWithDefault = __assign({}, router.config.defaultParams[route], params);

      var _a = router.getOptions(),
          trailingSlashMode = _a.trailingSlashMode,
          queryParamsMode = _a.queryParamsMode,
          queryParams = _a.queryParams;

      var encodedParams = router.config.encoders[route] ? router.config.encoders[route](paramsWithDefault) : paramsWithDefault;
      return router.rootNode.buildPath(route, encodedParams, {
        trailingSlashMode: trailingSlashMode,
        queryParamsMode: queryParamsMode,
        queryParams: queryParams
      });
    };

    router.matchPath = function (path, source) {
      var options = router.getOptions();
      var match = router.rootNode.matchPath(path, options);

      if (match) {
        var name_1 = match.name,
            params = match.params,
            meta = match.meta;
        var decodedParams = router.config.decoders[name_1] ? router.config.decoders[name_1](params) : params;

        var _a = router.forwardState(name_1, decodedParams),
            routeName = _a.name,
            routeParams = _a.params;

        var builtPath = options.rewritePathOnMatch === false ? path : router.buildPath(routeName, routeParams);
        return router.makeState(routeName, routeParams, builtPath, {
          params: meta,
          source: source
        });
      }

      return null;
    };

    router.setRootPath = function (rootPath) {
      router.rootNode.setPath(rootPath);
    };

    return router;
  };
}

function withDependencies(dependencies) {
  return function (router) {
    var routerDependencies = dependencies;

    router.setDependency = function (dependencyName, dependency) {
      routerDependencies[dependencyName] = dependency;
      return router;
    };

    router.setDependencies = function (deps) {
      Object.keys(deps).forEach(function (name) {
        return router.setDependency(name, deps[name]);
      });
      return router;
    };

    router.getDependencies = function () {
      return routerDependencies;
    };

    router.getInjectables = function () {
      return [router, router.getDependencies()];
    };

    router.executeFactory = function (factoryFunction) {
      return factoryFunction.apply(void 0, router.getInjectables());
    };

    return router;
  };
}

function withState(router) {
  var stateId = 0;
  var routerState = null;

  router.getState = function () {
    return routerState;
  };

  router.setState = function (state) {
    routerState = state;
  };

  router.makeState = function (name, params, path, meta, forceId) {
    return {
      name: name,
      params: __assign({}, router.config.defaultParams[name], params),
      path: path,
      meta: meta ? __assign({}, meta, {
        id: forceId === undefined ? ++stateId : forceId
      }) : undefined
    };
  };

  router.makeNotFoundState = function (path, options) {
    return router.makeState(constants.UNKNOWN_ROUTE, {
      path: path
    }, path, {
      options: options
    });
  };

  router.areStatesEqual = function (state1, state2, ignoreQueryParams) {
    if (ignoreQueryParams === void 0) {
      ignoreQueryParams = true;
    }

    if (state1.name !== state2.name) return false;

    var getUrlParams = function (name) {
      return router.rootNode //@ts-ignore
      .getSegmentsByName(name).map(function (segment) {
        return segment.parser['urlParams'];
      }).reduce(function (params, p) {
        return params.concat(p);
      }, []);
    };

    var state1Params = ignoreQueryParams ? getUrlParams(state1.name) : Object.keys(state1.params);
    var state2Params = ignoreQueryParams ? getUrlParams(state2.name) : Object.keys(state2.params);
    return state1Params.length === state2Params.length && state1Params.every(function (p) {
      return state1.params[p] === state2.params[p];
    });
  };

  router.areStatesDescendants = function (parentState, childState) {
    var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
    if (!regex.test(childState.name)) return false; // If child state name extends parent state name, and all parent state params
    // are in child state params.

    return Object.keys(parentState.params).every(function (p) {
      return parentState.params[p] === childState.params[p];
    });
  };

  router.forwardState = function (routeName, routeParams) {
    var name = router.config.forwardMap[routeName] || routeName;

    var params = __assign({}, router.config.defaultParams[routeName], router.config.defaultParams[name], routeParams);

    return {
      name: name,
      params: params
    };
  };

  router.buildState = function (routeName, routeParams) {
    var _a = router.forwardState(routeName, routeParams),
        name = _a.name,
        params = _a.params;

    return router.rootNode.buildState(name, params);
  };

  return router;
}

var eventsMap = {
  onStart: constants.ROUTER_START,
  onStop: constants.ROUTER_STOP,
  onTransitionSuccess: constants.TRANSITION_SUCCESS,
  onTransitionStart: constants.TRANSITION_START,
  onTransitionError: constants.TRANSITION_ERROR,
  onTransitionCancel: constants.TRANSITION_CANCEL
};

function withPlugins(router) {
  var routerPlugins = [];

  router.getPlugins = function () {
    return routerPlugins;
  };

  router.usePlugin = function () {
    var plugins = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      plugins[_i] = arguments[_i];
    }

    var removePluginFns = plugins.map(function (plugin) {
      routerPlugins.push(plugin);
      return startPlugin(plugin);
    });
    return function () {
      routerPlugins = routerPlugins.filter(function (plugin) {
        return plugins.indexOf(plugin) === -1;
      });
      removePluginFns.forEach(function (removePlugin) {
        return removePlugin();
      });
    };
  };

  function startPlugin(plugin) {
    var appliedPlugin = router.executeFactory(plugin);
    var removeEventListeners = Object.keys(eventsMap).map(function (methodName) {
      if (appliedPlugin[methodName]) {
        return router.addEventListener(eventsMap[methodName], appliedPlugin[methodName]);
      }
    }).filter(Boolean);
    return function () {
      removeEventListeners.forEach(function (removeListener) {
        return removeListener();
      });

      if (appliedPlugin.teardown) {
        appliedPlugin.teardown();
      }
    };
  }

  return router;
}

function withMiddleware(router) {
  var middlewareFactories = [];
  var middlewareFunctions = [];

  router.useMiddleware = function () {
    var middlewares = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      middlewares[_i] = arguments[_i];
    }

    var removePluginFns = middlewares.map(function (middleware) {
      var middlewareFunction = router.executeFactory(middleware);
      middlewareFactories.push(middleware);
      middlewareFunctions.push(middlewareFunction);
      return function () {
        middlewareFactories = middlewareFactories.filter(function (m) {
          return m !== middleware;
        });
        middlewareFunctions = middlewareFunctions.filter(function (m) {
          return m !== middlewareFunction;
        });
      };
    });
    return function () {
      return removePluginFns.forEach(function (fn) {
        return fn();
      });
    };
  };

  router.clearMiddleware = function () {
    middlewareFactories = [];
    middlewareFunctions = [];
    return router;
  };

  router.getMiddlewareFactories = function () {
    return middlewareFactories;
  };

  router.getMiddlewareFunctions = function () {
    return middlewareFunctions;
  };

  return router;
}

function withObservability(router) {
  var callbacks = {};

  router.invokeEventListeners = function (eventName) {
    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    (callbacks[eventName] || []).forEach(function (cb) {
      return cb.apply(void 0, args);
    });
  };

  router.removeEventListener = function (eventName, cb) {
    callbacks[eventName] = callbacks[eventName].filter(function (_cb) {
      return _cb !== cb;
    });
  };

  router.addEventListener = function (eventName, cb) {
    callbacks[eventName] = (callbacks[eventName] || []).concat(cb);
    return function () {
      return router.removeEventListener(eventName, cb);
    };
  };

  function subscribe(listener) {
    var isObject = typeof listener === 'object';
    var finalListener = isObject ? listener.next.bind(listener) : listener;
    var unsubscribeHandler = router.addEventListener(constants.TRANSITION_SUCCESS, function (toState, fromState) {
      finalListener({
        route: toState,
        previousRoute: fromState
      });
    });
    return isObject ? {
      unsubscribe: unsubscribeHandler
    } : unsubscribeHandler;
  }

  function observable() {
    var _a;

    return _a = {
      subscribe: function (observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        return subscribe(observer);
      }
    }, _a[_symbolObservable.default] = function () {
      return this;
    }, _a;
  }

  router.subscribe = subscribe; //@ts-ignore

  router[_symbolObservable.default] = observable; //@ts-ignore

  router['@@observable'] = observable;
  return router;
}

function resolve(functions, _a, callback) {
  var isCancelled = _a.isCancelled,
      toState = _a.toState,
      fromState = _a.fromState,
      _b = _a.errorKey,
      errorKey = _b === void 0 ? undefined : _b;
  var remainingFunctions = Array.isArray(functions) ? functions : Object.keys(functions);

  var isState = function (obj) {
    return typeof obj === 'object' && obj.name !== undefined && obj.params !== undefined && obj.path !== undefined;
  };

  var hasStateChanged = function (toState, fromState) {
    return fromState.name !== toState.name || fromState.params !== toState.params || fromState.path !== toState.path;
  };

  var mergeStates = function (toState, fromState) {
    return __assign({}, fromState, toState, {
      meta: __assign({}, fromState.meta, toState.meta)
    });
  };

  var processFn = function (stepFn, errBase, state, _done) {
    var done = function (err, newState) {
      if (err) {
        _done(err);
      } else if (newState && newState !== state && isState(newState)) {
        if (hasStateChanged(newState, state)) {
          console.error('[router5][transition] Warning: state values (name, params, path) were changed during transition process.');
        }

        _done(null, mergeStates(newState, state));
      } else {
        _done(null, state);
      }
    };

    var res = stepFn.call(null, state, fromState, done);

    if (isCancelled()) {
      done(null);
    } else if (typeof res === 'boolean') {
      done(res ? null : errBase);
    } else if (isState(res)) {
      done(null, res);
    } else if (res && typeof res.then === 'function') {
      res.then(function (resVal) {
        if (resVal instanceof Error) done({
          error: resVal
        }, null);else done(null, resVal);
      }, function (err) {
        if (err instanceof Error) {
          console.error(err.stack || err);
          done(__assign({}, errBase, {
            promiseError: err
          }), null);
        } else {
          done(typeof err === 'object' ? __assign({}, errBase, err) : errBase, null);
        }
      });
    } // else: wait for done to be called

  };

  var next = function (err, state) {
    var _a;

    if (isCancelled()) {
      callback();
    } else if (err) {
      callback(err);
    } else {
      if (!remainingFunctions.length) {
        callback(null, state);
      } else {
        var isMapped = typeof remainingFunctions[0] === 'string';
        var errBase = errorKey && isMapped ? (_a = {}, _a[errorKey] = remainingFunctions[0], _a) : {};
        var stepFn = isMapped ? functions[remainingFunctions[0]] : remainingFunctions[0];
        remainingFunctions = remainingFunctions.slice(1);
        processFn(stepFn, errBase, state, next);
      }
    }
  };

  next(null, toState);
}

function transition(router, toState, fromState, opts, callback) {
  var cancelled = false;
  var completed = false;
  var options = router.getOptions();

  var _a = router.getLifecycleFunctions(),
      canDeactivateFunctions = _a[0],
      canActivateFunctions = _a[1];

  var middlewareFunctions = router.getMiddlewareFunctions();

  var isCancelled = function () {
    return cancelled;
  };

  var cancel = function () {
    if (!cancelled && !completed) {
      cancelled = true;
      callback({
        code: errorCodes.TRANSITION_CANCELLED
      }, null);
    }
  };

  var done = function (err, state) {
    completed = true;

    if (isCancelled()) {
      return;
    }

    if (!err && options.autoCleanUp) {
      var activeSegments_1 = (0, _router5TransitionPath.nameToIDs)(toState.name);
      Object.keys(canDeactivateFunctions).forEach(function (name) {
        if (activeSegments_1.indexOf(name) === -1) router.clearCanDeactivate(name);
      });
    }

    callback(err, state || toState);
  };

  var makeError = function (base, err) {
    return __assign({}, base, err instanceof Object ? err : {
      error: err
    });
  };

  var isUnknownRoute = toState.name === constants.UNKNOWN_ROUTE;
  var asyncBase = {
    isCancelled: isCancelled,
    toState: toState,
    fromState: fromState
  };

  var _b = (0, _router5TransitionPath.default)(toState, fromState),
      toDeactivate = _b.toDeactivate,
      toActivate = _b.toActivate;

  var canDeactivate = !fromState || opts.forceDeactivate ? [] : function (toState, fromState, cb) {
    var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
      return canDeactivateFunctions[name];
    }).reduce(function (fnMap, name) {
      var _a;

      return __assign({}, fnMap, (_a = {}, _a[name] = canDeactivateFunctions[name], _a));
    }, {});
    resolve(canDeactivateFunctionMap, __assign({}, asyncBase, {
      errorKey: 'segment'
    }), function (err) {
      return cb(err ? makeError({
        code: errorCodes.CANNOT_DEACTIVATE
      }, err) : null);
    });
  };
  var canActivate = isUnknownRoute ? [] : function (toState, fromState, cb) {
    var canActivateFunctionMap = toActivate.filter(function (name) {
      return canActivateFunctions[name];
    }).reduce(function (fnMap, name) {
      var _a;

      return __assign({}, fnMap, (_a = {}, _a[name] = canActivateFunctions[name], _a));
    }, {});
    resolve(canActivateFunctionMap, __assign({}, asyncBase, {
      errorKey: 'segment'
    }), function (err) {
      return cb(err ? makeError({
        code: errorCodes.CANNOT_ACTIVATE
      }, err) : null);
    });
  };
  var middleware = !middlewareFunctions.length ? [] : function (toState, fromState, cb) {
    return resolve(middlewareFunctions, __assign({}, asyncBase), function (err, state) {
      return cb(err ? makeError({
        code: errorCodes.TRANSITION_ERR
      }, err) : null, state || toState);
    });
  };
  var pipeline = [].concat(canDeactivate).concat(canActivate).concat(middleware);
  resolve(pipeline, asyncBase, done);
  return cancel;
}

var noop = function (err, state) {};

function withNavigation(router) {
  var cancelCurrentTransition;
  router.navigate = navigate;
  router.navigate = navigate;

  router.navigateToDefault = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var opts = typeof args[0] === 'object' ? args[0] : {};
    var done = args.length === 2 ? args[1] : typeof args[0] === 'function' ? args[0] : noop;
    var options = router.getOptions();

    if (options.defaultRoute) {
      return navigate(options.defaultRoute, options.defaultParams, opts, done);
    }

    return function () {};
  };

  router.cancel = function () {
    if (cancelCurrentTransition) {
      cancelCurrentTransition('navigate');
      cancelCurrentTransition = null;
    }

    return router;
  };

  function navigate() {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var name = args[0];
    var lastArg = args[args.length - 1];
    var done = typeof lastArg === 'function' ? lastArg : noop;
    var params = typeof args[1] === 'object' ? args[1] : {};
    var opts = typeof args[2] === 'object' ? args[2] : {};

    if (!router.isStarted()) {
      done({
        code: errorCodes.ROUTER_NOT_STARTED
      });
      return;
    }

    var route = router.buildState(name, params);

    if (!route) {
      var err = {
        code: errorCodes.ROUTE_NOT_FOUND
      };
      done(err);
      router.invokeEventListeners(constants.TRANSITION_ERROR, null, router.getState(), err);
      return;
    }

    var toState = router.makeState(route.name, route.params, router.buildPath(route.name, route.params), {
      params: route.meta,
      options: opts
    });
    var sameStates = router.getState() ? router.areStatesEqual(router.getState(), toState, false) : false; // Do not proceed further if states are the same and no reload
    // (no deactivation and no callbacks)

    if (sameStates && !opts.reload && !opts.force) {
      var err = {
        code: errorCodes.SAME_STATES
      };
      done(err);
      router.invokeEventListeners(constants.TRANSITION_ERROR, toState, router.getState(), err);
      return;
    }

    var fromState = router.getState();

    if (opts.skipTransition) {
      done(null, toState);
      return noop;
    } // Transition


    return router.transitionToState(toState, fromState, opts, function (err, state) {
      if (err) {
        if (err.redirect) {
          var _a = err.redirect,
              name_1 = _a.name,
              params_1 = _a.params;
          navigate(name_1, params_1, __assign({}, opts, {
            force: true,
            redirected: true
          }), done);
        } else {
          done(err);
        }
      } else {
        router.invokeEventListeners(constants.TRANSITION_SUCCESS, state, fromState, opts);
        done(null, state);
      }
    });
  }

  router.transitionToState = function (toState, fromState, options, done) {
    if (options === void 0) {
      options = {};
    }

    if (done === void 0) {
      done = noop;
    }

    router.cancel();
    router.invokeEventListeners(constants.TRANSITION_START, toState, fromState);
    cancelCurrentTransition = transition(router, toState, fromState, options, function (err, state) {
      cancelCurrentTransition = null;
      state = state || toState;

      if (err) {
        if (err.code === errorCodes.TRANSITION_CANCELLED) {
          router.invokeEventListeners(constants.TRANSITION_CANCEL, toState, fromState);
        } else {
          router.invokeEventListeners(constants.TRANSITION_ERROR, toState, fromState, err);
        }

        done(err);
      } else {
        router.setState(state);
        done(null, state);
      }
    });
    return cancelCurrentTransition;
  };

  return router;
}

var noop$1 = function () {};

function withRouterLifecycle(router) {
  var started = false;

  router.isStarted = function () {
    return started;
  }; //@ts-ignore


  router.start = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var options = router.getOptions();
    var lastArg = args[args.length - 1];
    var done = typeof lastArg === 'function' ? lastArg : noop$1;
    var startPathOrState = typeof args[0] !== 'function' ? args[0] : undefined;

    if (started) {
      done({
        code: errorCodes.ROUTER_ALREADY_STARTED
      });
      return router;
    }

    var startPath, startState;
    started = true;
    router.invokeEventListeners(constants.ROUTER_START); // callback

    var cb = function (err, state, invokeErrCb) {
      if (invokeErrCb === void 0) {
        invokeErrCb = true;
      }

      if (!err) router.invokeEventListeners(constants.TRANSITION_SUCCESS, state, null, {
        replace: true
      });
      if (err && invokeErrCb) router.invokeEventListeners(constants.TRANSITION_ERROR, state, null, err);
      done(err, state);
    };

    if (startPathOrState === undefined && !options.defaultRoute) {
      return cb({
        code: errorCodes.NO_START_PATH_OR_STATE
      });
    }

    if (typeof startPathOrState === 'string') {
      startPath = startPathOrState;
    } else if (typeof startPathOrState === 'object') {
      startState = startPathOrState;
    }

    if (!startState) {
      // If no supplied start state, get start state
      startState = startPath === undefined ? null : router.matchPath(startPath); // Navigate to default function

      var navigateToDefault_1 = function () {
        return router.navigateToDefault({
          replace: true
        }, done);
      };

      var redirect_1 = function (route) {
        return router.navigate(route.name, route.params, {
          replace: true,
          reload: true,
          redirected: true
        }, done);
      };

      var transitionToState = function (state) {
        router.transitionToState(state, router.getState(), {}, function (err, state) {
          if (!err) cb(null, state);else if (err.redirect) redirect_1(err.redirect);else if (options.defaultRoute) navigateToDefault_1();else cb(err, null, false);
        });
      }; // If matched start path


      if (startState) {
        transitionToState(startState);
      } else if (options.defaultRoute) {
        // If default, navigate to default
        navigateToDefault_1();
      } else if (options.allowNotFound) {
        transitionToState(router.makeNotFoundState(startPath, {
          replace: true
        }));
      } else {
        // No start match, no default => do nothing
        cb({
          code: errorCodes.ROUTE_NOT_FOUND,
          path: startPath
        }, null);
      }
    } else {
      // Initialise router with provided start state
      router.setState(startState);
      cb(null, startState);
    }

    return router;
  };

  router.stop = function () {
    if (started) {
      router.setState(null);
      started = false;
      router.invokeEventListeners(constants.ROUTER_STOP);
    }

    return router;
  };

  return router;
}

var toFunction = function (val) {
  return typeof val === 'function' ? val : function () {
    return function () {
      return val;
    };
  };
};

function withRouteLifecycle(router) {
  var canDeactivateFactories = {};
  var canActivateFactories = {};
  var canDeactivateFunctions = {};
  var canActivateFunctions = {};

  router.getLifecycleFactories = function () {
    return [canDeactivateFactories, canActivateFactories];
  };

  router.getLifecycleFunctions = function () {
    return [canDeactivateFunctions, canActivateFunctions];
  };

  router.canDeactivate = function (name, canDeactivateHandler) {
    var factory = toFunction(canDeactivateHandler);
    canDeactivateFactories[name] = factory;
    canDeactivateFunctions[name] = router.executeFactory(factory);
    return router;
  };

  router.clearCanDeactivate = function (name) {
    canDeactivateFactories[name] = undefined;
    canDeactivateFunctions[name] = undefined;
    return router;
  };

  router.canActivate = function (name, canActivateHandler) {
    var factory = toFunction(canActivateHandler);
    canActivateFactories[name] = factory;
    canActivateFunctions[name] = router.executeFactory(factory);
    return router;
  };

  return router;
}

var pipe = function () {
  var fns = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    fns[_i] = arguments[_i];
  }

  return function (arg) {
    return fns.reduce(function (prev, fn) {
      return fn(prev);
    }, arg);
  };
};

var createRouter = function (routes, options, dependencies) {
  if (routes === void 0) {
    routes = [];
  }

  if (options === void 0) {
    options = {};
  }

  if (dependencies === void 0) {
    dependencies = {};
  }

  var config = {
    decoders: {},
    encoders: {},
    defaultParams: {},
    forwardMap: {}
  };
  return pipe(withOptions(options), withDependencies(dependencies), withObservability, withState, withRouterLifecycle, withRouteLifecycle, withNavigation, withPlugins, withMiddleware, withRoutes(routes))({
    config: config
  });
};

exports.createRouter = createRouter;

function cloneRouter(router, dependencies) {
  var clonedRouter = createRouter(router.rootNode, router.getOptions(), dependencies);
  clonedRouter.useMiddleware.apply(clonedRouter, router.getMiddlewareFactories());
  clonedRouter.usePlugin.apply(clonedRouter, router.getPlugins());
  clonedRouter.config = router.config;

  var _a = router.getLifecycleFactories(),
      canDeactivateFactories = _a[0],
      canActivateFactories = _a[1];

  Object.keys(canDeactivateFactories).forEach(function (name) {
    return clonedRouter.canDeactivate(name, canDeactivateFactories[name]);
  });
  Object.keys(canActivateFactories).forEach(function (name) {
    return clonedRouter.canActivate(name, canActivateFactories[name]);
  });
  return clonedRouter;
}

var _default = createRouter;
exports.default = _default;
},{"symbol-observable":"../../node_modules/router5/node_modules/symbol-observable/es/index.js","route-node":"../../node_modules/route-node/dist/es/route-node.js","router5-transition-path":"../../node_modules/router5-transition-path/dist/index.es.js"}],"../../node_modules/router5-plugin-browser/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _router = require("router5");

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var value = function (arg) {
  return function () {
    return arg;
  };
};

var noop = function () {};

var isBrowser = typeof window !== 'undefined' && window.history;

var getBase = function () {
  return window.location.pathname;
};

var supportsPopStateOnHashChange = function () {
  return window.navigator.userAgent.indexOf('Trident') === -1;
};

var pushState = function (state, title, path) {
  return window.history.pushState(state, title, path);
};

var replaceState = function (state, title, path) {
  return window.history.replaceState(state, title, path);
};

var addPopstateListener = function (fn, opts) {
  var shouldAddHashChangeListener = opts.useHash && !supportsPopStateOnHashChange();
  window.addEventListener('popstate', fn);

  if (shouldAddHashChangeListener) {
    window.addEventListener('hashchange', fn);
  }

  return function () {
    window.removeEventListener('popstate', fn);

    if (shouldAddHashChangeListener) {
      window.removeEventListener('hashchange', fn);
    }
  };
};

var getLocation = function (opts) {
  var path = opts.useHash ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '') : window.location.pathname.replace(new RegExp('^' + opts.base), ''); // Fix issue with browsers that don't URL encode characters (Edge)

  var correctedPath = safelyEncodePath(path);
  return (correctedPath || '/') + window.location.search;
};

var safelyEncodePath = function (path) {
  try {
    return encodeURI(decodeURI(path));
  } catch (_) {
    return path;
  }
};

var getState = function () {
  return window.history.state;
};

var getHash = function () {
  return window.location.hash;
};

var browser = {};

if (isBrowser) {
  browser = {
    getBase: getBase,
    pushState: pushState,
    replaceState: replaceState,
    addPopstateListener: addPopstateListener,
    getLocation: getLocation,
    getState: getState,
    getHash: getHash
  };
} else {
  browser = {
    getBase: value(''),
    pushState: noop,
    replaceState: noop,
    addPopstateListener: noop,
    getLocation: value(''),
    getState: value(null),
    getHash: value('')
  };
}

var safeBrowser = browser;
var defaultOptions = {
  forceDeactivate: true,
  useHash: false,
  hashPrefix: '',
  base: '',
  mergeState: false,
  preserveHash: true
};
var source = 'popstate';

function browserPluginFactory(opts, browser) {
  if (browser === void 0) {
    browser = safeBrowser;
  }

  var options = __assign({}, defaultOptions, opts);

  var transitionOptions = {
    forceDeactivate: options.forceDeactivate,
    source: source
  };
  var removePopStateListener;
  return function browserPlugin(router) {
    var routerOptions = router.getOptions();
    var routerStart = router.start;

    router.buildUrl = function (route, params) {
      var base = options.base || '';
      var prefix = options.useHash ? "#" + options.hashPrefix : '';
      var path = router.buildPath(route, params);
      if (path === null) return null;
      return base + prefix + path;
    };

    var urlToPath = function (url) {
      var match = url.match(/^(?:http|https):\/\/(?:[0-9a-z_\-.:]+?)(?=\/)(.*)$/);
      var path = match ? match[1] : url;
      var pathParts = path.match(/^(.+?)(#.+?)?(\?.+)?$/);
      if (!pathParts) throw new Error("[router5] Could not parse url " + url);
      var pathname = pathParts[1];
      var hash = pathParts[2] || '';
      var search = pathParts[3] || '';
      return (options.useHash ? hash.replace(new RegExp('^#' + options.hashPrefix), '') : options.base ? pathname.replace(new RegExp('^' + options.base), '') : pathname) + search;
    };

    router.matchUrl = function (url) {
      return router.matchPath(urlToPath(url));
    };

    router.start = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      if (args.length === 0 || typeof args[0] === 'function') {
        routerStart.apply(void 0, [browser.getLocation(options)].concat(args));
      } else {
        routerStart.apply(void 0, args);
      }

      return router;
    };

    router.replaceHistoryState = function (name, params, title) {
      if (params === void 0) {
        params = {};
      }

      if (title === void 0) {
        title = '';
      }

      var route = router.buildState(name, params);
      var state = router.makeState(route.name, route.params, router.buildPath(route.name, route.params), {
        params: route.meta
      });
      var url = router.buildUrl(name, params);
      router.lastKnownState = state;
      browser.replaceState(state, title, url);
    };

    function updateBrowserState(state, url, replace) {
      var trimmedState = state ? {
        meta: state.meta,
        name: state.name,
        params: state.params,
        path: state.path
      } : state;
      var finalState = options.mergeState === true ? __assign({}, browser.getState(), trimmedState) : trimmedState;
      if (replace) browser.replaceState(finalState, '', url);else browser.pushState(finalState, '', url);
    }

    function onPopState(evt) {
      var routerState = router.getState(); // Do nothing if no state or if last know state is poped state (it should never happen)

      var newState = !evt.state || !evt.state.name;
      var state = newState ? router.matchPath(browser.getLocation(options), source) : router.makeState(evt.state.name, evt.state.params, evt.state.path, __assign({}, evt.state.meta, {
        source: source
      }), evt.state.meta.id);
      var defaultRoute = routerOptions.defaultRoute,
          defaultParams = routerOptions.defaultParams;

      if (!state) {
        // If current state is already the default route, we will have a double entry
        // Navigating back and forth will emit SAME_STATES error
        defaultRoute && router.navigateToDefault(__assign({}, transitionOptions, {
          reload: true,
          replace: true
        }));
        return;
      }

      if (routerState && router.areStatesEqual(state, routerState, false)) {
        return;
      }

      router.transitionToState(state, routerState, transitionOptions, function (err, toState) {
        if (err) {
          if (err.redirect) {
            var _a = err.redirect,
                name_1 = _a.name,
                params = _a.params;
            router.navigate(name_1, params, __assign({}, transitionOptions, {
              replace: true,
              force: true,
              redirected: true
            }));
          } else if (err.code === _router.errorCodes.CANNOT_DEACTIVATE) {
            var url = router.buildUrl(routerState.name, routerState.params);

            if (!newState) {
              // Keep history state unchanged but use current URL
              updateBrowserState(state, url, true);
            } // else do nothing or history will be messed up
            // TODO: history.back()?

          } else {
            // Force navigation to default state
            defaultRoute && router.navigate(defaultRoute, defaultParams, __assign({}, transitionOptions, {
              reload: true,
              replace: true
            }));
          }
        } else {
          router.invokeEventListeners(_router.constants.TRANSITION_SUCCESS, toState, routerState, {
            replace: true
          });
        }
      });
    }

    function onStart() {
      if (options.useHash && !options.base) {
        // Guess base
        options.base = browser.getBase();
      }

      removePopStateListener = browser.addPopstateListener(onPopState, options);
    }

    function teardown() {
      if (removePopStateListener) {
        removePopStateListener();
        removePopStateListener = undefined;
      }
    }

    function onTransitionSuccess(toState, fromState, opts) {
      var historyState = browser.getState();
      var hasState = historyState && historyState.meta && historyState.name && historyState.params;
      var statesAreEqual = fromState && router.areStatesEqual(fromState, toState, false);
      var replace = opts.replace || !hasState || statesAreEqual;
      var url = router.buildUrl(toState.name, toState.params);

      if (fromState === null && options.useHash === false && options.preserveHash === true) {
        url += browser.getHash();
      }

      updateBrowserState(toState, url, replace);
    }

    return {
      onStart: onStart,
      onStop: teardown,
      teardown: teardown,
      onTransitionSuccess: onTransitionSuccess,
      onPopState: onPopState
    };
  };
}

var _default = browserPluginFactory;
exports.default = _default;
},{"router5":"../../node_modules/router5/dist/index.es.js"}],"../router-test/use-router.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

exports.__esModule = true;

var haunted_w_microtask_1 = require("haunted-w-microtask");

var use_disconnected_1 = require("./use-disconnected");

var use_trigger_update_1 = require("./use-trigger-update");

var router5_1 = __importDefault(require("router5"));

var router5_plugin_browser_1 = __importDefault(require("router5-plugin-browser")); // router5 doesn't want lots of individual instances, so use a singleton


var router = router5_1["default"]([{
  name: 'default',
  path: '*route'
}]);
router.usePlugin(router5_plugin_browser_1["default"]({
  useHash: true
}));
router.start();

function useRouter(options) {
  var _a = haunted_w_microtask_1.useState(0),
      timesDisconnected = _a[0],
      setTimesDisconnected = _a[1];

  var triggerUpdate = use_trigger_update_1.useTriggerUpdate();
  var routerApi = haunted_w_microtask_1.useMemo(function () {
    var route = ""; // the current partial route that this component cares about
    // router5 passes state into the handler with no hash.  
    // If default route is defined with it, we need to add it back when processing

    var useHash = options.defaultRoute[0] === '#';

    var handler = function handler(routerState) {
      var _route = routerState.route.path; // If a defined route matches the current route, use it.

      if (options.routes[_route.replace(options.baseRoute, '')] || options.routes[('#' + _route).replace(options.baseRoute, '')]) {
        route = _route;
        triggerUpdate();
        return;
      } // If a defined route is a base for the current route, do return the base.
      // This is for parent routers to relax and be okay with what their kids are doing.


      var partialPath = Object.keys(options.routes).reduce(function (out, routePath) {
        return _route.indexOf(routePath) === 0 || ('#' + _route).indexOf(routePath) === 0 ? routePath : out;
      }, "");

      if (partialPath) {
        route = partialPath;
        triggerUpdate();
        return;
      } // At this point, if this our baseRoute matches the currentRoute, it means 
      // the current route is invalid and we should handle it by redirecting to our default route.


      if (_route.indexOf(options.baseRoute) === 0 || ('#' + _route).indexOf(options.baseRoute) === 0) {
        route = options.baseRoute + options.defaultRoute;
        triggerUpdate(); //router.navigate(route, {}, {replace:true});

        var href = window.location.href.replace(window.location.hash, route);
        window.history.replaceState({}, document.title, href);
      }
    }; //subscribe to future changes


    var routerUnsubscribe = router.subscribe(handler); //invoke the handler for the current route

    handler({
      route: router.getState()
    }); //return methods to be invoked elsewhere

    return {
      getRoute: function getRoute() {
        // TODO: currently having to do some gymnastics to manage where '#' should be returned
        var tempRoute = route;

        if (tempRoute[0] !== '#' && options.baseRoute[0] === '#') {
          tempRoute = '#' + tempRoute;
        } else if (useHash && tempRoute[0] !== '#') {
          tempRoute = '#' + tempRoute;
        }

        return tempRoute.replace(options.baseRoute, '');
      },
      unsubscribe: routerUnsubscribe
    }; // using timesDisconnected as a memo is one way to manage subscribing/unsubscribing
  }, [timesDisconnected]);
  use_disconnected_1.useDisconnected(function () {
    routerApi.unsubscribe();
    setTimesDisconnected(timesDisconnected + 1);
  });
  return routerApi.getRoute(); //return the valid partial route that the component will care about
}

exports.useRouter = useRouter;
;
},{"haunted-w-microtask":"../../lib/haunted-builds/index-w-microtask.js","./use-disconnected":"../router-test/use-disconnected.ts","./use-trigger-update":"../router-test/use-trigger-update.ts","router5":"../../node_modules/router5/dist/index.es.js","router5-plugin-browser":"../../node_modules/router5-plugin-browser/dist/index.es.js"}],"../router-test/child-one.ts":[function(require,module,exports) {
"use strict";
/* eslint-disable */

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

exports.__esModule = true;

var haunted_w_microtask_1 = require("haunted-w-microtask");

var use_router_1 = require("./use-router");

var routes = {
  "/child-route-A": haunted_w_microtask_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<h2>I am child 1 route A</h2>"], ["<h2>I am child 1 route A</h2>"]))),
  "/child-route-B": haunted_w_microtask_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<h2>I am child 1 route B</h2>"], ["<h2>I am child 1 route B</h2>"])))
};

function ChildOne(_a) {
  var baseRoute = _a.baseRoute;
  var route = use_router_1.useRouter({
    id: "childRouter",
    routes: routes,
    defaultRoute: "/child-route-A",
    baseRoute: baseRoute
  });
  return !route ? haunted_w_microtask_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject([""], [""]))) : haunted_w_microtask_1.html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <h1>I am child 1.  I have a child router</h1>\n\n    <a href=\"", "/child-route-A\">Go to child route A</a>\n    <a href=\"", "/child-route-B\">Go to child route B</a>\n\n    ", "\n  "], ["\n    <h1>I am child 1.  I have a child router</h1>\n\n    <a href=\"", "/child-route-A\">Go to child route A</a>\n    <a href=\"", "/child-route-B\">Go to child route B</a>\n\n    ", "\n  "])), baseRoute, baseRoute, routes[route]);
}

ChildOne.observedAttributes = ['base-route'];
customElements.define("child-one", haunted_w_microtask_1.component(ChildOne, HTMLElement, {
  useShadowDOM: false
}));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
},{"haunted-w-microtask":"../../lib/haunted-builds/index-w-microtask.js","./use-router":"../router-test/use-router.ts"}],"../router-test/child-two.ts":[function(require,module,exports) {
"use strict";
/* eslint-disable */

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

exports.__esModule = true;

var haunted_w_microtask_1 = require("haunted-w-microtask");

function ChildTwo(el) {
  return haunted_w_microtask_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <h1>I am child 2. I don't have a child router</h1>\n  "], ["\n    <h1>I am child 2. I don't have a child router</h1>\n  "])));
}

customElements.define("child-two", haunted_w_microtask_1.component(ChildTwo, HTMLElement, {
  useShadowDOM: false
}));
var templateObject_1;
},{"haunted-w-microtask":"../../lib/haunted-builds/index-w-microtask.js"}],"../router-test/router-test.ts":[function(require,module,exports) {
"use strict";
/* eslint-disable */

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

exports.__esModule = true;

var haunted_w_microtask_1 = require("haunted-w-microtask");

require("./router-test.scss");

var use_router_1 = require("./use-router");

require("./child-one");

require("./child-two");

var routes = {
  "#/route1": haunted_w_microtask_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<child-one base-route=\"#/route1\"></child-one>"], ["<child-one base-route=\"#/route1\"></child-one>"]))),
  "#/route2": haunted_w_microtask_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<child-two base-route=\"#/route2\"></child-two>"], ["<child-two base-route=\"#/route2\"></child-two>"])))
};

function RouterTest(el) {
  var route = use_router_1.useRouter({
    id: "parentRouter",
    routes: routes,
    defaultRoute: "#/route1",
    baseRoute: ""
  });
  return !route ? haunted_w_microtask_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject([""], [""]))) : haunted_w_microtask_1.html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <h1>Element with router</h1>\n\n    <a href=\"#/route1\">Go To Child 1</a>\n    <a href=\"#/route2\">Go To Child 2</a>\n\n    <main>\n      ", "\n    </main>\n  "], ["\n    <h1>Element with router</h1>\n\n    <a href=\"#/route1\">Go To Child 1</a>\n    <a href=\"#/route2\">Go To Child 2</a>\n\n    <main>\n      ", "\n    </main>\n  "])), routes[route]);
}

customElements.define("router-test", haunted_w_microtask_1.component(RouterTest, HTMLElement, {
  useShadowDOM: false
}));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
},{"haunted-w-microtask":"../../lib/haunted-builds/index-w-microtask.js","./router-test.scss":"../router-test/router-test.scss","./use-router":"../router-test/use-router.ts","./child-one":"../router-test/child-one.ts","./child-two":"../router-test/child-two.ts"}]},{},["../router-test/router-test.ts"], null)
//# sourceMappingURL=router-test.7ab2b07e.map