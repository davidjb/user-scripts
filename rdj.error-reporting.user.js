// ==UserScript==
// @name         Research Data JCU - Error Reporting
// @version      1.7.0
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

  //const CANARY_URL = 'https://research.jcu.edu.au/data/default/rdmp/listRecords?diviner&recordType=dataPublication&start=0&rows=1'
  const CANARY_URL = 'https://research.jcu.edu.au/data/offline?diviner'
  let intervalId

  function displayErrorModal(response) {
    if (intervalId) {
      clearInterval(intervalId)
    }

    if (!document.querySelector('#errorModal')) {
      const errorReportSubject = '[Research Data JCU] System Issue Report'
      const errorReport = `[Add any information here to your report: what were you trying to do; can you reproduce the issue? Attach any screenshots to this email]


==== Technical Details ====

Date and Time:
    ${new Date()}
Error:
    ${response.status} (${response.statusText})
URLs:
    ${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}
    ${CANARY_URL}
Browser:
    ${navigator.userAgent}
`
      const emailReportLink = `mailto:researchdata@jcu.edu.au?subject=${errorReportSubject}&body=${encodeURIComponent(errorReport)}`

      document.body.appendChild(document.createRange().createContextualFragment(`
      <div class="modal fade" id="rdjSystemErrorModal" tabindex="-1" role="dialog" aria-labelledby="rdjSystemErrorModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" id="rdjSystemErrorModalClose" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="rdjSystemErrorModalLabel">Research Data JCU encountered a problem</h4>
            </div>
            <div class="modal-body">
              <p>We have encountered a systems-related technical issue; it’s not your computer or your internet connection.</p>
              <p class="p-y-1" style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; background: #f3f3f3; margin-left: -15px; margin-right: -15px; padding-left: 15px; padding-right: 15px;">If you were entering data into a form, please manually take a copy of this data to your local device (such as into a program like Microsoft Word). Once you've done so, reloading the page may resolve the issue.</p>
              <p>If you continue to receive this message, please report the issue to Research Data JCU team below so that we can investigate. Doing so will send us technical details about the issue, your browser and the URL you were on.</p>
              <p>Sorry for the inconvenience.</p>
            </div>
            <div class="modal-footer">
              <a class="btn btn-primary" href="${emailReportLink}" target="_blank">Contact our team <i class="fa fa-external-link" aria-label="Opens in new window"></i></a>
            </div>
          </div>
        </div>
      </div>
      `))
      $('#rdjSystemErrorModal').modal('show')
    }
  }

  function checkSystemStatus() {
    fetch(`${CANARY_URL}&ts=${new Date().getTime()}`, {headers: {'X-Source': 'jsclient'}})
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
  }

  // Check on initial page load and every 5m
  checkSystemStatus()
  intervalId = setInterval(checkSystemStatus, 5*60*1000)
})()
