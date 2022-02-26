// ==UserScript==
// @name         Member Advantage - Adjust Checkout
// @version      0.1.0
// @description  Makes checkout process simpler
// @author       davidjb
// @grant        none
// @match        https://ma.ambassadorcard.com.au/*
// ==/UserScript==

(function() {
  'use strict'

  // Show hidden fields
  document.querySelectorAll('#card_purchase [type=hidden]').forEach(e => {
      e.type = 'text'
      e.className = 'form-control'
  })
  // Remove fake visible fields
  document.querySelectorAll('#card_purchase [readonly]:not([name])').forEach(e => e.remove())
})()
