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

/** @suppress {extraRequire} */
goog.require('zf.version');


/**
 * @define {boolean} Whether to enable exporting of the zf
 *     types and namespace.
 *
 * This should only be enabled in builds of the standalone library. If you're
 * including this code with it enabled in Closurized javascript then you'll
 * prevent renaming.
 */
zf.ENABLE_EXPORTS = false;


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
    zf.NODE ||
    !!(goog.global['performance'] && (
        goog.global['performance']['now'] ||
        goog.global['performance']['webkitNow']));


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
  if (zf.NODE) {
    try {
      var microtime = require('microtime');
      var timebase = microtime['nowDouble']() * 1000;
      return function zfNowMicrotime() {
        return microtime['nowDouble']() * 1000 - timebase;
      };
    } catch (e) {
      var hrtime = goog.global['process']['hrtime'];
      var timeValue = hrtime();
      var timebase = timeValue[0] * 1000 + timeValue[1] / 1000000;
      return function zfNowHrtime() {
        var timeValue = hrtime();
        return (timeValue[0] * 1000 - timebase) + timeValue[1] / 1000000;
      };
    }
  }

  // This dance is a little silly, but calling off of the closure object is
  // 2x+ faster than dereferencing the global and using a direct call instead of
  // a .call() is 2x+ on top of that.
  var performance = goog.global['performance'];
  if (performance && performance['now']) {
    return function zfNowPerformanceNow() {
      return performance['now']();
    };
  } else if (performance && performance['webkitNow']) {
    return function zfNowPerformanceWebkitNow() {
      return performance['webkitNow']();
    };
  } else {
    var timebase = Date.now();
    return function zfNowDate() {
      return Date.now() - timebase;
    };
  }
})();


/**
 * Whether the current machine is little-endian.
 * @return {boolean} True if the machine is little-endian. Otherwise it is
 *     big-endian.
 */
zf.isLittleEndian = (function() {
  var buffer32 = new Uint32Array([0x0A0B0C0D]);
  var buffer8 = new Uint8Array(buffer32.buffer);
  return (
      buffer8[3] == 0x0A &&
      buffer8[2] == 0x0B &&
      buffer8[1] == 0x0C &&
      buffer8[0] == 0x0D);
})();


if (zf.ENABLE_EXPORTS) {
  goog.exportSymbol(
      'zf.hasHighResolutionTimes',
      zf.hasHighResolutionTimes);
  goog.exportSymbol(
      'zf.now',
      zf.now);
  goog.exportSymbol(
      'zf.isLittleEndian',
      zf.isLittleEndian);
}
