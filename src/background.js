// Background service worker for SureCookie extension

// Initialize extension settings on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      enabled: true,
      autoAcceptCookies: true
    });
    chrome.tabs.create({ url: 'https://github.com' }); // Open GitHub on install
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['enabled', 'autoAcceptCookies'], (result) => {
      sendResponse({
        enabled: result.enabled ?? true,
        autoAcceptCookies: result.autoAcceptCookies ?? true
      });
    });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'acceptCookies') {
    // Log analytics if needed
    chrome.storage.sync.get(['cookiesAccepted'], (result) => {
      const count = (result.cookiesAccepted ?? 0) + 1;
      chrome.storage.sync.set({ cookiesAccepted: count });
    });
  }
});
