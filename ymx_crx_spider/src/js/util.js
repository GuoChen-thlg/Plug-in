$.extend({
	log: function (...data) {
		console.log(...data)
	},
	hint: function (info, ss = 500) {
		$.cxDialog(info)
		// $('.cxdialog_info').css({
		// 	'background-color': 'rgba(0,0,0,.6)',
		// 	padding: ' 10px',
		// 	margin: ' 0',
		// 	color: ' #fff',
		// })
		setTimeout(() => {
			$.cxDialog.close()
		}, ss)
	},
})