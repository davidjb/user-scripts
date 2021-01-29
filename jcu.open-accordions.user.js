// ==UserScript==
// @name     JCU - Open Accordions
// @version  1.1.0
// @grant    none
// @match    https://www.jcu.edu.au/*
// @match    https://secure.jcu.edu.au/*
// ==/UserScript==

(function() {
  'use strict'

  // WWW-style
  document.querySelectorAll('.accordion__link').forEach(el => el.click())
  document.querySelectorAll('.accordion-section .panel').forEach(el => { el.className = '' })

  // Secure, uber-accordion
  document.querySelectorAll('.accordion__target').forEach(el => { el.className = '' })
})()
