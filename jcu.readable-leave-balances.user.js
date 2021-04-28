// ==UserScript==
// @name         JCU - Readable Leave Balances
// @version      1.2.0
// @description  Make HR system leave balances human-readable
// @author       davidjb
// @grant        none
// @match        https://myhronline.jcu.edu.au/*
// ==/UserScript==

(function() {
  'use strict'

  const rows = document.querySelectorAll('[summary="Leave Balances"] tr')
  rows
    .forEach(row => {
      if (row.children.length === 7) {
        const type = row.children[0].textContent
        const value = Number.parseFloat(row.children[4].textContent)
        if (!isNaN(value)) {
          const unit = row.children[6].textContent
          const outputCell = document.createElement('td')
          outputCell.style.fontFamily = 'Arial'
          outputCell.style.fontWeight = 'bold'
          outputCell.style.whiteSpace = 'nowrap'
          outputCell.style.verticalAlign = 'middle'

          if (unit.match(/hours/i)) {
            outputCell.innerHTML = `${(value / 36.25).toFixed(1)} weeks (${(value / 7.25).toFixed(1)} days)`
          } else if (unit.match(/days/i)) {
            outputCell.innerHTML = `${(value / 5).toFixed(1)} weeks`
          }
          row.appendChild(outputCell)

          const maximumCell = document.createElement('td')
          maximumCell.style.fontFamily = 'Arial'
          maximumCell.style.whiteSpace = 'nowrap'
          maximumCell.style.verticalAlign = 'middle'
          maximumCell.style.backgroundColor = 'pink'
          if (type === 'Annual Leave') {
            maximumCell.innerHTML = 'Max: 45 days'
          } else if (type === 'Long Service Leave') {
            maximumCell.innerHTML = 'Max: 15 weeks'
          }
          if (maximumCell.innerHTML) {
            row.appendChild(maximumCell)
          }
        }
      }
    })
})()
