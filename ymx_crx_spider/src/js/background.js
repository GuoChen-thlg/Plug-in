/**
 * 发送消息
 *
 * @param {obj} message
 * @param {function(obj)} callback
 */
function SendMessageToContent(message, callback, error) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
			if (chrome.runtime.lastError) {
				error(chrome.runtime.lastError)
			} else {
				callback(response)
			}
		})
	})
}
/**
 *获得当前页面的 URL
 *
 * @param {function(string)} callback
 * @return {string} URL
 */
// function getTabUrl(callback) {
// 	chrome.tabs.query(
// 		{
// 			active: true,
// 			currentWindow: true,
// 		},
// 		tabs => {
// 			let tab = tabs[0]
// 			console.assert(typeof tab.url == 'string', 'tab.url 应该是一个字符串')
// 			callback(tab.url)
// 		}
// 	)
// }
// /**
//  * @description 是否是亚马逊网址
//  *
//  * @param {any} url
//  * @returns
//  */
// function isAmazonUrl(url) {
// 	return /^https?:\/\/((www|smile)\.)?amazon\.[\w.]{2,6}\//.test(url.trim())
// }
// function isAmazonProductUrl(url) {
// 	return (
// 		isAmazonUrl(url) &&
// 		!/\/stores\/node\//.test(url) &&
// 		/(\/((B[A-Z\d]{9})|(\d{9}[A-Z\d]))($|\/|\?))|(\/dp\/((B[A-Z\d]{9})|(\d{9}[A-Z\d])))/.test(
// 			url
// 		)
// 	)
// }
// 特定的网站才能打开
chrome.runtime.onInstalled.addListener(function () {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 匹配规则
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { urlContains: 'amazon' },
					}),
					// new chrome.declarativeContent.PageStateMatcher({
					// 	pageUrl: { urlContains: '/s?' },
					// }),
				],
				actions: [new chrome.declarativeContent.ShowPageAction()],
			},
		])
	})
})
chrome.pageAction.onClicked.addListener(function (tab) {
	// // 打开悬浮窗

	SendMessageToContent(
		{
			type: 'OPEN',
		},
		data => {
			console.log(data)
		},
		error => {
			console.log(error.message)
			if (
				error.message &&
				error.message.includes(
					'Could not establish connection. Receiving end does not exist'
				)
			) {
				chrome.notifications.create(
					`${error.message}-${new Date().getTime()}`,
					{
						type: 'basic',
						title: '错误',
						message: `请刷新页面`,
						iconUrl: '../../img/icon32_wx_logo.png',
					},
					notificationId => {
						console.log(notificationId)
					}
				)
			}
		}
	)
})
