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
 * These are all described as on little-endian machines.
 * @enum {number}
 */
zf.render.PixelFormat = {
  /**
   * 24-bit RGB in B8G8R8 format.
   */
  BGR888: 0,

  /**
   * 32-bit RGBA in A8B8G8R8 format.
   */
  ABGR8888: 1,

  /**
   * 32-bit RGBA in A8B8G8R8 format with premultiplied alpha.
   */
  PBGR8888: 2,

  /**
   * 16-bit RGB B5G6R5 format.
   */
  BGR565: 3
};
