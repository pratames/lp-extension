chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'takeScreenshot') {
    takeScreenshot(message.filename);
  }
});

function takeScreenshot(filename) {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
    chrome.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: false
    });
  });
}
