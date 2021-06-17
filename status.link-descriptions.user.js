// ==UserScript==
// @name         status.jcu.io - Create links to URLs within test descriptions
// @version      1.0.0
// @description  Remove the need to copy and paste URLs that are being tested in Cabot
// @author       davidjb
// @grant        none
// @match        https://status.jcu.io/*
// @match        https://status-cloud.jcu.io/*
// ==/UserScript==

(function () {
  "use strict"

  // From https://www.urlregex.com/
  const urlRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
  document
    .querySelectorAll('td[title=""]')
    .forEach(
      (e) =>
        (e.innerHTML = e.innerHTML.replace(
          urlRegex,
          (match) => {
            const url = match.match(/(?<url>.*?);?$/).groups.url
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a> ↗️;`
          }
        ))
    )
})()
