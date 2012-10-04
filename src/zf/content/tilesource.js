/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Abstract image tile source type.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.content.LevelInfo');
goog.provide('zf.content.TilePresence');
goog.provide('zf.content.TileSource');


/**
 * Defines the presence of a tile in the pyramid.
 * @enum {number}
 */
zf.content.TilePresence = {
  /**
   * Tile is present in the pyramid.
   */
  PRESENT: 0,

  /**
   * Tile is should be skipped (finer tiles still drawn).
   */
  SKIPPED: 1,

  /**
   * Tile is missing and should stop recursion (finer tiles not drawn).
   */
  MISSING: 2
};



/**
 * Information about a single level in an image source tile pyramid.
 * @param {number} pixelWidth Width of the level in pixels.
 * @param {number} pixelHeight Height of the level in pixels.
 * @param {number} tileWidth Width of the level in tiles.
 * @param {number} tileHeight Height of the level in tiles.
 * @constructor
 */
zf.content.LevelInfo =
    function(pixelWidth, pixelHeight, tileWidth, tileHeight) {
  /**
   * Width, in pixels, of the level.
   * @type {number}
   */
  this.pixelWidth = pixelWidth;

  /**
   * Height, in pixels, of the level.
   * @type {number}
   */
  this.pixelHeight = pixelHeight;

  /**
   * Width, in tiles, of the level.
   * @type {number}
   */
  this.tileWidth = tileWidth;

  /**
   * Height, in tiles, of the level.
   * @type {number}
   */
  this.tileHeight = tileHeight;
};



/**
 * Abstract image tile source.
 * Subclass to provide tiles. Tiles are yielded via queue task items to enable
 * efficient scheduling.
 *
 * @param {number} width Total width of the image, in pixels.
 * @param {number} height Total height of the image, in pixels.
 * @param {number} tileSize Tile size (including overlap), in pixels.
 * @param {number=} opt_tileOverlap Tile overlap pixels.
 * @param {number=} opt_imageBorder Image border pixels.
 * @constructor
 */
zf.content.TileSource = function(width, height, tileSize, opt_tileOverlap,
    opt_imageBorder) {
  /**
   * Total width, in pixels, of the image.
   * @type {number}
   */
  this.width = width;

  /**
   * Total height, in pixels, of the image.
   * @type {number}
   */
  this.height = height;

  /**
   * Tile size (including overlap), in pixel.
   * This should match the physical size of tiles in their files.
   * @type {[type]}
   */
  this.tileSize = tileSize;

  /**
   * Number of overlap pixels in each tile, in pixels.
   * @type {number}
   */
  this.tileOverlap = opt_tileOverlap || 0;

  /**
   * Number of border pixels along the outer border of the image, in pixels.
   * @type {number}
   */
  this.imageBorder = opt_imageBorder || 0;

  /**
   * Total number of levels in the tile pyramid.
   * @type {number}
   */
  this.levelCount = Math.ceil(Math.log(Math.max(width, height)) / Math.LN2) + 1;

  // TODO(benvanik): perhaps cheaper just to recalculate?
  /**
   * Cached level information.
   * @type {!Array.<!zf.content.LevelInfo>}
   */
  this.levelInfo = new Array(levelCount);
  for (var n = 0; n < levelCount; n++) {
    var pow2 = Math.pow(2, levelCount - n - 1);
    var pixelWidth = Math.max(1, Math.ceil(width / pow2));
    var pixelHeight = Math.max(1, Math.ceil(height / pow2));
    this.levelInfo[n] = new zf.content.LevelInfo(
        pixelWidth, pixelHeight,
        Math.ceil(pixelWidth / tileSize), Math.ceil(pixelHeight / tileSize));
  }
};


/**
 * Computes the size of a given tile, factoring in tile overlap and the image
 * border.
 * @param {number} level Level of detail.
 * @param {number} tileX Tile X in the level.
 * @param {number} tileY Tile Y in the level.
 * @return {!Array.<number>} Pixel width and height of the requested tile.
 * @protected
 */
zf.content.TileSource.prototype.computeTileSize =
    function(level, tileX, tileY) {
  var levelInfo = this.levelInfo[level];
  var tileWidth =
      this.tileSize +
      (x ? this.tileOverlap : this.imageBorder) +
      ((x < levelInfo.tileWidth - 1) ? this.tileOverlap : this.imageBorder);
  var tileHeight =
      this.tileSize +
      (y ? this.tileOverlap : this.imageBorder) +
      ((y < levelInfo.tileHeight - 1) ? this.tileOverlap : this.imageBorder);
  return [tileWidth, tileHeight];
};


/**
 * Checks the presence of the given tile in the pyramid.
 * This can be used to selectively limit the level of detail in regions of
 * the pyramid or force the skipping of levels of detail.
 *
 * @param {number} level Level of detail.
 * @param {number} tileX Tile X in the level.
 * @param {number} tileY Tile Y in the level.
 * @return {zf.content.TilePresence} Tile presence state.
 */
zf.content.TileSource.prototype.checkTile = function(level, tileX, tileY) {
  return zf.content.TilePresence.PRESENT;
};


/**
 * Creates the task for loading the tile.
 * Implementations should not create or load tiles in this method but instead
 * return a task that will later be used to do so. The task should return a
 * {@see zf.render.BitmapData}.
 *
 * @param {number} level Level of detail.
 * @param {number} tileX Tile X in the level.
 * @param {number} tileY Tile Y in the level.
 * @return {zf.exec.Task} Tile request work task, if the tile can be created.
 */
zf.content.TileSource.prototype.requestTile = goog.abstractMethod;
