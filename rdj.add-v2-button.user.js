// ==UserScript==
// @name         Research Data JCU - Add v2 Record Button
// @version      1.2
// @description  Add easily-accessible button to ReDBox v1 to link to v2 records
// @author       davidjb
// @grant        none
// @match        https://research.jcu.edu.au/researchdata/*
// @match        https://eresearch.jcu.edu.au/researchdata/*
// ==/UserScript==

(function() {
  'use strict'

  if (window.location.pathname.match(/\/researchdata\/(default|published|administration)\/detail/)) {
    const oid = window.location.pathname.match(/\/detail\/(.+?)\//)
    const content = document.createRange().createContextualFragment(`
    <a href="https://research.jcu.edu.au/data/default/rdmp/legacy/record/${oid[1]}/"
       target="_blank"
       style="float: right; border: 1px solid #06c; font-size: 1rem; color: #06c; border-radius: 5px; padding: 3px;">
       Go to record on Research Data JCU
    </a>
    `)
    document.querySelector('#page-heading').appendChild(content)
  }
})()
