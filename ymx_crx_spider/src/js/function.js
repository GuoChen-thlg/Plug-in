const API_URL = ' https://192.168.1.153:443/dev-api'
// 弹窗统一配置
$.cxDialog.defaults.baseClass = 'ios'
$.cxDialog.defaults.lockScroll = true

// 提示统一配置
let tipsInfo = {
	side: 3,
	color: '#FFF',
	bg: '#FF00FF',
	time: '2',
}
/**
 * @description 获得所有 ASIN
 *
 * @returns {Array} Asinlist 返回 页面 所有的 ASIN
 */
function findAllAsin() {
	// TODO 整合
	let asinlist = []
	let ajax_asin_list = []
	// 产品列表页
	let asins = $('[data-asin]')
	let product_iist_asin = asins.map((i, o) => {
		if (o.dataset.asin !== '' && o.dataset.asin.length == 10) {
			return o.dataset.asin
		}
	})
	// 产品详情页
	document.querySelectorAll('div[data-a-carousel-options]').forEach(o => {
		if (JSON.parse(o.dataset.aCarouselOptions).ajax) {
			let arr = JSON.parse(o.dataset.aCarouselOptions).ajax.id_list
			if (arr && arr.length > 0) {
				ajax_asin_list = [...ajax_asin_list, ...arr]
			}
		}
	})
	ajax_asin_list = ajax_asin_list.map(o => o.substr(0, 10))
	asinlist = new Set([...product_iist_asin, ...ajax_asin_list])
	return [...asinlist]
}
/**
 * @description  窗口中事件绑定
 *
 */
function eventBinding() {
	let app_root_style = null
	// 关闭按钮
	$('#close').on('click', close)
	// 窗口最大化/还原
	$('.full-screen-box').on('click', () => {
		if ($('.full-screen-box>.full').css('display') === 'block') {
			app_root_style = $('#app-root').attr('style')
			$('#app-root').css({
				width: '100%',
				height: '100%',
				top: '0',
				left: '0',
			})
			$('.full-screen-box>.full').css('display', 'none')
			$('.full-screen-box>.small').css('display', 'block')
		} else {
			$('#app-root').attr('style', app_root_style)
			$('.full-screen-box>.full').css('display', 'block')
			$('.full-screen-box>.small').css('display', 'none')
		}
	})
	// 退出按鈕
	$('button[type="button"].quit').on('click', () => {
		$.cxDialog({
			title: '提示',
			info: '确认退出该账号吗❓',
			okText: '✔',
			ok: function () {
				close()
				$.removeCookie('token', { path: '/' })
			},
			noText: '❌',
			no: () => {},
		})
	})
	// 登录按钮
	$('button[type="button"].login').on('click', () => {
		// 用户信息
		let login_user = {
			u_name: $('#login_admin').val().trim(),
			u_password: $('#login_password').val().trim(),
		}
		if (login_user.u_name == '') {
			$('#login_admin')
				.tips({ ...tipsInfo, msg: '请填写账号' })
				.focus()
		} else if (login_user.u_password == '') {
			$('#login_password')
				.tips({ ...tipsInfo, msg: '请填写密码' })
				.focus()
		} else {
			login(login_user)
		}
	})
	// 注册
	$('.register').on('click', function (e) {
		e.preventDefault()
		open($('.register')[0].href)
		return false
	})
	// 微信登陆
	// $('.wxlogin').on('click', () => {
	// 	$('.login_info_box').css('display', 'none')
	// 	$('.wx_login_box').css('display', 'block')
	// 	var obj = new WxLogin({
	// 		self_redirect: true,
	// 		id: 'wxlogin', //第三方页面显示二维码的容器id
	// 		appid: 'wxbdc5610cc59c1631',
	// 		scope: 'snsapi_login',
	// 		redirect_uri: 'https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do',
	// 		// state: "",
	// 		// style: "",
	// 		// href: "",
	// 	})
	// })
	// // 关闭微信登陆
	// $('.close').on('click', () => {
	// 	$('.login_info_box').css('display', 'block')
	// 	$('.wx_login_box').css('display', 'none')
	// })
}
/**
 * @description 关闭浮动窗口
 *
 */
function close() {
	const child = document.querySelector('#app-root')
	if (child) {
		const parentnode = child.parentNode
		parentnode.removeChild(child)
	}
}

/**
 * @description 验证是否已登录
 *
 * @param {Function} callback 已登录 执行回调
 */
function verifyLogin(callback) {
	$.log('判断cookie')
	if ($.cookie('token')) {
		$('#user_name').text($.cookie('token'))
		$.cookie('token', $.cookie('token'), {
			expires: 7,
			path: '/',
		})
		$.log('已登录，执行 verifyLogin 回调方法，显示数据表')
		$('.main_wrap.login_outer_box').css('display', 'none')
		$('.main_wrap.data_show_box').css('display', 'block')
		// 执行回调
		callback()
	}
}
/**
 * @description 追踪按钮的切换
 *
 */
function trackSwitch() {
	// 切换事件绑定
	$('#customSwitch1').on('click', function () {
		console.log(this.checked)
		if (this.checked) {
			$('button.btn-trace').removeAttr('disabled')
			$('.multiterm').css('display', 'block')
			$('.single').css('display', 'none')
		} else {
			$('button.btn-trace').attr('disabled', 'disabled')
			$('.multiterm').css('display', 'none')
			$('.single').css('display', 'block')
		}
	})
}
/**
 * @description 查询用户追踪列表
 *
 * @param {Function} callback
 */
function queryTracking(callback) {
	$.ajax({
		type: 'POST',
		url: `${API_URL}custom/user/looktrack?u_name=${$.cookie('token')}`,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
        success: function (response) {
            $.log(response)
			if (response.code == 200) {
				callback(response.data)
			} else {
				callback([])
			}
		},
		error: function (xhr, status, error) {
			callback([])
		},
	})
}

// 价格
function trendPrice() {
	$('td.product_price').on('click', function () {
		$.log('价格')
		console.log('jiage')
	})
}
// 排名
function trendBsn() {
	$('td.product_bsn').on('click', function () {
		$.log('排名')
	})
}
// 节点排名
function trendRanking() {
	$('td.product_ranking').on('click', function () {
		$.log('节点排名')
	})
}
// 产品评分
function trendRating() {
	$('td.product_reviews_rating').on('click', function () {
		$.log('产品评分')
	})
}
// 评论数
function trendComment() {
	$('td.product_reviews_count').on('click', function () {
		$.log('评论数')
	})
}
// 问答数
function trendQ_A() {
	$(' td.product_q_a').on('click', function () {
		$.log('问答数')
	})
}
