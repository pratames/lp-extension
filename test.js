let couponHeadingXpathToUse = "";

// Get the current URL
const getCurrentURL = () => window.location.href;

// Extract the domain name without TLD
const getStoreName = () => {
  try {
    const urlObj = new URL(getCurrentURL());
    const segments = urlObj.pathname.split("/").filter(Boolean);
    const storeIndex = segments.indexOf("store");
    let store = null;
    if (storeIndex !== -1 && segments.length > storeIndex + 1) {
      store = segments[storeIndex + 1];
      if (store.includes(".")) {
        store = store.split(".")[0];
      }
    }
    return store;
  } catch (error) {
    console.error("Error in getStoreName:", error);
    return null;
  }
};

// Check if a particular text (XPath) exists in DOM
const doesTextExistsInDOM = (text, caseMatching = false, subStrMatching = false) => {
  try {
    if (!caseMatching && !subStrMatching) {
        return document.evaluate(`//*[text()="${text}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } else if(caseMatching && !subStrMatching) {
        return document.evaluate(`//*[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = "${text.toLowerCase()}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } else if(subStrMatching) {
        let subStrXpath = `//*[`
        text.forEach((textPattern, i) => {
            subStrXpath += `contains(text(), "${textPattern}")${i != text.length - 1 ? " and " : ""}`
        });
        subStrXpath += `]`
        couponHeadingXpathToUse = subStrXpath
        return document.evaluate(subStrXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
  } catch (error) {
    console.error("Error in doesTextExistsInDOM:", error);
    return null;
  }
};

// Check if a particular element (XPath) exists in DOM
const doesElementExistsInDOM = (xpath) => {
  try {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  } catch (error) {
    console.error("Error in doesElementExistsInDOM:", error);
    return null;
  }
};

// Generate coupon heading dynamically
const store = getStoreName();
const couponHeading = `today's ${store} promo codes`;

// Error handling if coupon heading does not exist
const checkCouponHeading = () => {
  try { 
    const couponExists = doesElementExistsInDOM(`//h2[contains(text(), "promo codes")]`);
    if (!couponExists) {
      throw new Error(`Selector "//h2[contains(text(), "promo codes")]" does not exist in DOM!`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Handle 'Show More' button click
const clickOnShowMore = () => {
  try {
    const showMoreXpath = `//h2[contains(text(), "promo codes")]//parent::section//button[@data-size="sm"]`;
    const showMore = doesElementExistsInDOM(showMoreXpath);
    if (!showMore) {
      throw new Error(`Selector "${showMoreXpath}" does not exist in DOM!`);
    }
    if (showMore && showMore?.nextElementSibling?.tagName.toLowerCase() !== "button") {
        showMore.click();
    } else {
        console.log("Show more is already clicked")
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get coupon details from the DOM
const getCouponDetails = () => {
  try {
    const couponDetails = [];
    const couponContainerXpath = `//h2[contains(text(), "promo codes")]//parent::section//*[contains(@class, "coupon-card-container")]`;
    const couponContainer = document.evaluate(couponContainerXpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < couponContainer.snapshotLength; i++) {
      const couponStatus = couponContainer.snapshotItem(i).getAttribute("isunverified");
      const couponCodeValue = couponContainer.snapshotItem(i).getAttribute("code") || "Not Found";
      const couponStatusValue = couponStatus === "true" ? "unverified" : couponStatus === "false" ? "verified" : couponStatus === null ? "No status found" : "Unknown attribute value";
      const couponDiscount = couponContainer.snapshotItem(i).querySelector("h3[data-testid='promotion-title']");
      const couponDiscountValue = couponDiscount ? couponDiscount.textContent : "Not Found";
      const couponSuccessRate = couponContainer.snapshotItem(i).querySelector("article span");
      const couponSuccessRateValue = couponSuccessRate ? couponSuccessRate.textContent : "Not Found";
      const couponDescription = couponContainer.snapshotItem(i).querySelector("[data-testid='promotion-subtitle']");
      const couponDescriptionValue = couponDescription ? couponDescription.textContent : "Not Found";
      couponDetails.push({
        "Coupon Status": couponStatusValue,
        "Coupon Code": couponCodeValue,
        "Coupon Discount": couponDiscountValue,
        "Coupon Success Rate": couponSuccessRateValue,
        "Coupon Description": couponDescriptionValue
      });
    }
    return couponDetails;
  } catch (error) {
    console.error("Error in getCouponDetails:", error);
    throw error;
  }
};

// Download coupon details as CSV
const downloadCSV = (data, filename = `${store}_simplycodes_coupon_details.csv`) => {
  try {
    if (!data.length) {
      throw new Error("No data to download!");
    }
    const headers = Object.keys(data[0]);
    const rows = data.map(obj =>
      headers.map(key => `${(obj[key] ?? "").toString().replace(/"/g, '""')}`).join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error in downloadCSV:", error);
    throw error;
  }
};

// Main function to execute the process
const main = async () => {
  try {
    checkCouponHeading();
    clickOnShowMore();
    setTimeout(() => downloadCSV(getCouponDetails()), 3000);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// Execute main function
main();
