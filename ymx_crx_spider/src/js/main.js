// 弹窗统一配置
$.cxDialog.defaults.baseClass = 'ios'
/**
 * 日志打印
 * @param  {...any} data
 */
$.extend({
	log: function (...data) {
		console.log(...data)
	},
})

// 提示统一配置
let tipsInfo = {
	side: 3,
	color: '#FFF',
	bg: '#FF00FF',
	time: '2',
}
/**
 * @description 商品列表页获得所有 ASIN
 *
 * @returns {Array} Asinlist 返回 商品列表页 所有的 ASIN
 */
function findAllAsin() {
	let divs = $('div[data-asin]')
	return divs.map((i, o) => {
		if (o.dataset.asin !== '') {
			return o.dataset.asin
		}
	})
}
/**
 * @description 渲染数据表
 *
 * @param {string} asin  ASIN
 */
function renderTable(asin) {
	// 语言配置
	const zh_ch = {
		sProcessing: `<div class="spinner-border spinner-border-sm mr-2" role="status"> <span class="sr-only">Loading...</span> </div>处理中...`,
		sLengthMenu: '显示 _MENU_ 项结果',
		sZeroRecords: '没有匹配结果',
		sInfo: '显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项',
		sInfoEmpty: '显示第 0 至 0 项结果，共 0 项',
		sInfoFiltered: '(由 _MAX_ 项结果过滤)',
		sInfoPostFix: '',
		sSearch: '搜索:',
		sUrl: 'URL',
		sEmptyTable: '表中数据为空',
		sLoadingRecords: `<div class="spinner-border spinner-border-sm mr-2" role="status"> <span class="sr-only">Loading...</span> </div>载入中...`,
		sInfoThousands: ',',
		oPaginate: {
			sFirst: '首页',
			sPrevious: '上页',
			sNext: '下页',
			sLast: '末页',
		},
		oAria: {
			sSortAscending: ': 以升序排列此列',
			sSortDescending: ': 以降序排列此列',
		},
	}
	// 表头 数据 配置
	const columns = [
		{
			title: '是否追踪',
			data: asin,
			render: (data, type, row) => {
				return `<input type="checkbox" data-asin=${data} class=" product_watch d-block mx-auto">`
			},
		},
		{
			title: '产品SKU',
			data: 'asin',
		},
		{
			title: '产品名称',
			data: 'name',
			render: (data, type, row) => {
				// 文字 省略号
				return `<span class="omit" title="${data}">${data.substr(0, 10)}.....</span>`
			},
		},
		{
			title: '首图',
			data: 'img_url',
			render: (data, type, row) => {
				return `<img class="product_img" src='${data}'/>`
			},
		},
		{
			title: '产品标题',
			data: 'title',
			render: (data, type, row) => {
				// 文字 省略号
				return `<span class="omit" title="${data}">${data.substr(0, 10)}.....</span>`
			},
		},
		{ title: '产品价格 ', data: 'price' },
		{ title: '排名', data: 'bsn' },
		{ title: '节点排名', data: 'node_ranking' },
		{ title: '产品评分', data: 'reviews_rating' },
		{ title: '产品评论数量', data: 'reviews_count' },
		{ title: '问答数', data: 'q_a' },
		{ title: '品牌名', data: 'brand' },
		{ title: '卖家', data: 'seller_Name' },
		{ title: '所属大类别', data: 'b_categroy' },
		{ title: '所属小类别', data: 's_categroy' },
		{ title: '上架时间', data: 'launche_Time' },
		{
			title: '描述',
			data: 'descr',
			render: (data, type, row) => {
				// 文字 省略号
				return `<span class="omit" title="${data}">${data.substr(0, 10)}.....</span>`
			},
		},
		{
			title: '产品变体',
			data: 'variation_asins',
			render: (data, type, row) => {
				// 文字 省略号
				return `<span class="omit" title="${data}">${data.substr(0, 10)}.....</span>`
			},
		},
		{ title: '父级ASIN', data: 'parernt_asin' },
		{ title: '库存', data: 'stock' },
		{ title: '卖家数量', data: 'num_sellers' },
		{ title: '配送方式', data: 'delivery' },
		{ title: '记录时间', data: 'crawl_time' },
	]
	const table = $('#thlg_table_data').DataTable({
		language: zh_ch, // 语言配置
		autoWidth: true, // 自适应宽度
		scrollX: true, // 水平滚动
		scrollY: true, // 垂直滚动
		colReorder: true, // 移动列
		fixedHeader: true, // 固定头
		fixedColumns: true, // 固定列
		dom: "<'d-inline-block px-2'>Blfrtip", // 控件出现的顺序
		buttons: [
			{ extend: 'copy', text: '📋COPY' },
			{
				extend: 'excel',
				text: 'EXCEL',
				className: ' btn-success',
				extension: `${new Date().toLocaleDateString()}${new Date().toLocaleTimeString()}.xlsx`,
			},
			{
				extend: 'csv',
				text: 'CSV',
				className: ' btn-info',
				extension: `${new Date().toLocaleDateString()}${new Date().toLocaleTimeString()}.csv`,
			},
		],
		columnDefs: [
			// 列 配置
			// {
			//   className: "my_cols", // 样式名称
			//   targets: [1], // 具体列 下标/样式名称/_all
			//   type: "string", // 数据类型 date  num num-fmt html-num
			//   visible: true, // 是否可见
			//   searchable: true, // 是否过滤
			//   orderable: true, //是否排序
			// },
			{
				targets: [1, 2, 3, 4, 11, 12, 13, 16, 17, 18, 21, 22],
				orderable: false, //是否排序
			},
		],
		ajax: {
			// ajax 读取数据
			url: `http://192.168.1.146/dev-api/custom/user/amzproduct/${asin}`,
			headers: {},
			dataSrc: 'amzProducts',
			error: function (XMLHttpRequest, errorinfo, error) {
				// $.cxDialog({
				// 	title: '提示',
				// 	info: '数据维护中...',
				// 	okText: '✔',
				// 	ok: () => {
				// 		close()
				// 	},
				// })
			},
		},
		columns, // 表头
		initComplete: function () {
			//初始化完成  绑定 点击事件 追踪产品
			$('input:checkbox').click(function () {
				let data = {
					checked: this.checked,
					asin: this.attributes['data-asin'].value,
				}
			})
		},
	})
}
/**
 * @description  窗口中事件绑定
 *
 */
function eventBinding() {
	let app_root_style = null
	// 关闭按钮
	$('#close').on('click', close)
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
			/********************************* 测试区 ******************************* */
			$.cookie('token', '15645465456', {
				expires: 1,
				path: '/',
			})
			login(login_user)
			/******************************************************************** */
		}
	})
	// 注册
	$('.register').on('click', function (e) {
		e.preventDefault()
		open($('.register')[0].href)
		return false
	})
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
	// $.ajax({
	// 	type: 'POST',
	// 	url: 'http://192.168.1.146:5000/user/login',
	// 	data: { ...user },
	// 	dataType: 'json',
	// 	success: function (response) {
	// 		console.log(response)
	// 		// 跳转页面
	$('.popup_animation').css('display', 'none')
	$.log('登录成功，渲染数据表，显示数据表')
	renderTable($('#ASIN').val())
	$('.main_wrap.login_outer_box').css('display', 'none')
	$('.main_wrap.data_show_box').css('display', 'block')
	// 	},
	// 	error: function (xhr, status, error) {
	// 		let info = null
	// 		switch (status) {
	// 			case 'error':
	// 				info = '登录失败😅，请稍后重试。'
	// 				break
	// 			case 'timeout':
	// 				info = '请求超时😅，请稍后重试。'
	// 				break
	// 			default:
	// 				info = '错误😅，请稍后重试。'
	// 				break
	// 		}
	// 		$('.popup_animation').css('display', 'none')
	// 		$.cxDialog({
	// 			title: '提示',
	// 			info,
	// 			okText: '✔',
	// 			ok: () => {},
	// 		})
	// 		$.log(error)
	// 	},
	// })
}
/**
 * @description 验证是否已登录
 *
 * @param {Function} callback 已登录 执行回调
 */
function verifyLogin(callback) {
	$.log('判断cookie')
	if ($.cookie('token')) {
		$.log('已登录，执行 verifyLogin 回调方法，显示数据表')
		// 执行回调
		callback()
		$('.main_wrap.login_outer_box').css('display', 'none')
		$('.main_wrap.data_show_box').css('display', 'block')
	}
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
 * @description 打开浮动窗口
 *
 * @param {Function} callback 渲染成功 执行回调
 */
function floatingWindow(callback) {
	let html = `
	<div class="title">产品信息</div>
	<div class="full-screen-box">
	<svg t="1598063281831" class="icon full" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3328" width="20" height="20"><path d="M641.750109 384.100028l205.227128-204.519-0.704035 115.89966c-0.282433 9.611915 7.489578 18.09103 17.101493 17.808598l12.297071 0c9.611915-0.283456 17.667382-5.936199 17.808598-15.689331l0.565888-172.57752c0-0.14224 0.282433-9.187243 0.282433-9.187243 0.14224-4.804423-0.99056-9.187243-4.100388-12.297071-3.109828-3.109828-7.347339-5.086855-12.297071-4.946662l-8.763594 0.14224c-0.141216 0-0.278339 0-0.420579 0.14224L697.581696 98.166787c-9.611915 0.283456-17.667382 8.200776-17.808598 17.950837l0 12.297071c1.416256 11.44875 10.458189 18.092054 20.070104 17.808598l112.789832 0.283456-204.66124 203.814965c-9.329483 9.329483-9.329483 24.449855 0 33.778314 9.329483 9.470699 24.452925 9.470699 33.782408 0L641.750109 384.100028zM383.095141 576.889893 177.726797 780.705881l0.707105-115.338888c0.283456-9.607822-7.492648-18.086937-17.104563-17.808598l-13.001105 0c-9.611915 0.283456-17.667382 5.937223-17.808598 15.690354l-0.565888 172.718737c0 0.14224-0.282433 9.187243-0.282433 9.187243-0.14224 4.808516 0.99056 9.187243 4.096295 12.297071 3.109828 3.109828 7.351432 5.086855 12.297071 4.946662l8.762571-0.14224c0.14224 0 0.283456 0 0.425695-0.14224l171.873486 0.708128c9.607822-0.283456 17.667382-8.196683 17.808598-17.950837L344.93503 832.575226c-1.415232-11.44875-10.461259-18.092054-20.074198-17.808598L212.069977 814.483172 416.59 610.671277c9.329483-9.329483 9.329483-24.453948 0-33.782408C407.40685 567.41817 392.424624 567.41817 383.095141 576.889893L383.095141 576.889893zM894.047276 835.967486l-0.424672-172.718737c-0.283456-9.612938-8.200776-15.406898-17.809621-15.690354l-12.296047 0c-9.612938-0.278339-17.243733 8.200776-17.105586 17.808598l0.708128 115.903753L641.750109 576.889893c-9.329483-9.329483-24.452925-9.329483-33.782408 0-9.325389 9.328459-9.325389 24.452925 0 33.782408L812.490795 814.483172l-112.789832 0.283456c-9.611915-0.283456-18.515702 6.502088-20.073174 17.808598l0 12.297071c0.282433 9.611915 8.200776 17.667382 17.808598 17.950837l171.166381-0.708128c0.141216 0 0.282433 0.14224 0.424672 0.14224l8.763594 0.14224c4.803399 0.141216 9.187243-1.694595 12.296047-4.946662 3.109828-3.109828 4.238534-7.488555 4.097318-12.297071 0 0-0.14224-9.046027-0.14224-9.187243L894.047276 835.968509zM212.216309 146.506748l112.789832-0.283456c9.607822 0.283456 18.512632-6.502088 20.070104-17.808598L345.076246 116.116601c-0.283456-9.611915-8.196683-17.667382-17.808598-17.950837l-172.011632 0.708128c-0.14224 0-0.283456-0.14224-0.425695-0.14224l-8.761548-0.14224c-4.808516-0.141216-9.187243 1.694595-12.297071 4.946662-3.109828 3.109828-4.242627 7.488555-4.096295 12.297071 0 0 0.282433 9.046027 0.282433 9.187243l0.420579 172.718737c0.14224 9.608845 8.200776 15.406898 17.808598 15.686261l13.005198 0c9.611915 0.282433 17.242709-8.196683 17.10047-17.808598l-0.564865-115.334795 205.231221 203.958228c9.324366 9.329483 24.448832 9.329483 33.777291 0 9.329483-9.329483 9.329483-24.452925 0-33.782408L212.216309 146.506748 212.216309 146.506748zM212.216309 146.506748" p-id="3329"></path></svg>
	<svg t="1598064061108" class="icon small" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3509" width="20" height="20"><path d="M 669.867 640 h 76.8 c 12.8 0 21.3333 -8.53333 21.3333 -21.3333 s -8.53333 -21.3333 -21.3333 -21.3333 h -128 c -12.8 0 -21.3333 8.53333 -21.3333 21.3333 v 128 c 0 12.8 8.53333 21.3333 21.3333 21.3333 s 21.3333 -8.53333 21.3333 -21.3333 v -76.8 l 132.267 132.267 c 4.26667 4.26667 8.53333 4.26667 17.0667 4.26667 s 12.8 0 17.0667 -4.26667 c 8.53333 -8.53333 8.53333 -21.3333 0 -29.8667 L 669.867 640 Z M 405.333 597.333 h -128 c -12.8 0 -21.3333 8.53333 -21.3333 21.3333 s 8.53333 21.3333 21.3333 21.3333 h 76.8 l -132.267 132.267 c -8.53333 8.53333 -8.53333 21.3333 0 29.8667 c 0 8.53333 8.53333 8.53333 12.8 8.53333 s 12.8 0 17.0667 -4.26667 L 384 669.867 v 76.8 c 0 12.8 8.53333 21.3333 21.3333 21.3333 s 21.3333 -8.53333 21.3333 -21.3333 v -128 c 0 -12.8 -8.53333 -21.3333 -21.3333 -21.3333 Z M 789.333 213.333 c -4.26667 0 -12.8 0 -17.0667 4.26667 L 640 354.133 V 277.333 c 0 -12.8 -8.53333 -21.3333 -21.3333 -21.3333 s -21.3333 8.53333 -21.3333 21.3333 v 128 c 0 12.8 8.53333 21.3333 21.3333 21.3333 h 128 c 12.8 0 21.3333 -8.53333 21.3333 -21.3333 s -8.53333 -21.3333 -21.3333 -21.3333 h -76.8 l 132.267 -132.267 c 8.53333 -8.53333 8.53333 -21.3333 0 -29.8667 c 0 -8.53333 -8.53333 -8.53333 -12.8 -8.53333 Z M 405.333 256 c -12.8 0 -21.3333 8.53333 -21.3333 21.3333 v 76.8 L 251.733 217.6 C 247.467 213.333 238.933 213.333 234.667 213.333 s -12.8 0 -17.0667 4.26667 c -4.26667 8.53333 -4.26667 25.6 0 34.1333 L 354.133 384 H 277.333 c -12.8 0 -21.3333 8.53333 -21.3333 21.3333 s 8.53333 21.3333 21.3333 21.3333 h 128 c 12.8 0 21.3333 -8.53333 21.3333 -21.3333 v -128 c 0 -12.8 -8.53333 -21.3333 -21.3333 -21.3333 Z" p-id="3510"></path></svg>
	</div>
    <div class="close" title="关闭" id="close">X</div>
    <main class="main_wrap login_outer_box ">
    <div class="login_info_box mx-auto">
        <form class="form  my-5 clearfix ">
            <h3 class=" text-center ">登录</h3>
            <div class="form-group">
                <label for="admin">账户:</label>
                <input type="text" class="form-control" id="login_admin" placeholder="请输入账号" />
            </div>
            <div class="form-group">
                <label for="password">密码:</label>
                <input type="password" class="form-control" id="login_password" placeholder="请输入密码" />
            </div>
            <div class="form-group lg_remember d-flex align-items-center justify-content-between">
                <span> 没有账号❓<a class="register text-danger text-decoration-none" href="http://192.168.1.13:8081/#/register">前往注册
                    </a></span>
                <!-- <ul class="d-flex float-right ">
                         <li class="btn wxlogin"></li>
                     </ul> -->
            </div>
            <button type="button" class="btn btn-success login w-75 mx-auto d-block ">登录</button>
        </form>
    </div>
    <div class="wx_login_box mx-auto text-center">
        <button type="button" class=" position-absolute close p-3" aria-label="关闭"> <span
                aria-hidden="true">&times;</span> </button>
        <div id="wxlogin" class="d-inline-block mx-auto mt-5">
        </div>
    </div>
    <div class="popup_animation">
        <div class="spinner-border mr-2" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
</main>
<main class="main_wrap data_show_box data_list p-3">
    <div>
        <button type="button" class="btn quit  mb-2 float-right ">退出</button>
    </div>
    <table cellpadding="0" cellspacing="0" class=" " id="thlg_table_data"></table>
</main>`
	const app = document.createElement('div')
	app.id = 'app-root'
	app.innerHTML = html
	$.log('追加 #app-root')
	document.querySelector('body').appendChild(app)
	$('#app-root').bg_move({
		move: '.title',
		size: 6,
	})

	// 绑定事件
	$.log('绑定按钮事件')
	eventBinding()
	// 执行回调
	$.log('#app-root 渲染成功，执行回调')
	callback()
}
let tabUrl = $(location)[0].href // 当前产品 页面URL
// 页面加载完 执行
document.addEventListener('DOMContentLoaded', function () {
	$('#twister li').click(function () {
		if ($(this)[0].dataset.dpUrl !== '') {
			// 更新 URL
			tabUrl = `${$(location)[0].origin}${$(this)[0].dataset.dpUrl}`
		}
	})
})


// 通信 程序开始
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.type) {
		case 'OPEN':
			$.log('判断是否存在#app-root')
			if (!document.querySelector('#app-root')) {
				$.log('开始渲染#app-root')
				floatingWindow(() => {
					// 判断登录
					$.log('判断登录')
					verifyLogin(() => {
						// 已登录 执行回调
						$.log('渲染数据表')
						renderTable($('#ASIN').val())
					})
				})
			}
			break
		default:
			sendResponse({
				type: 'error',
				info: '请选择正确的类型',
			})
			break
	}
})
