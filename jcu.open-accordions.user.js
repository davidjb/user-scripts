// ==UserScript==
// @name     JCU - Open Accordions
// @version  1.0
// @grant    none
// @match    https://www.jcu.edu.au/*
// @match    https://secure.jcu.edu.au/*
// ==/UserScript==

// www-style
document.querySelectorAll('.accordion__link').forEach(e => e.click())
document.querySelectorAll('.accordion-section .panel').forEach(e => e.className = '')

// secure, uber-accordion
document.querySelectorAll('.accordion__target').forEach(e => e.className = '')
