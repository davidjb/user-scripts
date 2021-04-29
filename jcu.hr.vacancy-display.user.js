// ==UserScript==
// @name         JCU - HR - Vacancy Display Helpers
// @version      2.0.0
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

  const applicantDocuments = document.querySelector('[summary="Attached Documents"]')
  if (applicantDocuments) {
    document.querySelectorAll('[summary="Attached Documents"] a').forEach(link => {
      link.target = '_blank'
      link.rel = 'noreferrer noopener'
      // Set the download filename to what the user provided
      link.download = link.innerHTML.split('/').slice(-1)
    })

    const downloadAll = document.createElement('a')
    downloadAll.innerHTML = 'Download all documents'
    downloadAll.href = '#'
    downloadAll.style.fontFamily = 'Arial'
    downloadAll.style.fontWeight = 'bold'
    downloadAll.style.color = 'blue'
    downloadAll.style.marginTop = '1rem'
    downloadAll.style.marginBottom = '1rem'
    downloadAll.onclick = () => document.querySelectorAll('[summary="Attached Documents"] a').forEach(link => link.click())
    applicantDocuments.after(downloadAll)
  }
})()
