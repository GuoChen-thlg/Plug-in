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

document.addEventListener("DOMContentLoaded", function () {
  addRepertory();
});
function addRepertory() {
  let tabUrl = window.location.href; // 当前页面URL
  // 产品id
  let productId = tabUrl.match(/(\/dp\/)\w*(\/)/)
    ? tabUrl.match(/(\/dp\/)\w*(\/)/)[0].split("/")[2]
    : tabUrl.match(/(\/product\/)\w*(\/)/)[0].split("/")[2];
  if ($("#addToCart")[0]) {
    // 当前页面是否存在 添加购物车按钮
    let data = $("#addToCart").serializeObject();
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

            let sum = $(pagrhtml)
              .find(`div[data-asin='${productId}']`)
              .find(`input[name='quantityBox']`)
              .val();
            if ($(".thlg_sum_box").length > 0) {
              $(".thlg_sum_box #repertory").text(sum);
            } else {
              $("#quantity").parent().after(`
             <div class='thlg_sum_box' title='剩余库存/商家限购数量'>
            剩余库存: <span id='repertory'>${sum}</span> 
             </div>
             `);
            }
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
