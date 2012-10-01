/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Root API exports.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.exports');

goog.require('zf');


/**
 * @define {boolean} Whether to enable exporting of the zf
 *     types and namespace.
 *
 * This should only be enabled in builds of the standalone library. If you're
 * including this code with it enabled in Closurized javascript then you'll
 * prevent renaming.
 */
zf.exports.ENABLE_EXPORTS = false;


if (zf.exports.ENABLE_EXPORTS) {
  // zf utilities
  goog.exportSymbol(
      'zf.hasHighResolutionTimes',
      zf.hasHighResolutionTimes);
  goog.exportSymbol(
      'zf.timebase',
      zf.timebase);
  goog.exportSymbol(
      'zf.now',
      zf.now);
}
