// 弹窗统一配置
$.cxDialog.defaults.baseClass = 'ios'
// 提示统一配置
let tipsInfo = {
	side: 3,
	color: '#FFF',
	bg: '#FF00FF',
	time: '2',
}
/**
 * 登录
 *
 * @param {obj} user
 */
function login(user) {
	// 成功后即可登录
	// 假登陆
	$('.popup_animation').css('display', 'block')
	$.ajax({
		type: 'POST',
		url: 'http://192.168.1.146:5000/user/login',
		data: { ...user },
		dataType: 'json',
		success: function (response) {
			console.log(response)
			// 跳转页面
			$('.popup_animation').css('display', 'none')
			$(location).attr('href', '../views/data_list.html')
		},
		error: function (xhr, status, error) {
			let info = null
			switch (status) {
				case 'error':
					info = '登录失败😅，请稍后重试。'
					break
				case 'timeout':
					info = '请求超时😅，请稍后重试。'
					break
				default:
					info = '错误😅，请稍后重试。'
					break
			}
			$('.popup_animation').css('display', 'none')
			$.cxDialog({
				title: '提示',
				info,
				okText: '✔',
				ok: () => {},
			})
			console.error(error)
		},
	})
}
/**
 * 验证是否需要登录
 *
 */
function verifyLogin() {
	console.log($.cookie("token"));
	if (!!$.cookie("token")) {
	  $(location).attr("href", "../views/data_list.html");
	}
}

// 登录按钮
$('button[type="button"].login').on('click', () => {
	// 用户信息
	let login_user = {
		username: $('#login_admin').val().trim(),
		passwd: $('#login_password').val().trim(),
	}
	if (login_user.username == '') {
		$('#login_admin')
			.tips({ ...tipsInfo, msg: '请填写账号' })
			.focus()
	} else if (login_user.passwd == '') {
		$('#login_password')
			.tips({ ...tipsInfo, msg: '请填写密码' })
			.focus()
	} else {
		// login(login_user);

		/********************************* 测试区 ******************************* */

		// chrome.cookies.set({
		//   url: "https://www.amazon.com",
		//   name: "token",
		//   value: "15645465456",
		//   path: "/",
		//   secure: true,
		//   // expirationDate:''
		// });

		$.cookie('token', '15645465456', {
			expires: 1,
			path: '/',
		})
		// 跳转至页面

		// $(location).attr("href", "../views/data_list.html");//chrome-extension://gmebnlmjaalbmilopdcjgjcnminbfaai/src/views/popup.html

		$(location).attr(
			'href',
			'chrome-extension://gmebnlmjaalbmilopdcjgjcnminbfaai/src/views/data_list.html'
		)
		/******************************************************************** */
	}
})
// 微信登陆
$('.wxlogin').on('click', () => {
	$('.login_info_box').css('display', 'none')
	$('.wx_login_box').css('display', 'block')
	var obj = new WxLogin({
		self_redirect: true,
		id: 'wxlogin', //第三方页面显示二维码的容器id
		appid: 'wxbdc5610cc59c1631',
		scope: 'snsapi_login',
		redirect_uri: 'https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do',
		// state: "",
		// style: "",
		// href: "",
	})
})
// 关闭微信登陆
$('.close').on('click', () => {
	$('.login_info_box').css('display', 'block')
	$('.wx_login_box').css('display', 'none')
})
// 注册
$('.register').on('click', function (e) {
	e.preventDefault()
	open($('.register')[0].href)
	return false
})

// 打印当前地址
console.log($(location).attr('href'))

// 用于校验登录是否过期，直接跳转进去 否则 重新登录
verifyLogin();
// $("#Check")[0].checked,
