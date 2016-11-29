/** =========================================================================
 * Console
 * Proxy console.logs out to the parent window
 * https://github.com/jsbin/jsbin/blob/74ab65ae139b4df358db03e9575645d09e436d57/public/js/runner/proxy-console.js
 * ========================================================================== */
(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals (root is window)
    root.proxyConsole = factory(root);
  }
}(this, function (root) {
var proxyConsole = function (runner) {
  'use strict';
  if(!runner){
      alert("缺少runner参数");
  }
  /*global stringify, runner*/
  var supportsConsole = true;
  try { window.console.log('d[ o_0 ]b'); } catch (e) { supportsConsole = false; }

  var proxyConsole = function() {};

  /**
   * Stringify all of the console objects from an array for proxying
   */
  var stringifyArgs = function (args) {
    var newArgs = [];
    // TODO this was forEach but when the array is [undefined] it wouldn't
    // iterate over them
    var i = 0, length = args.length, arg;
    for(; i < length; i++) {
      arg = args[i];
      if (typeof arg === 'undefined') {
        newArgs.push('undefined');
      } else {
        newArgs.push(JSON.stringify(arg));
      }
    }
    return newArgs;
  };

  // Create each of these methods on the proxy, and postMessage up to JS Bin
  // when one is called.
  var _console  = console;
  var methods = [
    'debug', 'clear', 'error', 'info', 'log', 'warn', 'dir', 'props', '_raw',
    'group', 'groupEnd', 'dirxml', 'table', 'trace', 'assert', 'count',
    'markTimeline', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp',
    'groupCollapsed'
  ];

  methods.forEach(function (method) {
    // Create console method
    var oldMethod = _console[method];
    console[method] = function () {
      // Replace args that can't be sent through postMessage
      var originalArgs = [].slice.call(arguments),
          args = stringifyArgs(originalArgs);
      // Post up with method and the arguments
      runner.postMessage(
         method === '_raw' ? originalArgs.shift() : method,
         method === '_raw' ? args.slice(1) : args

      );

      // If the browner supports it, use the browser console but ignore _raw,
      // as _raw should only go to the proxy console.
      // Ignore clear if it doesn't exist as it's beahviour is different than
      // log and we let it fallback to jsconsole for the panel and to nothing
      // for the browser console
      if (window.console) {
        if (!_console[method]) {
          method = 'log';
        }

        if (window.console && method !== '_raw') {
          if (method !== 'clear' || (method === 'clear' && _console.clear)) {
            oldMethod.apply(_console, originalArgs);
          }
        }
      }
    };
  });

  return proxyConsole;

}

return proxyConsole;
}));
