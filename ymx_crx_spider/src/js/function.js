const API_URL = ' https://10.10.10.235:443/dev-api'
let TABLE = null
let TRACKLIST = [] //追踪列表

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
$.extend({
	log: function (...data) {
		console.log(...data)
	},
	hint: function (info, ss = 500) {
		$.cxDialog(info)
		setTimeout(() => {
			$.cxDialog.close()
		}, ss)
	},
	loading: function (flag) {
		$('.popup_animation').css('display', flag ? 'block' : 'none')
	},
})
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
	$('#close').on('click', () => {
		wicketClose()
	})
	// 刷新数据
	$('#refresh_data').on('click', redraw)
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
				wicketClose()
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
function isOnLine(callback) {
	$.ajax({
		type: 'GET',
		url: `${API_URL}/custom/user/checkLogin`,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		dataType: 'json',
		success: function (response) {
			$.log('查询是否在线')
			if (response.isOnline) {
				$.cxDialog({
					title: '提示',
					info: '该账号已登录',
					okText: '✔',
					ok: () => {
						$('.main_wrap.login_outer_box').css('display', 'block')
						$('.main_wrap.data_show_box').css('display', 'none')
						$.removeCookie('token', { path: '/' })
					},
				})
			} else {
				callback()
			}
		},
		error: function (xhr, status, error) {
			$.log(xhr)
			$.log(status)
			$.log(error)
			$.cxDialog({
				title: '提示',
				info: '网络故障，请稍后再试',
				okText: '✔',
				ok: () => {
					$('.main_wrap.login_outer_box').css('display', 'block')
					$('.main_wrap.data_show_box').css('display', 'none')
					$.removeCookie('token', { path: '/' })
				},
			})
		},
	})
}
/**
 * 登录
 *
 * @param {obj} user
 */
function login(user) {
	// 成功后即可登录
	$.loading(true)
	$.ajax({
		type: 'POST',
		url: `${API_URL}/custom/user/loginCus`, //checkLogin
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		data: JSON.stringify({ ...user, ip: '' }),
		dataType: 'json',
		success: function (response) {
			if (response.status === '200') {
				$.cookie('token', user.u_name, {
					expires: 7,
					path: '/',
				})
				$('#user_name').text(user.u_name)
				$.loading(false)
				$.log('登录成功，渲染数据表，显示数据表')
				queryTracking(trackList => {
					TRACKLIST = trackList
					renderTable([$('#ASIN').val(), ...findAllAsin()])
				})
				$('.main_wrap.login_outer_box').css('display', 'none')
				$('.main_wrap.data_show_box').css('display', 'block')
				$.loading(false)
			} else {
				$.cxDialog({
					title: '提示',
					info: '账号或密码不正确，登录失败',
					okText: '✔',
					ok: () => {
						$.loading(false)
					},
				})
			}
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
			$.cxDialog({
				title: '提示',
				info,
				okText: '✔',
				ok: () => {
					$.loading(false)
				},
			})
			$.log(xhr)
			$.log(status)
			$.log(error)
		},
	})
}
/**
 * @description 关闭浮动窗口
 *
 * @param {string} id
 */
function wicketClose(id) {
	id = id === undefined ? '#app-root' : id
	const child = document.querySelector(id)
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
	$.log('判断是否登录')
	if ($.cookie('token')) {
		$('#user_name').text($.cookie('token'))
		$.cookie('token', $.cookie('token'), {
			expires: 7,
			path: '/',
		})
		$.log('已登录，执行 verifyLogin 回调方法')
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
	$('#customSwitch1').click(function () {
		let _this = this
		redraw(() => {
			$.log('执行一次')
			$.loading(false)
			if (_this.checked) {
				$('button.btn-trace').removeAttr('disabled')
				$('.multiterm').css('display', 'block')
				$('.single').css('display', 'none')
			} else {
				$('button.btn-trace').attr('disabled', 'disabled')
				$('.multiterm').css('display', 'none')
				$('.single').css('display', 'block')
			}
		})
	})
}
/**
 * @description 查询用户追踪列表
 *
 * @param {Function} callback 传递出来追踪列表
 */
function queryTracking(callback) {
	isOnLine(() => {
		$.log('请求用户追踪列表')
		$.ajax({
			type: 'POST',
			url: `${API_URL}custom/user/looktrack?u_name=${$.cookie('token')}`,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			success: function (response) {
				$.log(response)
				if (response.code == 200) {
					// if (response.isOnline) {
					callback(response.data)
					// } else {
					// 	$.cxDialog({
					// 		title: '警告',
					// 		info: '该账号异地登录，请及时修改密码！',
					// 		okText: '✔',
					// 		ok: () => {
					// 			wicketClose()
					// 			$.removeCookie('token', { path: '/' })
					// 		},
					// 	})
					// }
				} else {
					callback([])
				}
			},
			error: function (xhr, status, error) {
				callback([])
			},
		})
	})
}
/**
 * @description 单项追踪/取消
 *
 */
function singleTrack() {
	$('input:checkbox[data-single]').click(function () {
		// e.preventDefault()
		let data = {
			checked: this.checked,
			asin: this.attributes['data-asin'].value,
		}
		let _this = this
		$.loading(true)
		if (data.checked) {
			$.ajax({
				type: 'GET',
				url: `${API_URL}/custom/user/addtrack?u_name=${$.cookie(
					'token'
				)}&asin=${data.asin}`,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
				success: function (response) {
					$.log(response)
					if (response.status === 'success') {
						$.loading(false)
						$.hint('跟踪成功')
					} else {
						$(_this).prop('checked', false)
						$.loading(false)
						$.hint('跟踪失败')
					}
				},
				error: function (xhr, status, error) {
					$.log(status)
					$(_this).prop('checked', false)
					$.loading(false)
					$.hint('跟踪失败')
				},
			})
		} else {
			$.ajax({
				type: 'GET',
				url: `${API_URL}/custom/user/deltrack?u_name=${$.cookie(
					'token'
				)}&asin=${data.asin}`,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
				success: function (response) {
					$.log(response)
					if (response.status === 'success') {
						$.loading(false)
						$.hint('删除成功')
					} else {
						$(_this).prop('checked', true)
						$.loading(false)
						$.hint('删除失败')
					}
				},
				error: function (xhr, status, error) {
					$.log(status)
					$(_this).prop('checked', true)
					$.loading(false)
					$.hint('删除失败')
				},
			})
		}
	})
}
/**
 * @description 重绘
 *
 * @param {string} option 单项追踪或是多项追踪
 */
function redraw(callback) {
	$.log('重绘开始')
	$.loading(true)
	queryTracking(data => {
		TRACKLIST = data
		$.log('TABLE 重新渲染数据表')
		TABLE.ajax.reload(function () {
			table_init_binding()
			if (callback && typeof callback === 'function') {
				callback()
			} else {
				$.loading(false)
			}
		})
	})
}
/**
 * @description 创建折线图容器
 *
 * @param {Function} callback 创建完成执行回调
 */
function creatorLineChart(callback) {
	const div = document.createElement('div')
	div.id = 'LineChart_box'
	div.innerHTML = `	
	<div class='LineChart_outer' >
	<div id="move" class='title'><div class="_close" title="关闭" id="LineChart_close">X</div></div>	
	<div id='LineChart'></div>
	</div>
	`
	document.querySelector('#app-root').appendChild(div)
	$('.LineChart_outer').bg_move({
		move: '#move',
	})
	$('#LineChart_close').on('click', () => {
		wicketClose('#LineChart_box')
	})
	callback()
}

function renderLineChart(options, callback) {
	const chart = Highcharts.chart({
		chart: {
			renderTo: 'LineChart',
		},
		title: {
			text: '某网站日常访问量',
		},
		subtitle: {
			text: '数据来源:********',
		},
		xAxis: {
			tickInterval: 7 * 24 * 3600 * 1000, // 坐标轴刻度间隔为一星期
			tickWidth: 0,
			gridLineWidth: 1,
			labels: {
				align: 'left',
				x: 3,
				y: -3,
			},
			// 时间格式化字符
			// 默认会根据当前的刻度间隔取对应的值，即当刻度间隔为一周时，取 week 值
			dateTimeLabelFormats: {
				week: '%Y-%m-%d',
			},
		},
		yAxis: [
			{
				// 第一个 Y 轴，放置在左边（默认在坐标）
				title: {
					text: null,
				},
				labels: {
					align: 'left',
					x: 3,
					y: 16,
					format: '{value:.,0f}',
				},
				showFirstLabel: false,
			},
			{
				// 第二个坐标轴，放置在右边
				linkedTo: 0,
				gridLineWidth: 0,
				opposite: true, // 通过此参数设置坐标轴显示在对立面
				title: {
					text: null,
				},
				labels: {
					align: 'right',
					x: -3,
					y: 16,
					format: '{value:.,0f}',
				},
				showFirstLabel: false,
			},
		],
		legend: {
			align: 'left',
			verticalAlign: 'top',
			y: 20,
			floating: true,
			borderWidth: 0,
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			// 时间格式化字符
			// 默认会根据当前的数据点间隔取对应的值
			// 当前图表中数据点间隔为 1天，所以配置 day 值即可
			dateTimeLabelFormats: {
				day: '%Y-%m-%d',
			},
		},
		plotOptions: {
			series: {
				cursor: 'pointer',
				point: {
					events: {
						// 数据点点击事件
						// 其中 e 变量为事件对象，this 为当前数据点对象
						click: function (e) {
							$('.message').html(
								Highcharts.dateFormat('%Y-%m-%d', this.x) +
									':<br/>  访问量：' +
									this.y
							)
						},
					},
				},
				marker: {
					lineWidth: 1,
				},
			},
		},
	})
}

// 价格
function trendPrice() {
	$('td.product_price').on('click', function () {
		$.log('价格')
		creatorLineChart(() => {
			$('#LineChart').text('价格趋势')
			renderLineChart(null, null)
		})
	})
}
// 排名
function trendBsn() {
	$('td.product_bsn').on('click', function () {
		$.log('排名')
		creatorLineChart(() => {
			$('#LineChart').text('排名')
		})
	})
}
// 节点排名
function trendRanking() {
	$('td.product_ranking').on('click', function () {
		$.log('节点排名')
		creatorLineChart(() => {
			$('#LineChart').text('节点排名趋势')
			$.ajax({
				url: 'https://pv.sohu.com/cityjson?ie=utf-8',
				type: 'GET',
				dataType: 'jsonp',
				success: function (data) {
					$.log(data)
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					$.log(XMLHttpRequest)
					$.log(textStatus)
					$.log(errorThrown)
				},
				complete: function () {
					$.log(returnCitySN)
				},
			})
			// $.getScript('https://pv.sohu.com/cityjson?ie=utf-8', function (data) {
			// 	setTimeout(() => {
			// 		$.log(data)
			// 	}, 10000)
			// })
		})
	})
}
// 产品评分
function trendRating() {
	$('td.product_reviews_rating').on('click', function () {
		$.log('产品评分')
		creatorLineChart(() => {
			$('#LineChart').text('产品评分趋势')
		})
	})
}
// 评论数
function trendComment() {
	$('td.product_reviews_count').on('click', function () {
		$.log('评论数')
		creatorLineChart(() => {
			$('#LineChart').text('评论数趋势')
		})
	})
}
// 问答数
function trendQ_A() {
	$(' td.product_q_a').on('click', function () {
		$.log('问答数')
		creatorLineChart(() => {
			$('#LineChart').text('问答数趋势')
		})
	})
}
/**
 * @description 数据表初始化绑定事件
 *
 */
function table_init_binding() {
	//绑定 点击事件 追踪产品
	singleTrack()
	// 价格
	trendPrice()
	// 排名
	trendBsn()
	// 节点排名
	trendRanking()
	// 产品评分
	trendRating()
	// 评论数
	trendComment()
	// 问答数
	trendQ_A()
}
