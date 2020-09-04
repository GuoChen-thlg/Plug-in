$.fn.dataTable.ext.buttons.trace = {
	text: 'TRACE',
	action: function (e, dt, node, config) {
		let list = $('input:checked[data-multiterm]')
		let asins = []
		list.each(function () {
			asins.push(this.attributes['data-asin'].value)
		})
		let data = []
		asins.forEach(o => {
			data.push({
				u_name: $.cookie('token'),
				p_asin: o,
			})
		})

		$.ajax({
			type: 'GET',
			url: `${API_URL}/custom/user/addtracks`,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			data: JSON.stringify(data),
			success: function (response) {
				$.log(response)
				if (response.status === 'success') {
					$.loading(false)
					$.hint('跟踪成功')
				} else {
					list.each(function () {
						$(this).prop('checked', false)
						$.hint('失败')
					})
					$.loading(false)
					$.hint('跟踪失败')
				}
			},
			error: function (xhr, status, error) {
				$.log(status)
				list.each(function () {
					$(this).prop('checked', false)
					$.hint('失败')
				})
				$.loading(false)
				$.hint('跟踪失败')
			},
		})
	},
}
