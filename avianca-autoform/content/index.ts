// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "changeBackground") {
    // Change the background of the page
    document.body.style.backgroundColor = request.color
    sendResponse({ status: "success" })
  }
})
