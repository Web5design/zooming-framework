/**
 * Copyright 2013 Ben Vanik, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview WTF version utilities.
 * The versions set in this file come from {@code scripts/update-version.sh} and
 * should not be set manually.
 *
 * @author ben.vanik@gmail.com (Ben Vanik)
 */

goog.provide('zf.version');


/**
 * Gets the current build number as an integer value.
 * This can be used to compare two build numbers using normal integer
 * comparison. If you need a human-readable build number, use {@see #toString}.
 * @return {number} Build number, as an integer.
 */
zf.version.getValue = function() {
  // Set via update-version.sh
  return 1362988800000; // time
};


/**
 * Gets the git SHA of the commit this build was taken at.
 * @return {string} A git SHA.
 */
zf.version.getCommit = function() {
  // Set via update-version.sh
  return 'f71881fec28227d7d4debb532b9eb3e12af6f5b4'; // sha
};


/**
 * Gets the version as a human-readable string that matches the version string
 * used elsewhere, such as {@code 2012.12.12-2}.
 * @return {string} Version string.
 */
zf.version.toString = function() {
  // Set via update-version.sh
  return '2013.3.11-1'; // string
};


goog.exportSymbol(
    'zf.version.getValue',
    zf.version.getValue);
goog.exportSymbol(
    'zf.version.getCommit',
    zf.version.getCommit);
goog.exportSymbol(
    'zf.version.toString',
    zf.version.toString);
