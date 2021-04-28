// ==UserScript==
// @name         JCU - Vacancy Display Helpers
// @version      1.0.0
// @description  Add helpers to the vacancy display within MyHROnline
// @author       davidjb
// @grant        none
// @match        https://myhronline.jcu.edu.au/*
// ==/UserScript==

(function() {
  'use strict'

  const rows = document.querySelectorAll('[summary="Vacancy Information"] tr')
  rows
    .forEach(row => {
      if (row.children[0].textContent.search(/Reference Number/i) !== -1) {
        const vacancy = row.children[1].textContent
        row.children[1].innerHTML += ` (<a target="_blank" style="font-weight: bold;" href="https://myhronline.jcu.edu.au/ords/hrprodords/WK8227$VDC1.Startup?P_VACANCY_REF_NO=${vacancy}">Position Documents</a>)`
      }
    })
})()
