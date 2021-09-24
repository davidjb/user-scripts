// ==UserScript==
// @name         Research Data JCU - Add Record Helpers
// @version      1.15.0
// @description  Add various helpers and information to pages within Research Data JCU
// @author       davidjb
// @grant        none
// @match        https://research.jcu.edu.au/data/*
// @match        https://prod-jcu.redboxresearchdata.com.au/*
// @match        https://test-jcu.redboxresearchdata.com.au/*
// ==/UserScript==

(function() {
  'use strict'

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const isProduction = window.location.hostname === 'research.jcu.edu.au'

  function typeDisplay(type) {
    return type === 'rdmp' ? 'RDMP' :
      type === 'dataRecord' ? 'Data Record' :
      type === 'dataPublication' ? 'Data Publication' :
      type
  }

  function template(content, alertType) {
    const type = alertType || 'info'
    return `
    <div class="container m-y-1">
      <div class="row">
        <div class="col-xs-12 alert alert-${type}">
          ${content}
        </div>
      </div>
    </div>`
  }

  if (window.location.pathname.startsWith('/data/published')) {
    const oid = window.location.pathname.match(/\/published\/([a-f0-9]+)/)
    let section

    // Real pages
    section = document.querySelector('.maincontent-body')
    if (section) {
      section.prepend(
        document.createRange().createContextualFragment(template(`
        <a class="btn btn-primary"
          href="${baseUrl}/data/default/rdmp/record/view/${oid[1]}/">View Data Publication</a>
        ${!isProduction ?
          `<a class="btn btn-success" target="_blank" rel="noreferrer noopener"
            href="https://research.jcu.edu.au/data/published/${oid[1]}/">See live</a>` : ''}
        <a class="btn btn-secondary m-r-1"
          href="${baseUrl}/data/published/${oid[1]}/rif.xml">rif.xml</a>
        <ul class="list-inline" style="display: inline-block;">
          <li class="list-inline-item"><strong>Type:</strong> Data Publication (Landing page)</li>
          <li class="list-inline-item bg-success"><strong>Status:</strong> Published</li>
        </ul>
        `))
      )
    }

    // 404 pages, but they might not be!
    section = document.querySelector('.site-research-data.section-A_404 #main')
    if (section) {
      section.prepend(
        document.createRange().createContextualFragment(template(`
        <a class="btn btn-primary pull-xs-left m-r-1"
          href="${baseUrl}/data/default/rdmp/record/view/${oid[1]}/">Try Viewing Data Publication</a>
          Hey admin! This is a 404 page, so either the record is embargoed, landing page doesn't yet exist, or it's a bug.
          Click the button to find out which it is!
        `))
      )
    }
  }

  if (window.location.pathname.startsWith('/data/default/rdmp/legacy/record/')) {
    const oid = window.location.pathname.match(/\/record\/([a-z0-9]+)/)

    // 404 pages, but they might not be!
    const section = document.querySelector('.site-research-data.section-A_404 #main')
    if (section) {
      section.prepend(
        document.createRange().createContextualFragment(template(`
        <a class="btn btn-primary pull-xs-left m-r-1"
          href="https://eresearch.jcu.edu.au/researchdata/default/search?query=${oid[1]}">Try searching in ReDBox v1.9</a>
          Hey admin! This is a legacy 404 page, so this record doesn't exist in Research Data JCU.
          You can try searching the old v1.9 system to find this object ID by clicking the button.
        `))
      )
    }
  }

  if (window.location.pathname.startsWith('/data/default/rdmp/dashboard/')) {
    const type = window.location.pathname.match(/\/dashboard\/([A-z]+)/)

    fetch(`${baseUrl}/data/default/rdmp/listRecords?recordType=${type[1]}&start=0&rows=1`, {
      headers: {'X-Source': 'jsclient'}
    })
      .then(response => response.json())
      .then(data => {
        const mainContent = document.querySelector('.maincontent-body')

        // Interesting stats
        if (data.totalItems) {
          mainContent.prepend(
            document.createRange().createContextualFragment(template(`
            <strong>Total ${typeDisplay(type[1])}s:</strong> ${data.totalItems}
            `))
          )
        }

        // Error handling
        // Error: {"status":false,"message":"Error: getaddrinfo ENOTFOUND redbox"}
        // Okay: {"noItems": 1}
        if (data.status === false || typeof data.noItems === 'undefined') {
          mainContent.prepend(
            document.createRange().createContextualFragment(template(`
            We encountered a problem loading data on this page: ${JSON.stringify(data)}
            `, 'danger'))
          )
        }
      })
  }

  const form = document.querySelector('dmp-form')
  const oid = form && form.getAttribute('oid')
  if (oid) {
    Promise.all([
      fetch(`${baseUrl}/data/default/rdmp/record/form/auto/${oid}`, {
        headers: {'X-Source': 'jsclient'}
      })
        .then(response => response.json()),
      fetch(`${baseUrl}/data/default/rdmp/api/records/metadata/${oid}`)
        .then(response => response.json())
    ])
    .then(([
      formApiData,
      data
    ]) => {
      if (formApiData.status === false || data.status === false) {
        return
      }

      // Type and Status are not in the record API; cannot be intuited reliably
      const {type} = formApiData
      const status_match = formApiData.name.match(/.+-(.+?)$/)
      const status = status_match ? (status_match[1].charAt(0).toUpperCase() + status_match[1].substr(1).toLowerCase()) : null
      const is_published = status === 'Published'
      let status_class
      switch (status) {
        case 'Published':
          status_class = 'bg-success'
          break
        case 'Draft':
          status_class = 'bg-danger'
          break
        case 'Embargoed':
          status_class = 'jcu-bg--orange'
          break
        case 'Queued':
          status_class = 'jcu-bg--gray-light'
          break
        default:
          status_class = ''
          break
      }

      const content = document.createRange().createContextualFragment(template(`
        <span class="m-r-1">
          ${window.location.pathname.startsWith('/data/default/rdmp/record/edit/') ?
              `<a class="btn btn-primary"
                href="${baseUrl}/data/default/rdmp/record/view/${oid}/">◀ Back to View</a>` : ''}
          ${(type === 'dataPublication' && is_published) ?
              `<a class="btn btn-primary"
                href="${baseUrl}/data/published/${oid}/">See Published Page</a>` : ''}
          ${data.rdmp && data.rdmp.oid ?
              `<a class="btn btn-secondary"
                href="${baseUrl}/data/default/rdmp/record/view/${data.rdmp.oid}/" title="RDMP: ${data.rdmp.title}">View Related RDMP</a>` : ''}
          ${data.dataRecord && data.dataRecord.oid ?
              `<a class="btn btn-secondary"
                href="${baseUrl}/data/default/rdmp/record/view/${data.dataRecord.oid}/" title="Data Record: ${data.dataRecord.title}">View Related Data Record</a>` : ''}
          ${(type === 'dataPublication' && is_published) ?
              `<a class="btn btn-secondary"
                href="${baseUrl}/data/published/${oid}/rif.xml">rif.xml</a>` : ''}
          ${!isProduction ?
              `<a class="btn btn-success" target="_blank" rel="noreferrer noopener"
                href="https://research.jcu.edu.au/data/default/rdmp/record/view/${oid}/">See live</a>` : ''}
          ${data.legacyId ?
              `<a class="btn btn-danger" target="_blank" rel="noreferrer noopener"
                href="https://eresearch.jcu.edu.au/researchdata/published/detail/${data.legacyId}/">See in v1.9</a>` : ''}
          <a class="btn btn-secondary" href="${baseUrl}/data/default/rdmp/api/records/metadata/${oid}" target="_blank">Raw JSON</a>
        </span>
        <ul class="list-inline" style="display: inline-block;">
          <li class="list-inline-item"><strong>Type:</strong> ${typeDisplay(type)}</li>
          ${type === 'dataPublication' ? `<li class="list-inline-item ${status_class}"><strong>Status:</strong> ${status}</li>`: ''}
        </ul>
      `))
      document.querySelector('.maincontent-body').prepend(content)
    })
  }
})()
