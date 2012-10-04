/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Base render context.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.RenderContext');



/**
 * Visible render frame.
 * @constructor
 */
zf.render.Frame = function() {
  /**
   * Screen bounds (X, Y, W, H).
   * @type {!Array.<number>}
   */
  this.screen = [0, 0, 0, 0];

  /**
   * Viewport (X, Y, scale).
   * @type {!Array.<number>}
   */
  this.viewport = [0, 0, 0];
};



/**
 * Capability flags for render contexts.
 * @enum {number}
 */
zf.render.RenderCap = {
  /**
   * Blending flaps are supported.
   */
  BLENDING_FLAPS: (1 << 1),

  /**
   * Limit layers drawn to some reasonable amount.
   */
  LIMIT_LAYERS: (1 << 2)
};



/**
 * Base render context.
 * Render contexts are used to draw data produced by drawing image pyramids.
 *
 * Render context implementations assume that they do not own the host contexts
 * they are drawing into and will modify state as needed. Callers should reset
 * state if they need to after the draw has been made.
 *
 * @param {number} caps Bitmask of {@see zf.render.RenderCap} values.
 * @constructor
 * @extends {goog.Disposable}
 */
zf.render.RenderContext = function(caps) {
  goog.base(this);

  /**
   * Context capabilities, a bitmask of {@see zf.render.RenderCap} values.
   * @type {number}
   */
  this.caps_ = caps;
};
goog.inherits(zf.render.RenderContext, goog.Disposable);


/**
 * Gets a bitmask indicating the capabilities of the render context.
 * @return {number} A bitmask of {@see zf.render.RenderCap} values.
 */
zf.render.RenderContext.prototype.getCaps = function() {
  return this.caps_;
};


/**
 * Begins a drawing pass.
 */
zf.render.RenderContext.prototype.begin = goog.nullFunction;


/**
 * Ends a drawing pass.
 */
zf.render.RenderContext.prototype.end = goog.nullFunction;


/**
 * Draws a list of 2D pyramid slices.
 * Must be called within a {@see #begin}/{@see #end} block.
 *
 * @param {!zf.render.Frame} frame Viewport frame.
 * @param {!zf.render.CommandBuffer} commandBuffer Draw commands.
 */
zf.render.RenderContext.prototype.draw2d = goog.nullFunction;
