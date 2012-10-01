/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview ZF defines and utilities.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf');


/**
 * Version identifier.
 * TODO(benvanik): something sane
 * @const
 * @type {number}
 */
zf.VERSION = 1;


/**
 * @define {boolean} True if running under node. Guard all node code with this
 * define to ensure it does not leak into web code.
 */
zf.NODE = false;


/**
 * Whether the runtime can provide high-resolution times.
 * @type {boolean}
 */
zf.hasHighResolutionTimes =
    !!(goog.global['performance'] && (
        goog.global['performance']['now'] ||
        goog.global['performance']['webkitNow']));


/**
 * Returns the wall time that {@see zf#now} is relative to.
 * This is often the page load time.
 *
 * @return {number} A time, in ms.
 */
zf.timebase = (function() {
  var navigationStart = 0;
  var performance = goog.global['performance'];
  if (performance && performance['timing']) {
    navigationStart = performance['timing']['navigationStart'];
  } else {
    navigationStart = +(new Date);
  }
  return function() {
    return navigationStart;
  };
})();


/**
 * Returns a non-wall time timestamp in milliseconds.
 * If available this will use a high precision timer. Otherwise it will fall
 * back to the default browser time.
 *
 * The time value is relative to page navigation, not wall time. Only use it for
 * relative measurements.
 *
 * @return {number} A monotonically increasing timer with sub-millisecond
 *      resolution (if supported).
 */
zf.now = (function() {
  // This dance is a little silly, but calling off of the closure object is
  // 2x+ faster than dereferencing the global and using a direct call instead of
  // a .call() is 2x+ on top of that.
  var performance = goog.global['performance'];
  if (performance && performance['now']) {
    return function() {
      return performance['now']();
    };
  } else if (performance && performance['webkitNow']) {
    return function() {
      return performance['webkitNow']();
    };
  } else {
    var timebase = zf.timebase();
    if (!Date.now) {
      return function() {
        return +new Date() - timebase;
      };
    } else {
      return Date.now;
    }
  }
})();
