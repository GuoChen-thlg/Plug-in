// 表单 JSON 化
$.prototype.serializeObject = function () {
  var a, o, h, i, e;
  a = this.serializeArray();
  o = {};
  h = o.hasOwnProperty;
  for (i = 0; i < a.length; i++) {
    e = a[i];
    if (!h.call(o, e.name)) {
      o[e.name] = e.value;
    }
  }
  return o;
};
let tabUrl = $(location)[0].href, // 当前产品 页面URL
  stock = ''; // 库存
// 通信 回复消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "PRODUCTASIN":
      sendResponse({
        type: "ok",
        info: {
          asin: $("#ASIN").val(),
          url: tabUrl,
        },
      });
      break;
    default:
      sendResponse({
        type: "error",
        info: "请选择正确的类型",
      });
      break;
  }
});
/**
 * 添加库存
 *
 */
function addRepertory () {
  if ($("#addToCart")[0]) {
    // 当前页面是否存在 添加购物车按钮
    let data = $("#addToCart").serializeObject();
    // console.dir(data);
    data["quantity"] = 999;
    $.ajax({
      type: "post",
      url: $("#addToCart")[0].action,
      data: data,
      headers: {
        "x-requested-with": "XMLHttpRequest",
        "content-type": "application/x-www-form-urlencoded",
        accept: "text/html,*/*",
      },
      success: function (html) {
        $.ajax({
          type: "GET",
          url: $(html).find("#hlb-view-cart-announce")[0].href,
          success: function (pagrhtml) {
            //   该款产品的库存数量/商家限购数量
            stock = $(pagrhtml)
              .find(`div[data-asin='${data.ASIN}']`)
              .find(`input[name='quantityBox']`)
              .val();
            if ($(".thlg_sum_box").length > 0) {
              $(".thlg_sum_box #repertory").text(stock);
            } else {
              $("form #availability").after(`
             <div class='thlg_sum_box' title='剩余库存/商家限购数量'>
            剩余库存: <span id='repertory'>${stock}</span>
             </div>
             `);
            }
            console.log(`库存：${stock}`);

            // TODO 购物车中删除商品   #activeCartViewForm
            // let formdata = $(pagrhtml).find("#activeCartViewForm").serializeObject()
            // console.log(formdata);
          },
          error: function (err) {
            console.log(err);
          },
        });
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
}

// 页面加载完 执行
document.addEventListener("DOMContentLoaded", function () {
  $("#twister li").click(function () {
    if ($(this)[0].dataset.dpUrl !== "") {
      tabUrl = `${$(location)[0].origin}${$(this)[0].dataset.dpUrl}`;
    }
    setTimeout(() => {
      addRepertory();
    }, 5000);
  });
  addRepertory();
});
