//check if a site is in the blocklist
function isBlockedSite(url) {
    return new Promise((resolve) => {
        chrome.storage.sync.get('blocklist', (data) => {
            const { blocklist } = data;
            const blocked = blocklist.some((site) => url.startsWith(site));
            resolve(blocked);
        });
    });
}

// redirect to the blocked page
function redirectToBlocked(tabId) {
    const redirectUrl = chrome.runtime.getURL('blocked.html');
    chrome.tabs.update(tabId, { url: redirectUrl });
}

//listener for onBeforeNavigate events to check if the site is blocked
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    const { url, tabId } = details;
    isBlockedSite(url).then((blocked) => {
        if (blocked) {
            // block the navigation to the blocked site and redirect to the blocked page
            chrome.webNavigation.onCompleted.addListener(function onCompletedListener(details) {
                if (details.tabId === tabId && details.url === url) {
                    chrome.webNavigation.onCompleted.removeListener(onCompletedListener);
                    redirectToBlocked(tabId);
                }
            });
        }
    });
});
