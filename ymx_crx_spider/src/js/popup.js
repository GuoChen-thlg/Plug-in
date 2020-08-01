// 弹窗统一配置
$.cxDialog.defaults.baseClass = "ios";
// 提示统一配置
let tipsInfo = {
  side: 3,
  color: "#FFF",
  bg: "#FF00FF",
  time: "2",
};
/**
 * 登录
 *
 * @param {obj} user
 */
function login(user) {
  // 成功后即可登录
  // 假登陆
  $(".popup_animation").css("display", "block");
  $.ajax({
    type: "POST",
    url: "http://192.168.1.146:5000/user/login",
    data: { ...user },
    dataType: "json",
    success: function (response) {
      console.log(response);
      // 跳转页面
      $(".popup_animation").css("display", "none");
      $(location).attr("href", "../views/data_list.html");
    },
    error: function (xhr, status, error) {
      let info = null;
      switch (status) {
        case "error":
          info = "登录失败😅，请稍后重试。";
          break;
        case "timeout":
          info = "请求超时😅，请稍后重试。";
          break;
        default:
          info = "错误😅，请稍后重试。";
          break;
      }
      $(".popup_animation").css("display", "none");
      $.cxDialog({
        title: "提示",
        info,
        okText: "✔",
        ok: () => {},
      });
      console.error(error);
    },
  });
}
/**
 * 验证是否需要登录
 *
 */
function verifyLogin() {
  console.log($.cookie("token"));
  if (!!$.cookie("token")) {
    $(location).attr("href", "../views/data_list.html");
  }
}

// 登录按钮
$('button[type="button"].login').on("click", () => {
  // 用户信息
  let login_user = {
    username: $("#login_admin").val().trim(),
    passwd: $("#login_password").val().trim(),
  };
  if (login_user.username == "") {
    $("#login_admin")
      .tips({ ...tipsInfo, msg: "请填写账号" })
      .focus();
  } else if (login_user.passwd == "") {
    $("#login_password")
      .tips({ ...tipsInfo, msg: "请填写密码" })
      .focus();
  } else {
    // login(login_user);

    /********************************* 测试区 ******************************* */
    // 跳转至页面
    $.cookie("token", "15645465456", {
      expires: 1,
      path: "/",
    });
    $(location).attr("href", "../views/data_list.html");
    /******************************************************************** */
  }
});

// 注册
$(".register").on("click", function (e) {
  e.preventDefault();
  open($(".register")[0].href);
  return false;
});

// 用于校验登录是否过期，直接跳转进去 否则 重新登录
verifyLogin();
// $("#Check")[0].checked,
