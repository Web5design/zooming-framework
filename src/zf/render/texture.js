/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Render texture surface.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.Texture');

goog.require('goog.Disposable');



/**
 * Abstract render texture surface.
 *
 * @param {number} textureId Cache-unique texture ID.
 * @param {number} width Texture width, in pixels.
 * @param {number} height Texture height, in pixels.
 * @constructor
 * @extends {goog.Disposable}
 */
zf.render.Texture = function(textureId, width, height) {
  goog.base(this);

  /**
   * Cache-unique texture ID.
   * @type {number}
   * @private
   */
  this.textureId_ = textureId;

  /**
   * Texture width, in pixels.
   * @type {number}
   * @private
   */
  this.width_ = width;

  /**
   * Texture height, in pixels.
   * @type {number}
   * @private
   */
  this.height_ = height;
};
goog.inherits(zf.render.Texture, goog.Disposable);
