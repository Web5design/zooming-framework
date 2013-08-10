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

  var dom = goog.dom.getDomHelper(canvas);

  /**
   * Flap data canvas.
   * @type {!HTMLCanvasElement}
   * @private
   */
  this.flapCanvas_ = dom.createElement(goog.dom.TagName.CANVAS);
  this.flapCanvas_.width = this.flapCanvas_.height =
      zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_;

  /**
   * Flap data canvas rendering context.
   * @type {!CanvasRenderingContext2D}
   * @private
   */
  this.flapContext_ = this.flapCanvas_.getContext('2d');

  /**
   * Flap pixel data.
   * This is an array of image data of all the same number of flap columns but
   * increasing numbers of flap rows.
   * The flap data upload process will pick the smallest data size is can to
   * reduce the amount of data uploaded per frame.
   * @type {!ImageData}
   */
  this.flapPixelData_ = new Array(
      zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_);
  for (var n = 0; n < zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_;
      n++) {
    this.flapPixelData_[n] = this.flapContext_.createImageData(
        '' + (zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_ * 3),
        '' + (n * 3));
  }
};
goog.inherits(zf.render.canvas.CanvasRenderContext, zf.render.RenderContext);


/**
 * Square root of the total number of flapped quads that can be drawn in a
 * single draw command.
 * Any more than this will be skipped.
 * @type {number}
 * @const
 * @private
 */
zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_ = 16;


/**
 * Total number of flapped quads that can be drawn in a single frame.
 * Any more than this will be skipped.
 * @type {number}
 * @const
 * @private
 */
zf.render.canvas.CanvasRenderContext.FLAP_COUNT_ =
    zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_ *
    zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_;


/**
 * @override
 */
zf.render.canvas.CanvasRenderContext.prototype.draw2d =
    function(frame, commandBuffer) {
  var ctx = this.context_;

  // Ensure sorted by draw order. Since the sort is stable we should be ok.
  commandBuffer.sortByDrawOrder();

  // Generate blending flap data.
  if (commandBuffer.getFlappedLayerCount()) {
    this.generateBlendingFlapImage_(commandBuffer);
  }

  // Draw all layers.
  var layerCount = commandBuffer.getLayerCount();
  var layerIndices = commandBuffer.getLayerIndices();
  var layerData = commandBuffer.getLayerData();
  var f = 0;
  for (var n = 0; n < layerCount; n++) {
    var i = layerIndices[n];
    var flags = layerData[i];
    var x = layerData[i + 1];
    var y = layerData[i + 2];
    var w = layerData[i + 3];
    var h = layerData[i + 4];
    // drawOrder not needed, already sorted
    var color = layerData[i + 6];
    var texture = layerData[i + 7];
    var tu0 = layerData[i + 8];
    var tv0 = layerData[i + 9];
    var tu1 = layerData[i + 10];
    var tv1 = layerData[i + 11];

    // TODO(benvanik): should this only be on the flap layer?
    // TODO(benvanik): cache to prevent setting always?
    ctx.globalAlpha = (color & 0xFF) / 255;

    if (flags & zf.render.LayerFlag.BLENDING_FLAPS) {
      // Flap coordinates in the flap image.
      var fx = f % zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_;
      var fy = (f / zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_) | 0;

      // Draw flap mask.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(
          this.flapCanvas_,
          fx * 3, fy * 3,
          3, 3,
          x, y,
          w, h);

      // Draw quad.
      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(
          texture.getHandle(),
          tu0, tv0,
          tu1 - tu0, tv1 - tv0,
          x, y,
          w, h);

      // Reset.
      // TODO(benvanik): perhaps avoid the reset if possible?
      ctx.globalCompositeOperation = 'source-over';

      // Increment flap seen count - this is used for indexing into the
      // flap data image.
      f++;
    } else {
      // Normal quad.
      ctx.drawImage(
          texture.getHandle(),
          tu0, tv0,
          tu1 - tu0, tv1 - tv0,
          x, y,
          w, h);
    }
  }
};


/**
 * Generates the flap image for all flapped layers in the given buffer.
 * @param {!zf.render.ArrayCommandBuffer} commandBuffer Command buffer.
 * @private
 */
zf.render.canvas.CanvasRenderContext.prototype.generateBlendingFlapImage_ =
    function(commandBuffer) {
  // Update pixel data.
  var layerCount = commandBuffer.getFlappedLayerCount();
  var layerIndices = commandBuffer.getFlappedLayerIndices();
  var layerData = commandBuffer.getLayerData();

  // Clamp layer count to max capacity.
  layerCount = Math.min(
      layerCount, zf.render.canvas.CanvasRenderContext.FLAP_COUNT_);

  // Pick the image pixel data based on layer count. This allows ups to
  // reduce upload size when possible.
  var rows = (layerCount /
      zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_) | 0);
  var pixelData = this.flapPixelData_[rows];
  var data = pixelData.data;

  var s = zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_ * 3 * 4;
  for (var n = 0; n < layerCount; n++) {
    var i = layerIndices[n];
    var color = layerData[i + 6];

    // Determine flap coordinates in the flap image.
    // This must match the math used when drawing with the flaps above.
    var fx = n % zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_;
    var fy = (n / zf.render.canvas.CanvasRenderContext.FLAP_COUNT_SQRT_) | 0;

    // Stash data.
    var o = 3 * 4 * fy;
    data[o + 3] = layerData[i + 12];
    data[o + 7] = layerData[i + 13];
    data[o + 11] = layerData[i + 14];
    data[o + s + 3] = layerData[i + 15];
    data[o + s + 7] = layerData[i + 16];
    data[o + s + 11] = layerData[i + 17];
    data[o + s + s + 3] = layerData[i + 18];
    data[o + s + s + 7] = layerData[i + 19];
    data[o + s + s + 11] = layerData[i + 20];
  }

  // Flush data.
  this.flapContext_.putImageData(pixelData, 0, 0);
};
