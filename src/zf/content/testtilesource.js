/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Test image tile source type.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.content.TestTileSource');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('zf.content.TileSource');
goog.require('zf.exec.Task');
goog.require('zf.render.DomBitmapData');



/**
 * Generated tile source that shows alternating colors per level and extra
 * debug information.
 *
 * @param {number} width Total width of the image, in pixels.
 * @param {number} height Total height of the image, in pixels.
 * @param {number=} opt_tileSize Tile size (including overlap), in pixels.
 * @param {number=} opt_tileOverlap Tile overlap pixels.
 * @param {number=} opt_imageBorder Image border pixels.
 * @param {boolean=} opt_debug Whether to draw debug text on tiles.
 * @constructor
 * @extends {zf.content.TileSource}
 */
zf.content.TestTileSource = function(width, height, opt_tileSize,
    opt_tileOverlap, opt_imageBorder, opt_debug) {
  goog.base(this,
      width, height, opt_tileSize || 256, opt_tileOverlap, opt_imageBorder);

  /**
   * Whether to draw debug text on tiles.
   * @type {boolean}
   */
  this.debug = opt_debug || false;
};
goog.inherits(zf.content.TestTileSource, zf.content.TileSource);


/**
 * @override
 */
zf.content.TestTileSource.prototype.requestTile =
    function(level, tileX, tileY) {
  return new zf.exec.Task(this.createTile_, this, [level, tileX, tileY]);
};


/**
 * A list of colors to use for each level.
 * @type {!Array.<string>}
 * @const
 * @private
 */
zf.content.TestTileSource.LEVEL_COLORS_ = [
  'rgb(255,0,0)',
  'rgb(255,255,0)',
  'rgb(255,0,255)',
  'rgb(0,255,0)',
  'rgb(0,255,255)',
  'rgb(0,0,255)'
];


/**
 * Creates the bitmap data for the given tile.
 * @param {number} level Level of detail.
 * @param {number} tileX Tile X in the level.
 * @param {number} tileY Tile Y in the level.
 * @return {zf.render.BitmapData} Tile bitmap data.
 * @private
 */
zf.content.TestTileSource.prototype.createTile_ =
    function(level, tileX, tileY) {
  var tileSize = this.computeTileSize(level, tileX, tileY);
  var tileWidth = tileSize[0];
  var tileHeight = tileSize[1];

  var canvas = /** @type {!HTMLCanvasElement} */ (
      goog.dom.createElement(goog.dom.TagName.CANVAS));
  canvas.width = tileWidth;
  canvas.height = tileHeight;
  var ctx = canvas.getContext('2d');

  // Fill color based on level.
  var levelColors = zf.content.TestTileSource.LEVEL_COLORS_;
  ctx.fillStyle = levelColors[level % levelColors.length];
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw debug text.
  if (this.debug) {
    var debugText = level + '@' + tileX + ',' + tileY;
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillText(debugText, this.tileOverlap, this.tileOverlap + 8);
  }

  // Wrap it bitmap data.
  return new zf.render.DomBitmapData(canvas);
};
