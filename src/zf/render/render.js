/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Render namespace utilities and types.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.PixelFormat');


/**
 * Pixel format types.
 * @enum {number}
 */
zf.render.PixelFormat = {
  /**
   * 24-bit RGB in R8G8B8 format.
   */
  RGB888: 0,

  /**
   * 32-bit RGBA in R8G8B8A8 format.
   */
  RGBA8888: 1,

  /**
   * 32-bit RGBA in R8G8B8A8 format with premultiplied alpha.
   */
  RGBP8888: 2,

  /**
   * 16-bit RGB R5G6B5 format.
   */
  RGB565: 3
};
