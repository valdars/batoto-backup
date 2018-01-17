// compatibility for chrome
if (!window.browser) {
    browser = chrome;
}

var output = document.getElementById('output');
var testLink = document.createElement('a');
var errorContainer = document.getElementById('errorContainer');
var errorContent = document.getElementById('errorContent');

function backupTabs() {
    chrome.tabs.query({}, function (tabs) {
        let titles = tabs
            .filter(x => isBatotoManga(x.url))
            .map(x => x.title);
        addTitles(titles, '== Tabs ==');
    });
}

function backupBookmarks() {
    chrome.bookmarks.search({}, function (bookmarks) {
        let titles = bookmarks
            .filter(x => isBatotoManga(x.url))
            .map(x => x.title);
        addTitles(titles, '== Bookmarks ==');
    });
}

function backupFollows() {
    // use XMLHttpRequest to get follows from official export link
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.addEventListener("load", function () {
        if (this.status != 200) {
            error(`Unable to get follows list. Are you logged in and bybassed Cloudflare?`);
        } else {
            let titles = JSON.parse(this.responseText)
                .map(x => x.title);
            addTitles(titles, '== Follows ==');
        }
    });
    request.open("GET", "https://bato.to/follows_export?method=json");
    request.send();
}

// check if given url belongs to Batoto manga (reader and manga frontpage)
function isBatotoManga(url) {
    testLink.setAttribute('href', url);
    if (testLink.hostname !== 'bato.to') {
        return false;
    }
    if (testLink.pathname == '/reader') {
        return true;
    }
    if (testLink.pathname.startsWith('/comic/_/comics/') && testLink.pathname.length > 16) {
        return true;
    }
    return false;
}

// add gives array of manga titles with given title as header to textarea
function addTitles(titles, title) {
    titles.unshift(title);
    output.append(document.createTextNode(titles.join("\n") + "\n"));
}

function error(message) {
    errorContent.textContent = message;
    errorContainer.classList.remove('is-hidden');
}

function closeError() {
    errorContainer.classList.add('is-hidden');
}

document.getElementById('btnBackupBookmarks').addEventListener('click', backupBookmarks);
document.getElementById('btnBackupTabs').addEventListener('click', backupTabs);
document.getElementById('btnBackupFollows').addEventListener('click', backupFollows);
document.getElementById('btnCloseError').addEventListener('click', closeError);