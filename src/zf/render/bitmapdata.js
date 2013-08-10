/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Bitmap data types.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.BitmapData');
goog.provide('zf.render.DomBitmapData');
goog.provide('zf.render.DomImageElement');
goog.provide('zf.render.PixelBitmapData');

goog.require('zf.render.PixelFormat');



/**
 * Abstract bitmap data container.
 * Subclasses provide actual bitmap pixel sources.
 *
 * @param {number} width Width of the bitmap, in pixels.
 * @param {number} height Height of the bitmap, in pixels.
 * @param {boolean=} opt_premultiplied Whether the alpha channel is
 *     already premultiplied.
 * @constructor
 */
zf.render.BitmapData = function(width, height, opt_premultiplied) {
  /**
   * Width of the bitmap, in pixels.
   * @type {number}
   * @private
   */
  this.width_ = width;

  /**
   * Height of the bitmap, in pixels.
   * @type {number}
   * @private
   */
  this.height_ = height | 0;

  /**
   * Whether the bitmap pixels are already premultiplied.
   * @type {boolean}
   * @private
   */
  this.premultiplied_ = opt_premultiplied || false;
};


/**
 * @typedef {Image|HTMLVideoElement|HTMLCanvasElement}
 */
zf.render.DomImageElement;



/**
 * Bitmap data backed by a DOM element.
 * If an image is provided it must be fully loaded.
 *
 * @param {zf.render.DomImageElement} element Image element.
 * @param {boolean=} opt_premultiplied Whether the alpha channel is
 *     already premultiplied.
 * @constructor
 * @extends {zf.render.BitmapData}
 */
zf.render.DomBitmapData = function(element, opt_premultiplied) {
  goog.base(this, element.width, element.height, opt_premultiplied);

  /**
   * Element.
   * @type {!zf.render.DomImageElement}
   * @private
   */
  this.element_ = element;
};
goog.inherits(zf.render.DomBitmapData, zf.render.BitmapData);


/**
 * Gets the DOM element that contains the bitmap data.
 * @return {!zf.render.DomImageElement} DOM image element.
 */
zf.render.DomBitmapData.prototype.getElement = function() {
  return this.element_;
};



/**
 * Bitmap data backed by raw pixels.
 *
 * @param {number} width Bitmap width, in pixels.
 * @param {number} height Bitmap height, in pixels.
 * @param {zf.render.PixelFormat} format Pixel data format.
 * @param {Uint8Array|Uint16Array=} opt_pixels Pixel data.
 * @constructor
 * @extends {zf.render.PixelBitmapData}
 */
zf.render.PixelBitmapData = function(width, height, format, opt_pixels) {
  goog.base(this, width, height, format == zf.render.PixelFormat.PBGR8888);

  /**
   * Pixel data format.
   * @type {zf.render.PixelFormat}
   * @private
   */
  this.format_ = format;

  /**
   * Bytes per pixel.
   * @type {number}
   * @private
   */
  this.bpp_ = 4;
  switch (format) {
    case zf.render.PixelFormat.BGR565:
      this.bpp_ = 2;
      break;
    case zf.render.PixelFormat.BGR888:
      this.bpp_ = 3;
      break;
    case zf.render.PixelFormat.ABGR8888:
    case zf.render.PixelFormat.PBGR8888:
      this.bpp_ = 4;
      break;
  }

  var pixels = opt_pixels;
  if (!pixels) {
    if (format == zf.render.PixelFormat.BGR565) {
      pixels = new Uint16Array(width * height);
    } else {
      pixels = new Uint8Array(width * height * this.bpp_);
    }
  }

  /**
   * Pixel data.
   * @type {!Uint8Array|!Uint16Array}
   * @private
   */
  this.pixels_ = pixels;
};
goog.inherits(zf.render.PixelBitmapData, zf.render.BitmapData);
