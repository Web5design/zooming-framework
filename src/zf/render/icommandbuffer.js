/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Command buffer interface.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.ICommandBuffer');
goog.provide('zf.render.LayerFlag');


/**
 * Bitmask values for layer flags.
 * @enum {number}
 */
zf.render.LayerFlag = {
  /**
   * Indicates that the layer has blending flaps.
   * The layer will have a blend matrix containg 3x3 opacity values.
   * If this flag is omitted then the layer has no flaps and the opacity has
   * already been rolled into the color.
   */
  BLENDING_FLAPS: (1 << 1)
};



/**
 * Command buffer.
 * An efficient storage mechanism for image pyramid slice layers. Buffers are
 * designed to be reused between frames, and grow as needed.
 *
 * There's a bit of overhead in producing the buffers, as slice properties are
 * required to have been distributed, however processing them is often very
 * fast.
 *
 * @interface
 */
zf.render.ICommandBuffer = function() {};


/**
 * Resets the command buffer to the beginning.
 * This should only be called once the command buffer is no longer needed.
 */
zf.render.ICommandBuffer.prototype.reset = goog.nullFunction;


/**
 * Adds a slice layer to the command buffer.
 * If the layer has flaps then that must be indicated in flags and the blend
 * matrix must be passed. If the layer is unflapped then the center opacity
 * value should already be rolled into the {@code color} argument.
 * @param {number} flags Bitmask of {@see zf.render.LayerFlag} values.
 * @param {number} x X, in scene coordinates.
 * @param {number} y Y, in scene coordinates.
 * @param {number} w Width, in scene coordinates.
 * @param {number} h Height, in scene coordiantes.
 * @param {number} drawOrder Integer draw order.
 * @param {number} color RGBA color.
 * @param {number} surfaceId Surface ID.
 * @param {number} tu0 Texture coordinate TU 0.
 * @param {number} tv0 Texture coordinate TV 0.
 * @param {number} tu1 Texture coordinate TU 1.
 * @param {number} tv1 Texture coordinate TV 1.
 * @param {Array.<number>} blendMatrix 3x3 blending matrix with [0-255] values.
 */
zf.render.ICommandBuffer.prototype.appendSliceLayer2d = goog.nullFunction;


/**
 * Sorts all slice layers by draw order.
 * This should only be called once all slices have been added to the buffer.
 */
zf.render.ICommandBuffer.prototype.sortByDrawOrder = goog.nullFunction;


// TODO(benvanik): sortByMagic - sort to surface ID while preserving draw order
//     for transparent layers
