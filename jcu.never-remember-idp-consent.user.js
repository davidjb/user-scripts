// ==UserScript==
// @name     JCU - Never Remember IDP Consent
// @version  1.0
// @grant    none
// @match    https://idp.jcu.edu.au/*
// @match    https://idp-test.jcu.edu.au/*
// ==/UserScript==

document.querySelectorAll('#_shib_idp_doNotRememberConsent').forEach(e => e.click())
