/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview mocha testing setup.
 *
 * This file is used by both the node.js and browser tests to setup mocha to
 * and dependent libraries.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.testing.mocha');


/**
 * Sets up the mocha testing framework.
 * @private
 */
zf.testing.mocha.setup_ = function() {
  // Setup Chai.
  var chai = goog.global['chai'];
  chai['Assertion']['includeStack'] = true;
  goog.global['assert'] = chai['assert'];

  // Note: if we wanted to augment the assertion library, this would be the
  // place to do it.
  // See: http://chaijs.com/guide/helpers/
  var assert = goog.global['assert'];
};

zf.testing.mocha.setup_();
