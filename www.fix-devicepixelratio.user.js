// ==UserScript==
// @name         Correct devicePixelRatio
// @version      1.0.0
// @description  Set devicePixelRatio correctly
// @author       davidjb
// @match        https://app.circleci.com/pipelines/*
// @match        https://docs.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict'
    window.devicePixelRatio = 2
})()
