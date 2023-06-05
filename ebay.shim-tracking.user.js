// ==UserScript==
// @name         eBay - Fake Beacon Sender
// @version      1.0.0
// @description  Fake out the eBay JS API
// @author       davidjb
// @grant        none
// @match        https://www.ebay.com.au/*
// ==/UserScript==
(function() {
    'use strict'
    window.navigator.sendBeacon = () => {}
})()
