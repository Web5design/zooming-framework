/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Typed Array-based command buffer.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.BinaryCommandBuffer');

goog.require('zf.math');
goog.require('zf.render.ICommandBuffer');



/**
 * Binary command buffer.
 * A Typed Array-based command buffer used by modern renderers.
 *
 * Binary command buffers are implemented as large typed arrays, allowing for
 * extremely efficient transmission to/from workers and double buffering. All
 * references to other objects (such as textures) are via indirection, making it
 * possible to save and restore buffers as needed.
 *
 * The format of the buffer is a bit obscure, so avoid trying to care about it.
 * The documentation that follows on it shouldn't be used by anything but
 * render contexts trying to process buffers.
 *
 * @constructor
 * @implements {zf.render.ICommandBuffer}
 */
zf.render.BinaryCommandBuffer = function() {
  /**
   * Slice offsets into the slice data array.
   * This can be used to iterate slices efficiently when sorting/etc.
   * @type {!Array.<number>}
   * @private
   */
  this.sliceOffsets_ = [];

  /**
   * Current slice index; an index into the {@see #sliceOffsets_} list.
   * @type {number}
   * @private
   */
  this.sliceIndex_ = 0;

  /**
   * Slice data array.
   * Contains slices and their layers. Tightly packed and expanded as needed.
   *
   * The format for 2d slices is:
   * - float: x
   * - float: y
   * - float: w
   * - float: h
   * - uint: drawOrder
   * - uint: rgba (3b tint | 1b opacity)
   * - 1b: layerCount
   *   (3b pad)
   * - layers[layerCount]:
   *   - uint: surfaceId
   *   - float: tu0
   *   - float: tv0
   *   - float: tu1
   *   - float: tv1
   *   - 1b: flags (flapped)
   *   - 9b: 3x3x1b blend matrix
   *   - padding?
   *
   * @type {!Uint8Array}
   * @private
   */
  this.data_ =
      new Uint8Array(zf.render.BinaryCommandBuffer.DEFAULT_CAPACITY_);

  /**
   * A 32-bit uint view into the slices data array.
   * @type {!Uint32Array}
   * @private
   */
  this.dataU4_ = new Uint32Array(this.data_);

  /**
   * A 32-bit float view into the slices data array.
   * @type {!Float32Array}
   * @private
   */
  this.dataF4_ = new Float32Array(this.data_);

  /**
   * Current byte offset into the slice data array.
   * @type {number}
   * @private
   */
  this.dataOffset_ = 0;
};


/**
 * Default slice byte capacity.
 * @const
 * @type {number}
 * @private
 */
zf.render.BinaryCommandBuffer.DEFAULT_CAPACITY_ = 16 * 1024;


/**
 * Growth rate; a multiplier on current capacity when expanding.
 * @const
 * @type {number}
 * @private
 */
zf.render.BinaryCommandBuffer.GROWTH_RATE_ = 2;


/**
 * Bytes per slice header.
 * @const
 * @type {number}
 * @private
 */
zf.render.BinaryCommandBuffer.SIZE_PER_SLICE_ = 4 * 4 + 4 + 4 + 4;


/**
 * Bytes per slice layer.
 * @const
 * @type {number}
 * @private
 */
zf.render.BinaryCommandBuffer.SIZE_PER_LAYER_ = 4 + 4 * 4 + 10 + 2;


/**
 * @override
 */
zf.render.BinaryCommandBuffer.prototype.reset = function() {
  this.sliceIndex_ = 0;
  this.dataOffset_ = 0;
};


/**
 * Reallocates the command buffer to a larger size.
 * @private
 */
zf.render.BinaryCommandBuffer.prototype.expand_ = function() {
  var newSize = zf.math.grow(
      this.data_.length, zf.render.BinaryCommandBuffer.GROWTH_RATE_, 1024);
  var oldData = this.data_;
  var newData = new Uint8Array(newSize);
  for (var n = 0; n < oldData.length; n++) {
    newData[n] = oldData[n];
  }
  this.data_ = newData;
  this.dataU4_ = new Uint32Array(this.data_);
  this.dataF4_ = new Float32Array(this.data_);
};


/**
 * @override
 */
zf.render.BinaryCommandBuffer.prototype.appendSlice2d = function(
    x, y, w, h, drawOrder, tint, opacity, layerCount) {
  // Record the offset of the slice.
  var offset = this.dataOffset_;
  this.sliceOffsets_[this.sliceIndex_++] = offset;

  // Asjust offset, expanding if needed.
  var totalSize =
      zf.render.BinaryCommandBuffer.SIZE_PER_SLICE_ +
      layerCount * zf.render.BinaryCommandBuffer.SIZE_PER_LAYER_;
  if (offset + totalSize > this.bufferCapacity_) {
    this.expand_();
  }
  this.dataOffset_ += zf.render.BinaryCommandBuffer.SIZE_PER_SLICE_;

  // Add to buffer.
  var u4 = this.dataU4_;
  var f4 = this.dataF4_;
  f4[offset / 4] = x;
  f4[(offset + 4) / 4] = y;
  f4[(offset + 8) / 4] = w;
  f4[(offset + 12) / 4] = h;
  u4[(offset + 16) / 4] = drawOrder | 0;
  u4[(offset + 20) / 4] = (tint << 24) | (opacity & 0xFF);
  // NOTE: still have 3 bytes here
  u4[(offset + 24) / 4] = layerCount & 0xFF;
};


/**
 * @override
 */
zf.render.BinaryCommandBuffer.prototype.appendSliceLayer = function(
    surfaceId, tu0, tv0, tu1, tv1, flags, blendMatrix) {
  // Adjust offset.
  // Note that we assume that the append slice expanded if it was required.
  var offset = this.dataOffset_;
  this.dataOffset_ += zf.render.BinaryCommandBuffer.SIZE_PER_LAYER_;

  // Add to buffer.
  var b1 = this.data_;
  var u4 = this.dataU4_;
  var f4 = this.dataF4_;
  u4[offset / 4] = surfaceId | 0;
  f4[(offset + 4) / 4] = tu0;
  f4[(offset + 8) / 4] = tv0;
  f4[(offset + 12) / 4] = tu1;
  f4[(offset + 16) / 4] = tv1;
  b1[offset + 20] = flags & 0xFF;
  for (var n = 0; n < 9; n++) {
    b1[offset + 21 + n] = blendMatrix[n] & 0xFF;
  }
};
