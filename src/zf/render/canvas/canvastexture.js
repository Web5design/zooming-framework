/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Canvas render texture surface.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.canvas.CanvasTexture');

goog.require('zf.render.Texture');



/**
 * Canvas render texture surface.
 *
 * @param {number} textureId Cache-unique texture ID.
 * @param {number} width Texture width, in pixels.
 * @param {number} height Texture height, in pixels.
 * @constructor
 * @extends {goog.Disposable}
 */
zf.render.canvas.CanvasTexture = function(textureId, width, height) {
  goog.base(this, textureId, width, height);

  /**
   * @type {!zf.render.DomImageElement}
   * @private
   */
  this.handle_ = handle;
};
goog.inherits(zf.render.canvas.CanvasTexture, zf.render.Texture);


/**
 * Gets the underlying handle for this texture.
 * @return {!zf.render.DomImageElement} Handle value.
 */
zf.render.canvas.CanvasTexture.prototype.getHandle = function() {
  return this.handle_;
};
