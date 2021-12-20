// ==UserScript==
// @name         QLD Government - Filter COVID Exposure
// @version      1.0.0
// @description  Only displays relevant data on the contact tracing website
// @author       davidjb
// @grant        none
// @match        https://www.qld.gov.au/health/conditions/health-alerts/coronavirus-covid-19/current-status/contact-tracing
// ==/UserScript==

(function() {
    'use strict';

    // Naïvely assume the first table on the page is Queensland
    let table = document.querySelector('table')
    let rows = Array.from(table.querySelectorAll('tbody tr'))

    // Filter non-Townsville rows
    rows
        .filter(row => {
          let suburb = decodeURIComponent(row.dataset.suburb)
          return !(suburb.match(/Townsville/i) || row.dataset.lgas === 'QLD142')
        })
        .forEach(row => { row.remove() })
        //.forEach(row => { row.hidden = true })

    // Display date added
    let heading = document.createElement('th')
    heading.textContent = 'Added'
    table.querySelector('thead tr').appendChild(heading)
    rows.forEach(row => {
      let cell = document.createElement('td')
      cell.textContent = row.dataset.added.replace('T', ' ')
      row.appendChild(cell)
    })

    // Scroll to the table
    table.scrollIntoView()
})();
