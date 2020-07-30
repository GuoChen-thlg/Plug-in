console.log("......");

//
chrome.webRequest.onCompleted.addListener(
  function (detail) {
    console.log(detail);
  },
  {
    urls: ["<all_urls>"],
  }
);
