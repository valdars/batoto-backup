// compatibility for chrome
if(!window.browser) {
  browser = chrome;
}

function openMyPage() {
  browser.tabs.create({
    "url": "/backup.html"
  });
}

/*
Add openMyPage() as a listener to clicks on the browser action.
Browser.browserAction seems to be undefined randomly
*/
browser.browserAction.onClicked.addListener(openMyPage);