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


//Notification

// Function to show the desktop notification with text and image
function showNotification() {
    const popupMessages = [
        {
            text: "It's okay, just have fun",
            imageUrl: "https://pbs.twimg.com/media/EwGvJq0WQAI61HI.jpg"
        },
        {
            text: "Stay focused and conquer distractions!",
            imageUrl: "https://project-static-assets.s3.amazonaws.com/APISpreadsheets/APIMemes/WhyDidServerCross.png"
        },

    ];

    const randomIndex = Math.floor(Math.random() * popupMessages.length);
    const message = popupMessages[randomIndex];

    // Create the desktop notification
    chrome.notifications.create({
        type: 'image',
        iconUrl: './icons/icon128.png',
        title: 'ProcrastiNope',
        message: message.text,
        imageUrl: message.imageUrl,
    });
}

chrome.alarms.create('notificationAlarm', { periodInMinutes: 5 / 60 }); // 5 seconds

// Add a listener to handle the alarm trigger
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'notificationAlarm') {
        showNotification();
    }
});
