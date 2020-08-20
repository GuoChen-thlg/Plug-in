// //
// chrome.webRequest.onCompleted.addListener(
//   function (detail) {
//     console.log(detail);
//   },
//   {
//     urls: ["<all_urls>"],
//   }
// );

// 特定的网站才能打开
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 只有打开 amazon 才显示 pageAction
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "amazon" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
