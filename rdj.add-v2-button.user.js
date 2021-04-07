// ==UserScript==
// @name         Research Data JCU - Add v2 Record and Helper Buttons
// @version      1.4
// @description  Add easily-accessible buttons to ReDBox v1 and link to v2 records
// @author       davidjb
// @grant        none
// @match        https://research.jcu.edu.au/researchdata/*
// @match        https://eresearch.jcu.edu.au/researchdata/*
// ==/UserScript==

(function() {
  'use strict'

  if (window.location.pathname.match(/\/researchdata\/(default|published|administration|dashboard)\/detail/)) {
    const oid = window.location.pathname.match(/\/detail\/(.+?)\//)
    const content = document.createRange().createContextualFragment(`
    <a href="https://research.jcu.edu.au/data/default/rdmp/legacy/record/${oid[1]}/"
       target="_blank"
       style="float: right; border: 1px solid #06c; border-radius: 5px; padding: 3px; background: #fff; font-size: 1rem; color: #06c;">
       Go to record on Research Data JCU
    </a>
    <a href="/researchdata/verNum1.9/default/download/${oid[1]}/rif.xml"
       target="_blank"
       style="float: right; margin-right: 0.5rem; border: 1px solid #666; border-radius: 5px; padding: 3px; background: #fff; font-size: 1rem; color: #666;">
       View rif.xml
    </a>
    `)
    document.querySelector('#page-heading').appendChild(content)
  }
})()
