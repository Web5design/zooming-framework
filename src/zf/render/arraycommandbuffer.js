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
   * Slice layer offsets into the slice layer data array.
   * This can be used to iterate slices layers efficiently when sorting/etc.
   * @type {!Array.<number>}
   * @private
   */
  this.layerOffsets_ = [];

  /**
   * Current slice layer index; an index into the {@see #sliceOffsets_} list.
   * @type {number}
   * @private
   */
  this.layerIndex_ = 0;

  /**
   * Whether the slices layer are sorted by draw order.
   * As slices are added this is toggled based on the current values.
   * @type {boolean}
   * @private
   */
  this.sortedByDrawOrder_ = true;

  /**
   * Draw order of the last inserted slice layer.
   * @type {number}
   * @private
   */
  this.lastDrawOrder_ = 0;

  /**
   * Slice layer data array.
   * Contains slices layers. Tightly packed and expanded as needed.
   *
   * The format for 2d slices is:
   * - 1b: flags
   * - float: x
   * - float: y
   * - float: w
   * - float: h
   * - uint: drawOrder
   * - uint: color rgba (3b tint | 1b opacity)
   * - uint: surfaceId
   * - float: tu0
   * - float: tv0
   * - float: tu1
   * - float: tv1
   * - 9b: 3x3x1b blend matrix
   *
   * @type {!Array.<zf.render.ArraySlice>}
   * @private
   */
  this.data_ = new Array(zf.render.ArrayCommandBuffer.DEFAULT_CAPACITY_);

  /**
   * Current index offset into the slice layer data array.
   * @type {number}
   * @private
   */
  this.dataOffset_ = 0;
};


/**
 * Growth rate; a multiplier on current capacity when expanding.
 * @const
 * @type {number}
 * @private
 */
zf.render.ArrayCommandBuffer.GROWTH_RATE_ = 2;


/**
 * Bytes per slice layer.
 * @const
 * @type {number}
 * @private
 */
zf.render.ArrayCommandBuffer.SIZE_PER_LAYER_ = 20;


/**
 * Default slice byte capacity.
 * @const
 * @type {number}
 * @private
 */
zf.render.ArrayCommandBuffer.DEFAULT_CAPACITY_ =
    zf.render.ArrayCommandBuffer.SIZE_PER_LAYER_ * 100;


/**
 * @override
 */
zf.render.ArrayCommandBuffer.prototype.reset = function() {
  this.layerIndex_ = 0;
  this.sortedByDrawOrder_ = true;
  this.lastDrawOrder_ = 0;
  this.dataOffset_ = 0;
};


/**
 * Expands the command buffer to a larger size.
 * This is more efficient than growing by one element each insert.
 * @private
 */
zf.render.ArrayCommandBuffer.prototype.expand_ = function() {
  var newSize = zf.math.grow(
      this.data_.length,
      zf.render.ArrayCommandBuffer.GROWTH_RATE_,
      zf.render.ArrayCommandBuffer.SIZE_PER_LAYER_);
  this.data_.length = newSize;
};


/**
 * @override
 */
zf.render.ArrayCommandBuffer.prototype.appendSlice2d = function(
    flags, x, y, w, h, drawOrder, color, surfaceId, tu0, tv0, tu1, tv1,
    blendMatrix) {
  // Record the offset of the slice.
  var offset = this.dataOffset_;
  this.layerOffsets_[this.layerIndex_++] = offset;

  // Asjust offset, expanding if needed.
  if (offset + zf.render.ArrayCommandBuffer.SIZE_PER_LAYER_ >
      this.bufferCapacity_) {
    this.expand_();
  }
  this.dataOffset_ += zf.render.ArrayCommandBuffer.SIZE_PER_SLICE_;

  // Track draw order.
  if (drawOrder < this.lastDrawOrder_) {
    this.sortedByDrawOrder_ = false;
  }
  this.lastDrawOrder_ = drawOrder;

  // Add to buffer.
  var a = this.data_;
  a[offset + 0] = flags;
  a[offset + 1] = x;
  a[offset + 2] = y;
  a[offset + 3] = w;
  a[offset + 4] = h;
  a[offset + 5] = drawOrder | 0;
  a[offset + 6] = (tint << 24) | (opacity & 0xFF);
  a[offset + 7] = surfaceId | 0;
  a[offset + 8] = tu0;
  a[offset + 9] = tv0;
  a[offset + 10] = tu1;
  a[offset + 11] = tv1;
  if (blendMatrix) {
    for (var n = 0; n < 9; n++) {
      a[offset + 12 + n] = blendMatrix[n] & 0xFF;
    }
  }
};


/**
 * @override
 */
zf.render.ArrayCommandBuffer.prototype.sortByDrawOrder = function() {
  // Fast-path exist if already sorted.
  // This can prevent multiple sorts or ignore a sort if the slices were added
  // in order.
  if (this.sortedByDrawOrder_) {
    return;
  }
  this.sortedByDrawOrder_ = true;

  // TODO(benvanik): zf.math.RadixSort or something to do a stateful radix sort.
  window.console.log('sorting not yet implemented');
};
