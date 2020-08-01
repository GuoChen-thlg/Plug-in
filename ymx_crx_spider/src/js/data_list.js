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
function renderTable() {
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
    },
    oAria: {
      sSortAscending: ": 以升序排列此列",
      sSortDescending: ": 以降序排列此列",
    },
  };
  // 表头 数据 配置
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
      // return: (data, type, row) => // 价格格式化
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
    {
      title: "描述",

      // render: (data, type, row) => {// 文字 省略号
      //   return $.fn.dataTable.render.ellipsis(10);
      // },
    },
    { title: "产品变体" },
    { title: "父级ASIN" },
    { title: "库存" },
    { title: "卖家数量" },
    { title: "配送方式" },
    {
      title: "是否追踪",
      data: null,
      render: (data, type, row) => {
        // console.dir(row);
        return `<input type="checkbox" data-asin=${row[18]} class=" product_watch d-block mx-auto">`;
      },
    },
  ];
  const table = $("#thlg_table_data").DataTable({
    language: zh_ch, // 语言配置
    autoWidth: true, // 自适应宽度
    scrollX: true, // 水平滚动
    scrollY: true, // 垂直滚动
    colReorder: true, // 移动列
    fixedHeader: true, // 固定头
    fixedColumns: true, // 固定列
    dom: "<'d-inline-block px-2'>Blfrtip", // 控件出现的顺序
    buttons: [
      { extend: "copy", text: "📋COPY" },
      { extend: "excel", text: "EXCEL", className: " btn-success" },
      { extend: "csv", text: "CSV", className: " btn-info" },
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
    // data: dataSet,//静态数据来源
    ajax: {
      // ajax 读取数据
      url: "https://easydoc.xyz/mock/HE7cbkeQ/p/60916792/wHbPEQMN",
      headers: {},
      dataSrc: "data",
    },
    columns, // 表头
    initComplete: function () {
      //初始化完成  绑定 点击事件 追踪产品
      $("input:checkbox").click(function () {
        let data = {
          checked: this.checked,
          asin: this.attributes["data-asin"].value,
        };
      });
    },
  });
  //
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
            ok: function () {},
          });
    },
    noText: "❌",
    no: () => {},
  });
});

SendMessageToContent(
  { type: "PRODUCTASIN" },
  (writeBack) => {
    if (writeBack.type || "ok" == writeBack.type) {
      console.log(writeBack.info);
      // console.log(
      //   /http[s]?\:\/\/[www]?\.amazon.*\/dp\/.*\?.*/g.test(writeBack.info.url)
      // );
      if (writeBack.info.asin && "" !== writeBack.info.asin) {
        renderTable();
      } else {
        $("#stock").text(writeBack.info.stock);
        $.cxDialog({
          title: "提示",
          info: "请到产品详情页面(待页面加载完成再打开)",
          okText: "✔",
          ok: function () {
            $(".popup_animation").css("display", "block");
          },
        });
      }
    } else {
      $.cxDialog({
        title: "提示",
        info: "建议您刷新页面后,重试",
        okText: "✔",
        ok: function () {
          $(".popup_animation").css("display", "block");
        },
      });
    }
  },
  (error) => {
    // 无法建立连接
    $.cxDialog({
      title: "提示",
      info: "建议您刷新页面后,重试",
      okText: "✔",
      ok: function () {
        $(".popup_animation").css("display", "block");
      },
    });
    console.warn(error.message);
  }
);
