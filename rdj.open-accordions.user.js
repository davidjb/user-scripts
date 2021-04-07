// ==UserScript==
// @name         Research Data JCU - Open Accordions in v1.9
// @version      1.0.0
// @description  Open all Accordions within v1.9
// @author       davidjb
// @grant        none
// @match        https://research.jcu.edu.au/researchdata/*
// @match        https://eresearch.jcu.edu.au/researchdata/*
// ==/UserScript==

(function() {
  'use strict'

  const toggle = document.querySelector('#toggle-accordion')
  if (toggle) {
    toggle.click()
  }
})()
