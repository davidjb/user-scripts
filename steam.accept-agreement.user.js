// ==UserScript==
// @name         Steam - Auto-accept agreement
// @version      1.0.2
// @description  Automatically ticks the box for the service agreement
// @author       davidjb
// @grant        none
// @match        https://store.steampowered.com/account/registerkey*
// ==/UserScript==

(function() {
  'use strict'

  document.querySelectorAll('#accept_ssa').forEach(el => { el.checked = true })
})()
