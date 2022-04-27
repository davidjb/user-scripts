// ==UserScript==
// @name         The Old Reader - Fix groupBy
// @version      0.1.0
// @description  Fix The Old Reader running in browsers with Array.prototype.groupBy built-in
// @author       davidjb
// @grant        none
// @match        https://theoldreader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theoldreader.com
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict'

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy
  // has a different function signature to the one polyfilled by The Old Reader
  // so just delete the pre-existing function before it loads its JS
  delete Array.prototype.groupBy
})()
