

document.addEventListener('DOMContentLoaded', function () {
    // Get the blocklist and points from storage and update the UI
    updateBlocklist();
    updatePointsDisplay();

    // Add event listeners for adding and removing sites
    document.getElementById('addSiteButton').addEventListener('click', addSiteToBlocklist);
    document.getElementById('blocklist').addEventListener('click', removeSiteFromBlocklist);
});

// Function to get the blocklist from storage and update the UI
function updateBlocklist() {
    chrome.storage.sync.get('blocklist', (data) => {
        const blocklist = data.blocklist || []; // If blocklist doesn't exist in storage, initialize it as an empty array
        const blocklistElement = document.getElementById('blocklist');
        blocklistElement.innerHTML = ''; // Clear the list before updating
        blocklist.forEach((site) => {
            const li = document.createElement('li');
            li.textContent = site;
            blocklistElement.appendChild(li);
        });
    });
}


function addSiteToBlocklist() {
    const siteInput = document.getElementById('siteInput');
    const siteUrl = siteInput.value.trim();
    if (siteUrl !== '') {
        chrome.storage.sync.get('blocklist', (data) => {
            const blocklist = data.blocklist || []; // Initialize blocklist as an empty array if it doesn't exist
            if (!blocklist.includes(siteUrl)) {
                blocklist.push(siteUrl);
                chrome.storage.sync.set({ blocklist }, () => {
                    updateBlocklist(); // Update the UI
                });
            }
        });
        siteInput.value = ''; // Clear the input field
    }
}

// Rest of the existing functions (updatePointsDisplay, addSiteToBlocklist)

// Function to get the blocklist from storage and update the UI
function updateBlocklist() {
    chrome.storage.sync.get('blocklist', (data) => {
        const blocklist = data.blocklist || []; // If blocklist doesn't exist in storage, initialize it as an empty array
        const blocklistElement = document.getElementById('blocklist');
        blocklistElement.innerHTML = ''; // Clear the list before updating
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

// Function to remove a site from the blocklist
function removeSiteFromBlocklist(event) {
    if (event.target.classList.contains('remove-icon')) {
        const siteToRemove = event.target.parentElement.textContent.trim();
        chrome.storage.sync.get('blocklist', (data) => {
            const blocklist = data.blocklist || []; // Initialize blocklist as an empty array if it doesn't exist
            const updatedBlocklist = blocklist.filter((site) => site !== siteToRemove);
            chrome.storage.sync.set({ blocklist: updatedBlocklist }, () => {
                updateBlocklist(); // Update the UI
            });
        });
    }
}

// Function to update and display the user's points
function updatePointsDisplay() {
    chrome.storage.sync.get('points', (data) => {
        const { points } = data;
        const pointsDisplay = document.getElementById('pointsDisplay');
        pointsDisplay.textContent = points;
    });
}


