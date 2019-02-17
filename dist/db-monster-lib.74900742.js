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
})({"../db-monster-test/db-monster-lib.js":[function(require,module,exports) {
window.ENV = function () {
  'use strict';

  var counter = 0;
  var data;

  var _base;

  if (!(_base = String.prototype).lpad) _base.lpad = function (padding, toLength) {
    return padding.repeat((toLength - this.length) / padding.length).concat(this);
  };

  function formatElapsed(value) {
    var str = parseFloat(value).toFixed(2);

    if (value > 60) {
      var minutes = Math.floor(value / 60);
      var comps = (value % 60).toFixed(2).split('.');
      var seconds = comps[0].lpad('0', 2);
      var ms = comps[1];
      str = minutes + ":" + seconds + "." + ms;
    }

    return str;
  }

  function getElapsedClassName(elapsed) {
    var className = 'Query elapsed';

    if (elapsed >= 10.0) {
      className += ' warn_long';
    } else if (elapsed >= 1.0) {
      className += ' warn';
    } else {
      className += ' short';
    }

    return className;
  }

  function countClassName(queries) {
    var countClassName = "label";

    if (queries >= 20) {
      countClassName += " label-important";
    } else if (queries >= 10) {
      countClassName += " label-warning";
    } else {
      countClassName += " label-success";
    }

    return countClassName;
  }

  function updateQuery(object) {
    if (!object) {
      object = {};
    }

    var elapsed = Math.random() * 15;
    object.elapsed = elapsed;
    object.formatElapsed = formatElapsed(elapsed);
    object.elapsedClassName = getElapsedClassName(elapsed);
    object.query = "SELECT blah FROM something";
    object.waiting = Math.random() < 0.5;

    if (Math.random() < 0.2) {
      object.query = "<IDLE> in transaction";
    }

    if (Math.random() < 0.1) {
      object.query = "vacuum";
    }

    return object;
  }

  function cleanQuery(value) {
    if (value) {
      value.formatElapsed = "";
      value.elapsedClassName = "";
      value.query = "";
      value.elapsed = null;
      value.waiting = null;
    } else {
      return {
        query: "***",
        formatElapsed: "",
        elapsedClassName: ""
      };
    }
  }

  function generateRow(object, keepIdentity, counter) {
    var nbQueries = Math.floor(Math.random() * 10 + 1);

    if (!object) {
      object = {};
    }

    object.lastMutationId = counter;
    object.nbQueries = nbQueries;

    if (!object.lastSample) {
      object.lastSample = {};
    }

    if (!object.lastSample.topFiveQueries) {
      object.lastSample.topFiveQueries = [];
    }

    if (keepIdentity) {
      // for Angular optimization
      if (!object.lastSample.queries) {
        object.lastSample.queries = [];

        for (var l = 0; l < 12; l++) {
          object.lastSample.queries[l] = cleanQuery();
        }
      }

      for (var j in object.lastSample.queries) {
        var value = object.lastSample.queries[j];

        if (j <= nbQueries) {
          updateQuery(value);
        } else {
          cleanQuery(value);
        }
      }
    } else {
      object.lastSample.queries = [];

      for (var j = 0; j < 12; j++) {
        if (j < nbQueries) {
          var value = updateQuery(cleanQuery());
          object.lastSample.queries.push(value);
        } else {
          object.lastSample.queries.push(cleanQuery());
        }
      }
    }

    for (var i = 0; i < 5; i++) {
      var source = object.lastSample.queries[i];
      object.lastSample.topFiveQueries[i] = source;
    }

    object.lastSample.nbQueries = nbQueries;
    object.lastSample.countClassName = countClassName(nbQueries);
    return object;
  }

  function getData(keepIdentity) {
    var oldData = data;

    if (!keepIdentity) {
      // reset for each tick when !keepIdentity
      data = [];

      for (var i = 1; i <= ENV.rows; i++) {
        data.push({
          dbname: 'cluster' + i,
          query: "",
          formatElapsed: "",
          elapsedClassName: ""
        });
        data.push({
          dbname: 'cluster' + i + ' slave',
          query: "",
          formatElapsed: "",
          elapsedClassName: ""
        });
      }
    }

    if (!data) {
      // first init when keepIdentity
      data = [];

      for (var i = 1; i <= ENV.rows; i++) {
        data.push({
          dbname: 'cluster' + i
        });
        data.push({
          dbname: 'cluster' + i + ' slave'
        });
      }

      oldData = data;
    }

    for (var i in data) {
      var row = data[i];

      if (!keepIdentity && oldData && oldData[i]) {
        row.lastSample = oldData[i].lastSample;
      }

      if (!row.lastSample || Math.random() < ENV.mutations()) {
        counter = counter + 1;

        if (!keepIdentity) {
          row.lastSample = null;
        }

        generateRow(row, keepIdentity, counter);
      } else {
        data[i] = oldData[i];
      }
    }

    return {
      toArray: function toArray() {
        return data;
      }
    };
  }

  var mutationsValue = 0.5;

  function mutations(value) {
    if (value) {
      mutationsValue = value;
      return mutationsValue;
    } else {
      return mutationsValue;
    }
  }

  var body = document.querySelector('body');
  var theFirstChild = body.firstChild;
  var sliderContainer = document.createElement('div');
  sliderContainer.style.cssText = "display: flex";
  var slider = document.createElement('input');
  var text = document.createElement('label');
  text.innerHTML = 'mutations : ' + (mutationsValue * 100).toFixed(0) + '%';
  text.id = "ratioval";
  slider.setAttribute("type", "range");
  slider.style.cssText = 'margin-bottom: 10px; margin-top: 5px';
  slider.addEventListener('change', function (e) {
    ENV.mutations(e.target.value / 100);
    document.querySelector('#ratioval').innerHTML = 'mutations : ' + (ENV.mutations() * 100).toFixed(0) + '%';
  });
  sliderContainer.appendChild(text);
  sliderContainer.appendChild(slider);
  body.insertBefore(sliderContainer, theFirstChild);
  return {
    generateData: getData,
    rows: 50,
    timeout: 0,
    mutations: mutations
  };
}();
},{}]},{},["../db-monster-test/db-monster-lib.js"], null)
//# sourceMappingURL=db-monster-lib.74900742.map