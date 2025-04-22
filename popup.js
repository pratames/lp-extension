const dropdownA = document.getElementById('dropdownA');
const dropdownB = document.getElementById('dropdownB');
const takeScreenshotBtn = document.getElementById('takeScreenshot');

dropdownA.addEventListener('change', function () {
  const val = dropdownA.value;
  dropdownB.innerHTML = '<option value="">Select option</option>';

  if (val === 'hijack') {
    addOptions(['banner_ad', 'price_comparison_ad', 'price_comparison_ad_1', 'price_comparison_ad_2']);
  } else if (val === 'hesitant') {
    addOptions(['hesitant_shopper_mock_solution', 'hesitant_shopper_mobile_mock_solution']);
  } else if (val === 'extension') {
    addOptions(['extension_mock_solution']);
  } else if (val === 'wrong coupon') {
    addOptions(['wrong_coupon_mock_solution', 'wrong_coupon_mobile_mock_solution']);
  } else if (val === 'wishlit') {
    addOptions(['do_i_really_need_this_mock_solution', 'do_i_really_need_this_mobile_mock_solution']);
  } else if (val === 'frustrated') {
    addOptions(['frustrated_shopper_mock_solution', 'frustrated_shopper_mobile_mock_solution']);
  } else {
    dropdownB.style.display = 'none';
  }
});

function addOptions(options) {
  dropdownB.style.display = 'block';
  options.forEach(opt => {
    const el = document.createElement('option');
    el.value = opt;
    el.textContent = opt;
    dropdownB.appendChild(el);
  });
}

takeScreenshotBtn.addEventListener('click', () => {
  const selectedValue = dropdownB.value;
  if (!selectedValue) {
    alert("Please select a name");
    return; 
  }

  chrome.runtime.sendMessage({
    action: 'takeScreenshot',
    filename: selectedValue + ".png"
  });
});



