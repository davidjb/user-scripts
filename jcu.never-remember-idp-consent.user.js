// ==UserScript==
// @name     JCU - Never Remember IDP Consent
// @version  1.0.1
// @grant    none
// @match    https://idp.jcu.edu.au/*
// @match    https://idp-test.jcu.edu.au/*
// ==/UserScript==

(function() {
  'use strict'

  document.querySelectorAll('#_shib_idp_doNotRememberConsent').forEach(el => el.click())
})()
