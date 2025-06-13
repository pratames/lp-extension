document.getElementById('changeColor').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => {
      document.body.style.backgroundColor = 'lightgreen';
    }
  });
});

// Uncaught (in promise) Error: Cannot access contents of url "https://www.staples.com/". Extension manifest must request permission to access this host.
