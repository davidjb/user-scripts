// ==UserScript==
// @name         JCU - Readable Leave Balances
// @version      1.0.0
// @description  Make HR system leave balances human-readable
// @author       davidjb
// @grant        none
// @match        https://myhronline.jcu.edu.au/*
// ==/UserScript==

(function() {
  'use strict'

  function main(frame) {
    const document = frame.contentDocument
    document
      .querySelectorAll('[summary="Leave Balances"] tr')
      .forEach(row => {
        if (row.children.length === 7) {
          const value = Number.parseFloat(row.children[4].textContent)
          if (!isNaN(value)) {
            const unit = row.children[6].textContent
            const outputCell = document.createElement('td')
            outputCell.style.paddingLeft = '1rem'
            outputCell.style.fontFamily = 'Arial'
            outputCell.style.fontWeight = 'bold'

            if (unit.match(/hours/i)) {
              outputCell.innerHTML = `${(value / 36.25).toFixed(1)} weeks (${(value / 7.25).toFixed(1)} days)`
            } else if (unit.match(/days/i)) {
              outputCell.innerHTML = `${(value / 5).toFixed(1)} weeks`
            }
            row.appendChild(outputCell)
          }
        }
      })
  }

  window.setTimeout(() => document.querySelectorAll('iframe').forEach(main), 2000)
})()
