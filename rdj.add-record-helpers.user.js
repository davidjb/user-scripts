// ==UserScript==
// @name         Research Data JCU - Add Record Helpers
// @version      1.5.3
// @description  Add various helpers and information to pages within Research Data JCU
// @author       davidjb
// @grant        none
// @match        https://research.jcu.edu.au/data/*
// ==/UserScript==

// TODO: make page <title> useful

(function() {
  'use strict'

  function template(content) {
    return `
    <div class="container m-y-1">
      <div class="row">
        <div class="col-xs-12 alert alert-info">
          ${content}
        </div>
      </div>
    </div>`
  }

  if (window.location.pathname.startsWith('/data/published')) {
    const oid = window.location.pathname.match(/\/published\/([a-z0-9]+)/)
    let section

    // Real pages
    section = document.querySelector('.maincontent-body')
    if (section) {
      section.prepend(
        document.createRange().createContextualFragment(template(`
        <a class="btn btn-primary m-r-1"
          href="https://research.jcu.edu.au/data/default/rdmp/record/view/${oid[1]}/">View Data Publication</a>
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
          href="https://research.jcu.edu.au/data/default/rdmp/record/view/${oid[1]}/">Try Viewing Data Publication</a>
          Hey admin! This is a 404 page, so either the record is embargoed, landing page doesn't yet exist, or it's a bug.
          Click the button to find out which it is!
        `))
      )
    }
  }

  const form = document.querySelector('dmp-form')
  const oid = form && form.getAttribute('oid')
  if (oid) {
    fetch(`https://research.jcu.edu.au/data/default/rdmp/record/form/auto/${oid}`, {
      headers: {'X-Source': 'jsclient'}
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === false) {
          return
        }

        const type = data.type === 'rdmp' ? 'RDMP' :
          data.type === 'dataRecord' ? 'Data Record' :
          data.type === 'dataPublication' ? 'Data Publication' :
          data.type
        const data_str = JSON.stringify(data)
        const related_data_record_oid = data_str.match(/"oid":"(.+?)"/)
        const is_published = !!data_str.match(/"value":"https:\/\/research.jcu.edu.au\/data\/published\/(.+?)"/)
        const status_match = data.name.match(/.+-(.+?)$/)
        const status = status_match ? (status_match[1].charAt(0).toUpperCase() + status_match[1].substr(1).toLowerCase()) : null
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
          ${window.location.pathname.startsWith('/data/default/rdmp/record/edit/') ?
              `<a class="btn btn-primary m-r-1"
                href="https://research.jcu.edu.au/data/default/rdmp/record/view/${oid}/">◀ Back to View</a>` : ''}
          ${(data.type === 'dataPublication' && is_published) ?
              `<a class="btn btn-success m-r-1"
                href="https://research.jcu.edu.au/data/published/${oid}/">See Published Page</a>` : ''}
          ${(data.type === 'dataPublication' && related_data_record_oid) ?
              `<a class="btn btn-secondary m-r-1"
                href="https://research.jcu.edu.au/data/default/rdmp/record/view/${related_data_record_oid[1]}/">View Related Data Record</a>` : ''}
          <ul class="list-inline" style="display: inline-block;">
            <li class="list-inline-item"><strong>Type:</strong> ${type}</li>
            ${data.type === 'dataPublication' ? `<li class="list-inline-item ${status_class}"><strong>Status:</strong> ${status}</li>`: ''}
          </ul>
        `))
        document.querySelector('.maincontent-body').prepend(content)
      })
  }
})()
