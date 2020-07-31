/**
 * 发送消息
 *
 * @param {obj} message
 * @param {function(obj)} callback
 */
function SendMessageToContent (message, callback, error) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (chrome.runtime.lastError) {
        error(chrome.runtime.lastError);
      } else {
        if (callback) callback(response);
      }
    });
  });
}

/**
 * 渲染表单
 *
 */
function renderTable () {
  // 语言配置
  const zh_ch = {
    sProcessing: `<div class="spinner-border spinner-border-sm mr-2" role="status"> <span class="sr-only">Loading...</span> </div>处理中...`,
    sLengthMenu: "显示 _MENU_ 项结果",
    sZeroRecords: "没有匹配结果",
    sInfo: "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
    sInfoEmpty: "显示第 0 至 0 项结果，共 0 项",
    sInfoFiltered: "(由 _MAX_ 项结果过滤)",
    sInfoPostFix: "",
    sSearch: "搜索:",
    sUrl: "URL",
    sEmptyTable: "表中数据为空",
    sLoadingRecords: `<div class="spinner-border spinner-border-sm mr-2" role="status"> <span class="sr-only">Loading...</span> </div>载入中...`,
    sInfoThousands: ",",
    oPaginate: {
      sFirst: "首页",
      sPrevious: "上页",
      sNext: "下页",
      sLast: "末页",
      sSearch: "过滤记录:",
    },
    oAria: {
      sSortAscending: ": 以升序排列此列",
      sSortDescending: ": 以降序排列此列",
    },
  };
  const columns = [
    {
      title: "产品SKU",
      render: (data, type, row) => {
        // console.log(type);
        return `thlg-${data}`;
      },
    },
    { title: "产品名称" },
    { title: "产品标题" },
    {
      title: "首图",
      // render: (data, type, row) => {
      //   return `<img src='data'/>`;
      // },
    },
    { title: "产品标题" },
    {
      title: "产品价格 ",
      // return: (data, type, row) =>
      //   $.fn.dataTable.render.number(",", ".", 2, "$"),
    },
    { title: "排名" },
    { title: "节点排名" },
    { title: "产品评分" },
    { title: "产品评论数量" },
    { title: "问答数" },
    { title: "品牌名" },
    { title: "卖家" },
    { title: "所属类别" },
    { title: "上架时间" },
    { title: "产品规格" },
    { title: "描述" },
    { title: "产品变体" },
    { title: "父级ASIN" },
    { title: "库存" },
    { title: "卖家数量" },
    { title: "配送方式" },
  ];
  $("#thlg_table_data").DataTable({
    language: zh_ch, // 语言配置
    autoWidth: true, // 自适应宽度
    scrollX: true, // 水平滚动
    scrollY: true, // 垂直滚动
    // data: dataSet,//静态数据来源
    ajax: {
      // ajax 读取数据
      url: "https://easydoc.xyz/mock/HE7cbkeQ/p/60916792/wHbPEQMN",
      dataSrc: "data",
    },
    columns, // 表头
  });
}
// 弹窗样式
$.cxDialog.defaults.baseClass = "ios";
// 退出按鈕
$('button[type="button"].quit').on("click", () => {
  console.log($.cookie("token"));

  $.cxDialog({
    title: "提示",
    info: "确认退出该账号吗❓",
    okText: "✔",
    ok: function () {
      $.removeCookie("token", { path: "/" })
        ? $(location).attr("href", "../views/popup.html")
        : $.cxDialog({
          title: "提示",
          info: "确认退出该账号吗❓",
          okText: "✔",
          ok: function () { },
        });
    },
    noText: "❌",
    no: () => { },
  });
});

SendMessageToContent({ type: "PRODUCTASIN" },
  (writeBack) => {
    console.log(writeBack);
    if (writeBack.type || 'ok' == writeBack.type) {
      console.log(writeBack.info);
      if (writeBack.info.asin && '' !== writeBack.info.asin) {
        renderTable();
      } else {
        $("#stock").text(writeBack.info.stock);
        $.cxDialog({
          title: "提示",
          info: "请到产品详情页面",
          okText: "✔",
          ok: function () {
            $('.popup_animation').css('display', 'block')
          },
        });
      }
    }
    else {
      $.cxDialog({
        title: "提示",
        info: "请在产品详情页打开",
        okText: "✔",
        ok: function () { },
      });
    }
  }, (error) => {
    // 无法建立连接
    $.cxDialog({
      title: "提示",
      info: "请刷新页面后,重新打开",
      okText: "✔",
      ok: function () { },
    });
    console.warn(error.message);
  });
