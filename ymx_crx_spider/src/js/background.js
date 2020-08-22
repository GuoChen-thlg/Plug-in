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

// 特定的网站才能打开
chrome.runtime.onInstalled.addListener(function () {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开 amazon 才显示 pageAction
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { urlContains: 'amazon' },
					}),
				],
				actions: [new chrome.declarativeContent.ShowPageAction()],
			},
		])
	})
})
chrome.pageAction.onClicked.addListener(function () {
	// 打开悬浮窗
	SendMessageToContent(
		{
			type: 'OPEN',
		},
		data => {
			console.log(data)
		},
		error => {
      console.log(error.message)
			if (error.message.includes('Could not establish connection. Receiving end does not exist')) {
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
