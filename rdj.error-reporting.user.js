// ==UserScript==
// @name         Research Data JCU - Error Reporting
// @version      1.2.0
// @description  Add visible error reporting Research Data JCU
// @author       davidjb
// @grant        none
// @match        https://research.jcu.edu.au/data/*
// ==/UserScript==
//
/* global $ */

(function() {
  'use strict'

  // Fetch polyfill: https://github.com/developit/unfetch
  // eslint-disable-next-line
  self.fetch||(self.fetch=function(e,n){return n=n||{},new Promise(function(t,s){var r=new XMLHttpRequest,o=[],u=[],i={},a=function(){return{ok:2==(r.status/100|0),statusText:r.statusText,status:r.status,url:r.responseURL,text:function(){return Promise.resolve(r.responseText)},json:function(){return Promise.resolve(r.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([r.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return u},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}};for(var c in r.open(n.method||"get",e,!0),r.onload=function(){r.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(e,n,t){o.push(n=n.toLowerCase()),u.push([n,t]),i[n]=i[n]?i[n]+","+t:t}),t(a())},r.onerror=s,r.withCredentials="include"==n.credentials,n.headers)r.setRequestHeader(c,n.headers[c]);r.send(n.body||null)})});

  //const CANARY_URL = 'https://research.jcu.edu.au/data/default/rdmp/listRecords?recordType=dataPublication&start=0&rows=1'
  const CANARY_URL = 'https://research.jcu.edu.au/data/offline'

  function displayErrorModal(response) {
    document.body.appendChild(document.createRange().createContextualFragment(`
    <div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="errorModalLabel">Research Data JCU is currently unavailable</h4>
          </div>
          <div class="modal-body">
            <p>We're currently experiencing a systems-related technical issue; it’s not your computer or your internet connection. Please wait a few moments and try <a href="javascript:window.location.reload();">reloading the page</a>.</p>
            <p>If you continue to receive this message, you can review <a href="https://www.jcu.edu.au/information-and-communications-technology/stay-informed/bulletins" target="_blank">current IT systems bulletins <i class="fa fa-external-link" aria-label="Opens in new window"></i></a> to check if this system is undergoing maintenance.</p>
            <p>Otherwise, please contact the <a href="https://libguides.jcu.edu.au/rdm-toolkit/help-training" target="_blank">Research Data JCU team <i class="fa fa-external-link" aria-label="Opens in new window"></i></a>. Let us know what you were trying to do, as well as the technical details below, and we can help you further.</p>
            <p>Sorry for the inconvenience.</p>
            <h5 class="p-t-1" style="border-top: 1px solid #ccc;">Technical Details</h5>
            <dl>
              <dt>Date and Time</dt>
              <dd><code>${new Date()}</code></dd>
              <dt>Error</dt>
              <dd><code>${response.status} (${response.statusText})</code></dd>
              <dt>URLs</dt>
              <dd><code>${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}</code><br><code>${CANARY_URL}</code></dd>
              <dt>Browser</dt>
              <dd><code>${navigator.userAgent}</code></dd>
            </dl>
          </div>
          <div class="modal-footer">
            <a class="btn btn-primary" href="https://libguides.jcu.edu.au/rdm-toolkit/help-training" target="_blank">Contact our team <i class="fa fa-external-link" aria-label="Opens in new window"></i></a>
          </div>
        </div>
      </div>
  </div>
    `))

    $('#errorModal').modal('show')
  }

  fetch(CANARY_URL, {headers: {'X-Source': 'jsclient'}})
    .then(response => {
      if (response.ok) {
        return Promise.all([
          response,
          response.json()
        ])
      }

      // Error handling for complete system outages
      // 400 Bad Requests as per https://trello.com/c/RThMu2bl/77-redbox-crash-error-occurred-in-session-middleware-mongoerror-topology-was-destroyed
      // 50x server errors
      displayErrorModal(response)

      return Promise.reject(response.statusText)
    })
    .then(([
      response,
      data
    ]) => {
      // Error handling for partial system outages
      // See https://trello.com/c/tNsdDZYR/110-visibly-display-or-report-api-errors-in-browser
      // Error: 200 response with JSON body of {"status":false,"message":"Error: getaddrinfo ENOTFOUND redbox"}
      // Okay: {"noItems": 1}
      if (data.status === false || typeof data.noItems === 'undefined') {
        displayErrorModal({
          status: response.status,
          statusText: data.message
        })
      }
    })
    .catch(error => displayErrorModal(error))
})()
