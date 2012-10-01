/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview A simple loader used for importing the library in example
 *     scripts. Real applications should always use the compiled js file in a
 *     <script> tag to ensure efficient loading (or better yet, use
 *     Closure Compiler and include the library directly, greatly reducing the
 *     size of the final JS).
 */


/**
 * Injects a script tag to include the given source.
 * @param {string} src Script source URL.
 */
function injectScriptSrc(src) {
  document.writeln('<script src="' + src + '"></script>');
};


/**
 * Injects a function into the page.
 * @param {!Function} fn Function to inject.
 * @param {Array=} opt_args Arguments array. All must be string serializable.
 */
function injectScriptFunction(fn, opt_args) {
  // Header to let users know what's up.
  var header = [
    '/* Zooming Framework injected testing function: ' + fn.name + ' */'
  ].join('\n');

  // Format args as strings that can go in the source.
  var args = opt_args || [];
  for (var n = 0; n < args.length; n++) {
    if (typeof args[n] == 'string') {
      // TODO(benvanik): escape
      args[n] = '"' + args[n] + '"';
    }
  }
  args = args.join(',');

  // TODO(benvanik): escape fn source
  var source = String(fn);

  // Add to page.
  document.writeln(
      '<script>\n' +
      header + '\n\n(' + source + ')(' + args + ');\n' +
      '</script>');
};


/**
 * Prepares the library and runs the given callback when it's ready.
 * @param {!function()} exampleCallback Function called when zf is ready.
 */
function runApp(exampleCallback) {
  var devMode = window.location.search.indexOf('uncompiled') != -1;
  if (devMode) {
    // Dev mode - use uncompiled sources/deps/etc.
    window['CLOSURE_NO_DEPS'] = true;
    injectScriptSrc('../../third_party/closure-library/closure/goog/base.js');
    injectScriptSrc('../../zf_js-deps.js');
    injectScriptFunction(function() {
      goog.require('zf.exports');
    });
  } else {
    // Compiled mode - just the release library with exports.
    injectScriptSrc('../../zf_js_compiled.js');
  }

  // Super hacky, but required to ensure all of the goog.require magic works.
  window['__exampleCallback'] = exampleCallback;
  injectScriptFunction(function() {
    var callback = window.__exampleCallback;
    delete window['__exampleCallback'];
    callback.call(window);
  });
};
