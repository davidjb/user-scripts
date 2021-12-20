// ==UserScript==
// @name         QLD Government - Filter COVID Exposure
// @version      1.1.0
// @description  Only displays relevant data on the contact tracing website
// @author       davidjb
// @grant        none
// @match        https://www.qld.gov.au/health/conditions/health-alerts/coronavirus-covid-19/current-status/contact-tracing
// ==/UserScript==

(function() {
    'use strict';

    const CITY = 'Townsville'
    const LGA = 'QLD142'

    // Naïvely assume the first table on the page is Queensland
    let table = document.querySelector('table')
    let rows = Array.from(table.querySelectorAll('tbody tr'))

    // Filter non-Townsville rows
    rows
        .filter(row => {
          let suburb = decodeURIComponent(row.dataset.suburb)
          return !(suburb.match(RegExp(CITY, 'i')) || row.dataset.lgas === LGA)
        })
        .forEach(row => { row.remove() })
        //.forEach(row => { row.hidden = true })

    // Display date added
    table.querySelector('thead tr').appendChild(
      document.createRange().createContextualFragment('<th>Added</th>')
    )
    rows.forEach(row => {
      row.appendChild(
        document.createRange().createContextualFragment(`
          <td>${row.dataset.added.replace('T', ' ')}</td>
        `)
      )
    })

    // Add visible info to page
    document.body.prepend(document.createRange().createContextualFragment(`
      <div style="position: fixed; z-index: 1; padding: 1rem; background: #c5dcff;">
        Showing only data from ${CITY} LGA.<br>
        Disable script to see all.
      </div>
    `))

    // Scroll to the table
    table.scrollIntoView()
})();
