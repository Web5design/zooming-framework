/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Array-based command buffer.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.ArrayCommandBuffer');

goog.require('zf.math');
goog.require('zf.render.ICommandBuffer');



/**
 * Array command buffer.
 * A Javascript Array-based command buffer. This is a pairing of
 * {@see zf.render.BinaryCommandBuffer} designed to work on older browsers that
 * don't support Typed Arrays. It tries to follow the same semantics as the
 * Typed Array version by truncating data/etc to prevent variance.
 *
 * Array command buffers are implemented as large untyped arrays. All
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
zf.render.ArrayCommandBuffer = function() {
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
   *
   * @type {!Array.<zf.render.ArraySlice>}
   * @private
   */
  this.data_ = new Array(zf.render.ArrayCommandBuffer.DEFAULT_CAPACITY_);

  /**
   * Current index offset into the slice data array.
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
zf.render.ArrayCommandBuffer.DEFAULT_CAPACITY_ = 16 * 1024;


/**
 * Growth rate; a multiplier on current capacity when expanding.
 * @const
 * @type {number}
 * @private
 */
zf.render.ArrayCommandBuffer.GROWTH_RATE_ = 2;


/**
 * Bytes per slice header.
 * @const
 * @type {number}
 * @private
 */
zf.render.ArrayCommandBuffer.SIZE_PER_SLICE_ = 7;


/**
 * Bytes per slice layer.
 * @const
 * @type {number}
 * @private
 */
zf.render.ArrayCommandBuffer.SIZE_PER_LAYER_ = 15;


/**
 * @override
 */
zf.render.ArrayCommandBuffer.prototype.reset = function() {
  this.sliceIndex_ = 0;
  this.dataOffset_ = 0;
};


/**
 * Expands the command buffer to a larger size.
 * This is more efficient than growing by one element each insert.
 * @private
 */
zf.render.ArrayCommandBuffer.prototype.expand_ = function() {
  var newSize = zf.math.grow(
      this.data_.length, zf.render.ArrayCommandBuffer.GROWTH_RATE_, 32);
  this.data_.length = newSize;
};


/**
 * @override
 */
zf.render.ArrayCommandBuffer.prototype.appendSlice2d = function(
    x, y, w, h, drawOrder, tint, opacity, layerCount) {
  // Record the offset of the slice.
  var offset = this.dataOffset_;
  this.sliceOffsets_[this.sliceIndex_++] = offset;

  // Asjust offset, expanding if needed.
  var totalSize =
      zf.render.ArrayCommandBuffer.SIZE_PER_SLICE_ +
      layerCount * zf.render.ArrayCommandBuffer.SIZE_PER_LAYER_;
  if (offset + totalSize > this.bufferCapacity_) {
    this.expand_();
  }
  this.dataOffset_ += zf.render.ArrayCommandBuffer.SIZE_PER_SLICE_;

  // Add to buffer.
  var a = this.data_;
  a[offset] = x;
  a[offset + 1] = y;
  a[offset + 2] = w;
  a[offset + 3] = h;
  a[offset + 4] = drawOrder | 0;
  a[offset + 5] = (tint << 24) | (opacity & 0xFF);
  a[offset + 6] = layerCount & 0xFF;
};


/**
 * @override
 */
zf.render.ArrayCommandBuffer.prototype.appendSliceLayer = function(
    surfaceId, tu0, tv0, tu1, tv1, flags, blendMatrix) {
  // Adjust offset.
  // Note that we assume that the append slice expanded if it was required.
  var offset = this.dataOffset_;
  this.dataOffset_ += zf.render.ArrayCommandBuffer.SIZE_PER_LAYER_;

  // Add to buffer.
  var a = this.data_;
  a[offset] = surfaceId | 0;
  a[offset + 1] = tu0;
  a[offset + 2] = tv0;
  a[offset + 3] = tu1;
  a[offset + 4] = tv1;
  a[offset + 5] = flags & 0xFF;
  for (var n = 0; n < 9; n++) {
    a[offset + 5 + n] = blendMatrix[n] & 0xFF;
  }
};
