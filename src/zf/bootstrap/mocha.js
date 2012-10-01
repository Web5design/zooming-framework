/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview mocha node.js test library loader.
 * Loads the Closure Library, the deps file, and sets up the testing
 * environment.
 *
 * This file is designed to be run directly and is required before any test
 * code runs. It is hardcoded to pull in Closure library, the zf deps, and
 * import the main namespaces.
 *
 * Note that at the time this file runs Closure has not yet been loaded.
 * goog.* is not available!
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */


(function(global) {
  // Load Chai, the assertion library.
  global['chai'] = require('chai');

  // Load Closure Library and the zf deps file.
  require('./node').importClosureLibrary([
    'zf_js-deps.js'
  ]);

  goog.require('zf.testing.mocha');
})(global);
