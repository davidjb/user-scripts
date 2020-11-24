// ==UserScript==
// @name     JCU - Never Remember IDP Consent
// @version  1.0
// @grant    none
// @match    https://idp.jcu.edu.au/*
// ==/UserScript==

document.querySelector('#_shib_idp_doNotRememberConsent').click()
