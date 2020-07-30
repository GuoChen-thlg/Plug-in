/**
 *获得当前页面的 URL
 *
 * @param {function(string)} callback
 * @return {string} URL
 */
function getTabUrl(callback) {
  let queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    let tab = tabs[0];
    console.assert(typeof tab.url == "string", "tab.url 应该是一个字符串");
    callback(tab.url);
  });
}
getTabUrl((url) => {
  console.log(url);
});
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

$("#thlg_table_data")
  .on("init", () => {
    console.log("加载完成");
  })
  .DataTable({
    language: zh_ch, // 语言配置
    jQueryUI: true, //
    autoWidth: true, // 自适应宽度
    scrollX: true, // 水平滚动
    scrollY: true, // 垂直滚动
    // data: dataSet,//数据来源
    ajax: {
      url: "https://easydoc.xyz/mock/HE7cbkeQ/p/60916792/wHbPEQMN",
      dataSrc: "data",
    },
    columns: [
      { title: "产品SKU" },
      { title: "产品名称" },
      { title: "产品标题" },
      { title: "首图" },
      { title: "产品标题" },
      { title: "产品价格 " },
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
    ],
  });
