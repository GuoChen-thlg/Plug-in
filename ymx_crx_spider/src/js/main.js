/**
 * @description 渲染数据表
 *
 * @param {Array} asinlist  ASINs
 * @param {Array} trackList
 */
function renderTable(asinlist) {
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
		sUrl: '',
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
			title: `<div class="custom-control custom-switch">
			<input type="checkbox" class="custom-control-input"style="display:none" id="customSwitch1">
			<label class="custom-control-label" for="customSwitch1">
			<span class="multiterm"  title="勾选表示要追踪的商品,已勾选表示已追踪的商品" >多项追踪</span>
			<span class="single" title="追踪单个商品,已勾选表示已追踪的商品,可取消追踪" >单项追踪</span>
			</label>
		  </div>`,
			data: 'asin',
			orderable: false,
			render: (data, type, row) => {
				let flag = TRACKLIST.indexOf(data) > -1
				return `<input type="checkbox" data-multiterm data-asin=${data} ${
					flag ? 'checked' : ''
				} ${flag ? 'disabled' : ''} class=" multiterm product_watch  mx-auto">
				<input type="checkbox" data-single data-asin=${data} ${
					flag ? 'checked' : ''
				} class=" single product_watch  mx-auto">`
			},
		},
		{
			title: '产品SKU',
			data: 'asin',
		},
		{
			title: '产品名称',
			data: 'name',
			className: 'product_name',
			width: '200px',
			render: (data, type, row) => {
				// 文字 省略号
				return `<span class="omit" title="${data}">${data}</span>`
			},
		},
		{
			title: '首图',
			data: 'img_url',
			render: (data, type, row) => {
				return `<img class="product_img" src='${data}'/> <span style="display:none">${data}</span>`
			},
		},
		{
			title: '产品标题',
			data: 'title',
			render: (data, type, row) => {
				// 文字 省略号
				return `<span class="omit" title="${data}">${data}</span>`
			},
		},
		{
			title: '产品价格 ',
			data: 'price',
			className: 'product_price',
			render: (data, type, row) => {
				return `<span data-asin=${row.asin} data-self="" title="点击查看数据趋势变化">${data}</span>`
			},
		},
		{
			title: '排名',
			data: 'bsn',
			className: 'product_bsn',
			render: (data, type, row) => {
				return `<span data-asin=${row.asin} title="点击查看数据趋势变化">${data}</span>`
			},
		},
		{
			title: '节点排名',
			data: 'node_ranking',
			className: 'product_ranking',
			render: (data, type, row) => {
				return `<span data-asin=${row.asin} title="点击查看数据趋势变化">${data}</span>`
			},
		},
		{
			title: '产品评分',
			data: 'reviews_rating',
			className: 'product_reviews_rating',
			render: (data, type, row) => {
				return `<span data-asin=${row.asin} title="点击查看数据趋势变化">${data}</span>`
			},
		},
		{
			title: '产品评论数量',
			data: 'reviews_count',
			className: 'product_reviews_count',
			render: (data, type, row) => {
				return `<span data-asin=${row.asin} title="点击查看数据趋势变化">${data}</span>`
			},
		},
		{
			title: '问答数',
			data: 'q_a',
			className: 'product_q_a',
			render: (data, type, row) => {
				return `<span data-asin=${row.asin} title="点击查看数据趋势变化">${data}</span>`
			},
		},
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
				return `<span class="omit" title="${data}">${data}</span>`
			},
		},
		{
			title: '产品变体',
			data: 'variation_asins',
			render: (data, type, row) => {
				// 文字 省略号
				return `<span class="omit" title="${data}">${data}</span>`
			},
		},
		{ title: '父级ASIN', data: 'parernt_asin' },
		{ title: '库存', data: 'stock' },
		{ title: '卖家数量', data: 'num_sellers' },
		{
			title: '配送方式',
			data: 'delivery',
			render: (data, type, row) => {
				return data == '' ? 'FBM' : 'FBA'
			},
		},
		{ title: '记录时间', data: 'crawl_time' },
	]
	$.loading(true)
	$.log('初始化 Table')
	const table = (TABLE = $('#thlg_table_data').DataTable({
		language: zh_ch, // 语言配置
		retrieve: true, // 返回 table 事例
		autoWidth: true, // 自适应宽度
		scrollX: true, // 水平滚动
		scrollY: '400px', // 垂直滚动
		colReorder: true, // 移动列
		fixedHeader: true, // 固定头
		fixedColumns: false, // 固定列
		deferRender: true, // 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
		serverSide: false, // 控制服务端分页
		paging: true, // 开启本地分页
		searching: true, // 本地搜索
		lengthMenu: [
			[10, 50, 100, 500, -1],
			[10, 50, 100, 500, 'All'],
		], // 分页
		dom: "<'d-inline-block px-2'>Blfrtip", // 控件出现的顺序
		buttons: [
			{
				extend: 'trace',
				text: '追踪已勾选项',
				className: ' btn-warning btn-trace',
			},
			{ extend: 'copy', text: '📋COPY' },
			{
				extend: 'excel',
				text: 'EXCEL',
				className: ' btn-success',
				charset: 'UTF-8',
				title: `产品信息${new Date().toLocaleDateString()}${new Date().toLocaleTimeString()}`,
				exportOptions: {
					columns: [
						1,
						2,
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						11,
						12,
						13,
						14,
						15,
						16,
						17,
						18,
						19,
						20,
						21,
						22,
					],
				},
			},
			{
				extend: 'csv',
				text: 'CSV',
				className: ' btn-info',
				bom: true,
				title: `产品信息${new Date().toLocaleDateString()}${new Date().toLocaleTimeString()}`,
				exportOptions: {
					columns: [
						1,
						2,
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						11,
						12,
						13,
						14,
						15,
						16,
						17,
						18,
						19,
						20,
						21,
						22,
					],
				},
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
				targets: [0, 1, 2, 3, 4, 11, 12, 13, 14, 16, 17, 18, 21],
				orderable: false, //是否排序
			},
		],
		ajax: {
			// ajax 读取数据
			type: 'GET',
			url: `${API_URL}/custom/user/amzproductList/${asinlist.toString()}`,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			dataSrc: 'rows',
			data: {
				// 分页使用
				// pageNum: '',
				// pageSize:''
			},
			error: function (XMLHttpRequest, errorinfo, error) {
				$.log(XMLHttpRequest)
				if (errorinfo === 'error') {
					$.cxDialog({
						title: '提示',
						info: '该款产品数据维护中...',
						okText: '✔',
						ok: () => {
							wicketClose()
						},
					})
				}
			},
		},
		columns, // 表头
		initComplete: function () {
			// 初始化完成
			// 按钮切换
			trackSwitch()
			table_init_binding()
			$.loading(false)
			$.log('Table 初始化完成')
		},
	}))
	table.on('xhr', function (e, settings, json) {
		table.off('xhr') //关闭监听该事件
		$.log(json)
		if (json.status === 'error') {
			$.cxDialog({
				title: '提示',
				info: '该款产品数据维护中...',
				okText: '✔',
				ok: () => {
					wicketClose()
				},
			})
		}
	})
}

/**
 * @description 打开浮动窗口
 *
 * @param {Function} callback 渲染成功 执行回调
 */
function floatingWindow(callback) {
	$.log('开始渲染#app-root')
	if (findAllAsin().length == 0) {
		$.cxDialog({
			title: '提示',
			info: '请在 产品详情/产品列表 页打开',
			okText: '✔',
			ok: () => {},
		})
		return
	}
	let html = `
	<div class="title">产品信息</div>
	<div class="full-screen-box">
	<svg t="1598063281831" class="icon full" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3328" width="20" height="20"><path d="M641.750109 384.100028l205.227128-204.519-0.704035 115.89966c-0.282433 9.611915 7.489578 18.09103 17.101493 17.808598l12.297071 0c9.611915-0.283456 17.667382-5.936199 17.808598-15.689331l0.565888-172.57752c0-0.14224 0.282433-9.187243 0.282433-9.187243 0.14224-4.804423-0.99056-9.187243-4.100388-12.297071-3.109828-3.109828-7.347339-5.086855-12.297071-4.946662l-8.763594 0.14224c-0.141216 0-0.278339 0-0.420579 0.14224L697.581696 98.166787c-9.611915 0.283456-17.667382 8.200776-17.808598 17.950837l0 12.297071c1.416256 11.44875 10.458189 18.092054 20.070104 17.808598l112.789832 0.283456-204.66124 203.814965c-9.329483 9.329483-9.329483 24.449855 0 33.778314 9.329483 9.470699 24.452925 9.470699 33.782408 0L641.750109 384.100028zM383.095141 576.889893 177.726797 780.705881l0.707105-115.338888c0.283456-9.607822-7.492648-18.086937-17.104563-17.808598l-13.001105 0c-9.611915 0.283456-17.667382 5.937223-17.808598 15.690354l-0.565888 172.718737c0 0.14224-0.282433 9.187243-0.282433 9.187243-0.14224 4.808516 0.99056 9.187243 4.096295 12.297071 3.109828 3.109828 7.351432 5.086855 12.297071 4.946662l8.762571-0.14224c0.14224 0 0.283456 0 0.425695-0.14224l171.873486 0.708128c9.607822-0.283456 17.667382-8.196683 17.808598-17.950837L344.93503 832.575226c-1.415232-11.44875-10.461259-18.092054-20.074198-17.808598L212.069977 814.483172 416.59 610.671277c9.329483-9.329483 9.329483-24.453948 0-33.782408C407.40685 567.41817 392.424624 567.41817 383.095141 576.889893L383.095141 576.889893zM894.047276 835.967486l-0.424672-172.718737c-0.283456-9.612938-8.200776-15.406898-17.809621-15.690354l-12.296047 0c-9.612938-0.278339-17.243733 8.200776-17.105586 17.808598l0.708128 115.903753L641.750109 576.889893c-9.329483-9.329483-24.452925-9.329483-33.782408 0-9.325389 9.328459-9.325389 24.452925 0 33.782408L812.490795 814.483172l-112.789832 0.283456c-9.611915-0.283456-18.515702 6.502088-20.073174 17.808598l0 12.297071c0.282433 9.611915 8.200776 17.667382 17.808598 17.950837l171.166381-0.708128c0.141216 0 0.282433 0.14224 0.424672 0.14224l8.763594 0.14224c4.803399 0.141216 9.187243-1.694595 12.296047-4.946662 3.109828-3.109828 4.238534-7.488555 4.097318-12.297071 0 0-0.14224-9.046027-0.14224-9.187243L894.047276 835.968509zM212.216309 146.506748l112.789832-0.283456c9.607822 0.283456 18.512632-6.502088 20.070104-17.808598L345.076246 116.116601c-0.283456-9.611915-8.196683-17.667382-17.808598-17.950837l-172.011632 0.708128c-0.14224 0-0.283456-0.14224-0.425695-0.14224l-8.761548-0.14224c-4.808516-0.141216-9.187243 1.694595-12.297071 4.946662-3.109828 3.109828-4.242627 7.488555-4.096295 12.297071 0 0 0.282433 9.046027 0.282433 9.187243l0.420579 172.718737c0.14224 9.608845 8.200776 15.406898 17.808598 15.686261l13.005198 0c9.611915 0.282433 17.242709-8.196683 17.10047-17.808598l-0.564865-115.334795 205.231221 203.958228c9.324366 9.329483 24.448832 9.329483 33.777291 0 9.329483-9.329483 9.329483-24.452925 0-33.782408L212.216309 146.506748 212.216309 146.506748zM212.216309 146.506748" p-id="3329"></path></svg>
	<svg t="1598064061108" class="icon small" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3509" width="20" height="20"><path d="M 669.867 640 h 76.8 c 12.8 0 21.3333 -8.53333 21.3333 -21.3333 s -8.53333 -21.3333 -21.3333 -21.3333 h -128 c -12.8 0 -21.3333 8.53333 -21.3333 21.3333 v 128 c 0 12.8 8.53333 21.3333 21.3333 21.3333 s 21.3333 -8.53333 21.3333 -21.3333 v -76.8 l 132.267 132.267 c 4.26667 4.26667 8.53333 4.26667 17.0667 4.26667 s 12.8 0 17.0667 -4.26667 c 8.53333 -8.53333 8.53333 -21.3333 0 -29.8667 L 669.867 640 Z M 405.333 597.333 h -128 c -12.8 0 -21.3333 8.53333 -21.3333 21.3333 s 8.53333 21.3333 21.3333 21.3333 h 76.8 l -132.267 132.267 c -8.53333 8.53333 -8.53333 21.3333 0 29.8667 c 0 8.53333 8.53333 8.53333 12.8 8.53333 s 12.8 0 17.0667 -4.26667 L 384 669.867 v 76.8 c 0 12.8 8.53333 21.3333 21.3333 21.3333 s 21.3333 -8.53333 21.3333 -21.3333 v -128 c 0 -12.8 -8.53333 -21.3333 -21.3333 -21.3333 Z M 789.333 213.333 c -4.26667 0 -12.8 0 -17.0667 4.26667 L 640 354.133 V 277.333 c 0 -12.8 -8.53333 -21.3333 -21.3333 -21.3333 s -21.3333 8.53333 -21.3333 21.3333 v 128 c 0 12.8 8.53333 21.3333 21.3333 21.3333 h 128 c 12.8 0 21.3333 -8.53333 21.3333 -21.3333 s -8.53333 -21.3333 -21.3333 -21.3333 h -76.8 l 132.267 -132.267 c 8.53333 -8.53333 8.53333 -21.3333 0 -29.8667 c 0 -8.53333 -8.53333 -8.53333 -12.8 -8.53333 Z M 405.333 256 c -12.8 0 -21.3333 8.53333 -21.3333 21.3333 v 76.8 L 251.733 217.6 C 247.467 213.333 238.933 213.333 234.667 213.333 s -12.8 0 -17.0667 4.26667 c -4.26667 8.53333 -4.26667 25.6 0 34.1333 L 354.133 384 H 277.333 c -12.8 0 -21.3333 8.53333 -21.3333 21.3333 s 8.53333 21.3333 21.3333 21.3333 h 128 c 12.8 0 21.3333 -8.53333 21.3333 -21.3333 v -128 c 0 -12.8 -8.53333 -21.3333 -21.3333 -21.3333 Z" p-id="3510"></path></svg>
	</div>
    <div class="_close" title="关闭" id="close">X</div>
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
               <!--  <ul class="d-flex float-right ">
                         <li class="btn wxlogin"><img src="https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon24_wx_button.png" /></li>
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
</main>
<div class="popup_animation">
	<div class="spinner-border mr-2" role="status">
		<span class="sr-only">Loading...</span>
	</div>
</div>
<main class="main_wrap data_show_box data_list p-3">
    <div>
    <span id="user_name"></span><button type="button" class="btn quit  mb-2 float-right ">退出</button><button type="button" id='refresh_data' class="btn  btn-dark mb-2 float-right ">刷新页面</button> 
    </div>
    <table cellpadding="0" cellspacing="0" class=" " id="thlg_table_data"></table>
</main>`
	const app = document.createElement('div')
	app.id = 'app-root'
	app.innerHTML = html
	document.querySelector('body').appendChild(app)
	$('#app-root').bg_move({
		move: '.title',
		size: 12,
	})
	// 绑定事件
	$.log('绑定按钮事件')
	eventBinding()
	// 执行回调
	$.log('#app-root 渲染成功，执行回调')
	callback()
}

// 通信 程序开始
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.type) {
		case 'OPEN':
			$(() => {
				$.log('判断是否存在#app-root')
				if (!document.querySelector('#app-root')) {
					floatingWindow(() => {
						// 判断登录
						verifyLogin(() => {
							// 已登录 执行回调
							$.loading(true)
							queryTracking(trackList => {
								TRACKLIST = trackList
								renderTable([$('#ASIN').val(), ...findAllAsin()])
							})
						})
					})
				}
			})
			break
		default:
			sendResponse({
				type: 'error',
				info: '请选择正确的类型',
			})
			break
	}
})
