/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Draw command buffer.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.render.CommandBuffer');


/**
 * Command buffer.
 * An efficient storage mechanism for image pyramid slices.
 *
 * Command buffers are implemented as large typed arrays, allowing for extremely
 * efficient transmission to/from workers and double buffering. All references
 * to other objects (such as textures) are via indirection, making it possible
 * to save and restore buffers are needed.
 *
 * @constructor
 */
zf.render.CommandBuffer = function() {
};
