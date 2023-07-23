

document.addEventListener('DOMContentLoaded', function () {
    // Get the blocklist and alarm status from storage and update the UI
    updateBlocklist();
    updateAlarmStatus();

    document.getElementById('addSiteButton').addEventListener('click', addSiteToBlocklist);
    document.getElementById('blocklist').addEventListener('click', removeSiteFromBlocklist);

    document.getElementById('alarmToggle').addEventListener('change', handleAlarmToggle);
});

// Function to handle the user's preference for the alarm status
function handleAlarmToggle(event) {
    const alarmEnabled = event.target.checked;

    // Save the user's preference in the storage
    chrome.storage.sync.set({ alarmEnabled }, () => {
        // Show a notification to let the user know the preference has been saved
        const notificationOptions = {
            type: 'basic',
            iconUrl: './icons/icon48.png',
            title: 'ProcrastiNope',
            message: `Hourly Meme Alarm ${alarmEnabled ? 'enabled' : 'disabled'}.`,
        };

        chrome.notifications.create(notificationOptions);

        // Update the alarm status in the UI based on the user's preference
        const alarmToggle = document.getElementById('alarmToggle');
        alarmToggle.checked = alarmEnabled;

        // Update the alarm status in the background script
        chrome.runtime.sendMessage({ type: 'updateAlarmStatus', alarmEnabled });
    });
}

// Function to update the alarm status in the UI based on the user's preference
function updateAlarmStatus() {
    chrome.storage.sync.get('alarmEnabled', (data) => {
        const alarmToggle = document.getElementById('alarmToggle');
        alarmToggle.checked = data.alarmEnabled !== false;
    });
}



function addSiteToBlocklist() {
    const siteInput = document.getElementById('siteInput');
    const siteUrl = siteInput.value.trim();

    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;

    if (siteUrl !== '' && urlPattern.test(siteUrl)) {
        chrome.storage.sync.get('blocklist', (data) => {
            const blocklist = data.blocklist || [];
            if (!blocklist.includes(siteUrl)) {
                blocklist.push(siteUrl);
                chrome.storage.sync.set({ blocklist }, () => {
                    updateBlocklist();
                });
            }
        });
        siteInput.value = '';
    } else {
        alert('Invalid website URL. Please enter a valid URL starting with "http://" or "https://"');
    }
}


// get the blocklist from storage and update the UI
function updateBlocklist() {
    chrome.storage.sync.get('blocklist', (data) => {
        const blocklist = data.blocklist || [];
        const blocklistElement = document.getElementById('blocklist');
        blocklistElement.innerHTML = '';
        blocklist.forEach((site) => {
            const li = document.createElement('li');
            li.classList.add('blocklist-item', 'flex', 'justify-between', 'items-center', 'py-2');
            li.innerHTML = `
                <span>${site}</span>
                <i class="fas fa-times text-red-500 remove-icon cursor-pointer"></i>
            `;
            blocklistElement.appendChild(li);
        });
    });
}

// remove a site from the blocklist
function removeSiteFromBlocklist(event) {
    if (event.target.classList.contains('remove-icon')) {
        const siteToRemove = event.target.parentElement.textContent.trim();
        chrome.storage.sync.get('blocklist', (data) => {
            const blocklist = data.blocklist || [];
            const updatedBlocklist = blocklist.filter((site) => site !== siteToRemove);
            chrome.storage.sync.set({ blocklist: updatedBlocklist }, () => {
                updateBlocklist();
            });
        });
    }
}

