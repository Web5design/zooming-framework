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



/**
 * Command buffer.
 * An efficient storage mechanism for image pyramid slices. Buffers are designed
 * to be reused between frames, and grow as needed.
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
 * Adds a slice header to the command buffer.
 * @param {number} x X, in scene coordinates.
 * @param {number} y Y, in scene coordinates.
 * @param {number} w Width, in scene coordinates.
 * @param {number} h Height, in scene coordiantes.
 * @param {number} drawOrder Integer draw order.
 * @param {number} tint RGB tint.
 * @param {number} opacity [0-255] opacity.
 * @param {number} layerCount Estimated layer count.
 */
zf.render.ICommandBuffer.prototype.appendSlice2d = goog.nullFunction;


/**
 * Adds a slice layer to the command buffer.
 * A slice must have previously been appended that allocated space for this
 * layer.
 * @param {number} surfaceId Surface ID.
 * @param {number} tu0 Texture coordinate TU 0.
 * @param {number} tv0 Texture coordinate TV 0.
 * @param {number} tu1 Texture coordinate TU 1.
 * @param {number} tv1 Texture coordinate TV 1.
 * @param {!Array.<number>} blendMatrix 3x3 blending matrix with [0-255] values.
 */
zf.render.ICommandBuffer.prototype.appendSliceLayer = goog.nullFunction;
