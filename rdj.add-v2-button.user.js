// ==UserScript==
// @name     Research Data JCU - Add v2 Record Button
// @version  1.0
// @grant    none
// @match    https://research.jcu.edu.au/researchdata/*
// ==/UserScript==

(function() {
  'use strict'

  if (window.location.pathname.startsWith('/researchdata/published/detail') || window.location.pathname.startsWith('/researchdata/default/detail')) {
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
