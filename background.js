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
            text: "Just Keep Coding",
            imageUrl: "https://pbs.twimg.com/media/EwGvJq0WQAI61HI.jpg"
        },
        {
            text: "No Bugs, Only Features",
            imageUrl: "https://i.imgflip.com/5k15th.jpg"
        },
        {
            text: "Debugging Time!",
            imageUrl: "https://i.imgflip.com/1wnc14.jpg"
        },
        {
            text: "Mission Accomplished",
            imageUrl: "https://i.imgflip.com/5ymyt4.jpg"
        },
        {
            text: "It Works!",
            imageUrl: "https://i.imgflip.com/7tbmy3.jpg"
        },
        {
            text: "No Errors Found",
            imageUrl: "https://i.imgflip.com/7axmy9.jpg"
        },
        {
            text: "Deleted Production Data",
            imageUrl: "https://i.imgflip.com/593suk.jpg"
        },
        {
            text: "Code Compiles!",
            imageUrl: "https://i.imgflip.com/5q0fne.jpg"
        },
        {
            text: "Ready for Deployment",
            imageUrl: "https://i.imgflip.com/7se9qk.jpg"
        },
        {
            text: "Finding That Bug",
            imageUrl: "https://i.imgflip.com/7rr99o.jpg"
        },
        {
            text: "Coding in Progress",
            imageUrl: "https://i.imgflip.com/7ofm85.jpg"
        },
        {
            text: "Writing Unit Tests",
            imageUrl: "https://i.imgflip.com/53gwkw.jpg"
        },
        {
            text: "Coffee, Code, Repeat",
            imageUrl: "https://i.imgflip.com/797zwv.jpg"
        },
        {
            text: "Version Control: Saved",
            imageUrl: "https://i.imgflip.com/7ikbq6.jpg"
        },
    ];

    const randomIndex = Math.floor(Math.random() * popupMessages.length);
    const message = popupMessages[randomIndex];

    // notification template
    chrome.notifications.create({
        type: 'image',
        iconUrl: './icons/icon128.png',
        title: 'ProcrastiNope',
        message: message.text,
        imageUrl: message.imageUrl,
    });
}
chrome.alarms.create('notificationAlarm', { periodInMinutes: 60 });
// chrome.alarms.create('notificationAlarm', { periodInMinutes: 5 / 60 }); // 5 seconds

// alarm trigger
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'notificationAlarm') {
        showNotification();
    }
});
