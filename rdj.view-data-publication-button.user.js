// ==UserScript==
// @name     Research Data JCU - Add Data Publication Button
// @version  1.0
// @grant    none
// @match    https://research.jcu.edu.au/data/published/*
// ==/UserScript==

const header = document.querySelector('.h1-header')
const link = document.createElement('a')
link.className = 'btn btn-primary m-y-1'
link.href = window.location.href.replace('/published/', '/default/rdmp/record/view/')
link.innerHTML = 'View Data Publication'
header.parentElement.parentElement.appendChild(link)
