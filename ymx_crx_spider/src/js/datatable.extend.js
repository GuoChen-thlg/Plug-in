$.fn.dataTable.ext.buttons.trace = {
	text: 'TRACE',
	action: function (e, dt, node, config) {
		// console.log(dt)
		// console.log(node)
		$.log(config)
		$.log($.cookie('token'))

		let list = $('input:checked[data-multiterm]')
		let asins = []
		list.each(function () {
			asins.push(this.attributes['data-asin'].value)
		})
		$.log(asins)

		list.each(function () {
			$(this).prop('checked', false)
			$.hint('失败')
		})
		// $.ajax({
		// 	type: 'GET',
		// 	url: `${API_URL}/custom/user/addtrack?u_name=${$.cookie('token')}&asin=${
		// 		data.asin
		// 	}`,
		// 	headers: {
		// 		'Content-Type': 'application/json; charset=utf-8',
		// 	},
		// 	success: function (response) {
		// 		$.log(response)
		// 		if (response.status === 'success') {
		// 			$('.popup_animation').css('display', 'none')
		// 			$.hint('跟踪成功')
		// 		} else {
		// 			$(_this).prop('checked', false)
		// 			$('.popup_animation').css('display', 'none')
		// 			$.hint('跟踪失败')
		// 		}
		// 	},
		// 	error: function (xhr, status, error) {
		// 		$.log(status)
		// 		$(_this).prop('checked', false)
		// 		$('.popup_animation').css('display', 'none')
		// 		$.hint('跟踪失败')
		// 	},
		// })
	},
}
