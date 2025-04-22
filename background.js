chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'takeScreenshot') {
      takeScreenshot(message.filename);
    }
  });
  
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'take_default_screenshot') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const defaultFilename = `screenshot-${timestamp}.png`;
      takeScreenshot(defaultFilename);
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
  