console.log("......");

//
chrome.webRequest.onCompleted.addListener(
  function (details) {
    console.log(details);
    console.log("请求消息了");
  },
  {
    urls: ["<all_urls>"],
  }
);
