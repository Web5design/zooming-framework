/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview mocha testing runner.
 *
 * This file is required at the very end of the testing process to kick off
 * mocha.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.testing.mocha.run');


/**
 * Runs mocha with all tests currently loaded.
 */
zf.testing.mocha.run = function() {
  var mocha = goog.global['mocha'];
  mocha['run'](function() {
    // Fired when tests have completed.
    zf.testing.mocha.run.hasCompleted = true;
    var mochaCompletionWaiter = goog.global['mochaCompletionWaiter'];
    if (mochaCompletionWaiter) {
      mochaCompletionWaiter();
    }
  });
};


/**
 * Set to true when the mocha run has completed.
 * @type {boolean}
 */
zf.testing.mocha.run.hasCompleted = false;


zf.testing.mocha.run();
