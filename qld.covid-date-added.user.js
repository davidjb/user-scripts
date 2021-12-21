// ==UserScript==
// @name         QLD Government - Display extra data
// @version      1.0.0
// @description  Display extra data on the QLD Government COVID exposures table
// @author       davidjb
// @grant        none
// @match        https://www.qld.gov.au/health/conditions/health-alerts/coronavirus-covid-19/current-status/contact-tracing
// ==/UserScript==

(function() {
  'use strict'

  document.querySelectorAll('thead tr').forEach(row => {
    let heading = document.createElement('th')
    heading.textContent = 'Added'
    row.appendChild(heading)
  })
  document.querySelectorAll('tbody tr').forEach(row => {
    let cell = document.createElement('td')
    cell.textContent = row.dataset.added.replace('T', ' ')
    row.appendChild(cell)
  })
})()
