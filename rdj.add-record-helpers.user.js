// ==UserScript==
// @name     Research Data JCU - Add Record Helpers
// @version  1.1
// @grant    none
// @match    https://research.jcu.edu.au/data/*
// ==/UserScript==

// TODO: make page <title> useful

(function() {
  'use strict'

  function template(content) {
    return `
    <div class="container m-b-1">
      <div class="row">
        <div class="col-xs-12 alert alert-success">
          ${content}
        </div>
      </div>
    </div>`
  }

  const header = document.querySelector('.h1-header')

  if (window.location.pathname.startsWith('/data/published')) {
    const oid = window.location.pathname.match(/\/published\/(.*?)\//)
    const content = document.createRange().createContextualFragment(template(`
      <a class="btn btn-primary m-r-1"
        href="https://research.jcu.edu.au/data/default/rdmp/record/view/${oid[1]}/">View Data Publication</a>
      <strong>Type:</strong> Data Publication (Landing page)
    `))
    document.querySelector('.maincontent-body').prepend(content)
  }

  const form = document.querySelector('dmp-form')
  const oid = form && form.getAttribute('oid')
  if (oid) {
    const response = fetch(`https://research.jcu.edu.au/data/default/rdmp/record/form/auto/${oid}`, {
      headers: {'X-Source': 'jsclient'}
    })
      .then(response => response.json())
      .then(data => {
        const type = data.type === 'rdmp' ? 'RDMP' :
          data.type === 'dataRecord' ? 'Data Record' :
          data.type === 'dataPublication' ? 'Data Publication' :
          data.type
        const data_str = JSON.stringify(data)
        const related_data_record_oid = data_str.match(/"oid":"(.*?)"/)
        const is_published = !!data_str.match(/"value":"https:\/\/research.jcu.edu.au\/data\/published\/(.*?)"/)

        const content = document.createRange().createContextualFragment(template(`
          ${window.location.pathname.startsWith('/data/default/rdmp/record/edit/') ?
              `<a class="btn btn-primary m-r-1"
                href="https://research.jcu.edu.au/data/default/rdmp/record/view/${oid}/">◀ Back to View</a>` : ''}
          ${(data.type === 'dataPublication' && is_published) ? 
              `<a class="btn btn-info m-r-1"
                href="https://research.jcu.edu.au/data/published/${oid}/">See Landing Page</a>` : ''}
          ${(data.type === 'dataPublication' && related_data_record_oid) ?
              `<a class="btn btn-secondary m-r-1"
                href="https://research.jcu.edu.au/data/default/rdmp/record/view/${related_data_record_oid[1]}/">View Related Data Record</a>` : ''}
          <ul class="list-inline" style="display: inline-block;">
            <li class="list-inline-item"><strong>Type:</strong> ${type}</li>
            <li class="list-inline-item"><strong>Last Modified:</strong> ${data.updatedAt}</li>
            <li class="list-inline-item"><strong>Created:</strong> ${data.createdAt}</li>
          </ul>
        `))
        document.querySelector('.maincontent-body').prepend(content)
      })
  }
})()
