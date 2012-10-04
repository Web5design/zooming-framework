/**
 * Copyright 2012 Ben Vanik. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Execution task type.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.exec.Task');



/**
 * Represents a task in the execution queue.
 * Tasks are placed in the queue and processed as time allows. The callback
 * provided to the task should return the value appropriate for the context
 * (such as bitmap data/etc). Tasks can opt in to an asynchronous flow if they
 * return a {@see goog.async.Deferred} from the callback.
 *
 * @param {!Function} callback Task callback.
 * @param {Object=} opt_scope Callback scope.
 * @param {Array=} opt_args Arguments to pass to the callback.
 * @constructor
 */
zf.exec.Task = function(callback, opt_scope, opt_args) {
  /**
   * Callback function.
   * @type {!Function}
   * @private
   */
  this.callback_ = callback;

  /**
   * Callback scope.
   * @type {!Object}
   * @private
   */
  this.scope_ = opt_scope || goog.global;

  /**
   * Arguments to pass to the callback.
   * @type {Array}
   * @private
   */
  this.args_ = opt_args || null;
};


/**
 * Executes the task.
 * @return {*|!goog.async.Deferred} Task result.
 */
zf.exec.Task.prototype.execute = function() {
  return this.callback_.apply(this.scope_, this.args_);
};
