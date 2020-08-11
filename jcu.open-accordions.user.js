// ==UserScript==
// @name     JCU - Open Accordions
// @version  1.0
// @grant    none
// @match    https://www.jcu.edu.au/*
// ==/UserScript==

document.querySelectorAll('.accordion__link').forEach(e => e.click())
document.querySelectorAll('.accordion-section .panel').forEach(e => e.className = '')
