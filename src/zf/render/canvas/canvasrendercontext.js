/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview DOM canvas render context.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.canvas.CanvasRenderContext');



/**
 * Canvas-based render context.
 *
 * @param {!HTMLCanvasElement} canvas Target canvas element.
 * @constructor
 * @extends {zf.render.RenderContext}
 */
zf.render.canvas.CanvasRenderContext = function(canvas) {
  var caps =
      zf.render.RenderCap.BLENDING_FLAPS |
      zf.render.RenderCap.LIMIT_LAYERS;
  goog.base(this, caps);

  /**
   * Target canvas element.
   * @type {!HTMLCanvasElement}
   * @private
   */
  this.canvas_ = canvas;

  /**
   * Canvas rendering context.
   * @type {!CanvasRenderingContext2D}
   * @private
   */
  this.context_ = canvas.getContext('2d');
};
goog.inherits(zf.render.canvas.CanvasRenderContext, zf.render.RenderContext);


/**
 * @override
 */
zf.render.canvas.CanvasRenderContext.prototype.draw2d =
    function(frame, commandBuffer) {
  //
};
