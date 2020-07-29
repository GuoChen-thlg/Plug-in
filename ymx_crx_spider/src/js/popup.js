/**
 *获得当前页面的 URL
 *
 * @param {function(string)} callback
 * @return {string} URL
 */
function getTabUrl(callback) {
  let queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    let tab = tabs[0];
    console.assert(typeof tab.url == "string", "tab.url 应该是一个字符串");
    callback(tab.url);
  });
}

$(".btn").on("click", function () {
  getTabUrl((taburl) => {
    console.log(taburl);
  });
});
