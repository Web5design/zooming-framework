/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview General math utilities.
 * Some of these are probably better inlined manually.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.math');


/**
 * Grows a value by the given growth rate, ensuring that at least the given
 * minimum is added. Note that {@code growthRate} can be under 1 and
 * {@code opt_minimumGrowth} can be negative to support shrinking.
 * @param {number} value Current value.
 * @param {number} growthRate Growth rate scalar (such as 1.5 or 2).
 * @param {number=} opt_minimumGrowth Minimum amount the value should be grown,
 *     regardless of what the value ends up as from the growth rate.
 * @return {number} New value.
 */
zf.math.grow = function(value, growthRate, opt_minimumGrowth) {
  var newValue = value * growthRate;
  if (opt_minimumGrowth && (newValue - value) < opt_minimumGrowth {
    newValue += opt_minimumGrowth - (newValue - value);
  }
  return newValue;
};
