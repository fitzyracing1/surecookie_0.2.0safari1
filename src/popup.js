// Popup script for SureCookie extension

const toggleEnabled = document.getElementById('toggle-enabled');
const toggleAutoAccept = document.getElementById('toggle-auto-accept');

// Load current settings
function loadSettings() {
  chrome.storage.sync.get(['enabled', 'autoAcceptCookies', 'cookiesAccepted'], (result) => {
    toggleEnabled.checked = result.enabled ?? true;
    toggleAutoAccept.checked = result.autoAcceptCookies ?? true;
  });
}

// Load settings on popup open
loadSettings();

// Save settings when toggled
toggleEnabled.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggleEnabled.checked });
  notifyContentScripts();
});

toggleAutoAccept.addEventListener('change', () => {
  chrome.storage.sync.set({ autoAcceptCookies: toggleAutoAccept.checked });
  if (toggleAutoAccept.checked) {
    notifyContentScripts();
  }
});

function notifyContentScripts() {
  // Send message to all tabs to trigger cookie acceptance
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { action: 'settingsChanged' }).catch(() => {
        // Ignore errors for tabs that don't have content script
      });
    }
  });
}
