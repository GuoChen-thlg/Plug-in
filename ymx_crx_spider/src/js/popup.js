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
 *  注册
 *
 * @param {obj} user
 */
function register(user) {
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    url: "url",
    data: JSON.stringify(user),
    success: function (response) {
      console.log(response);
      $.cxDialog({
        title: "提示",
        info: "您已注册成功！",
      });
    },
    error: function (xhr, status, error) {
      $.cxDialog({
        title: "提示",
        info: "注册失败！",
      });
      console.error(error);
    },
  });
}

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
  // 切换表单
  $(".login_info_box").css("display", "block");
  $(".register_info_box").css("display", "none");
  // 用户信息
  let login_user = {
    username: $("#login_admin").val().trim(),
    passwd: $("#login_password").val().trim(),
  };
  if (login_user.username == "") {
    $("#login_admin").tips({ ...tipsInfo, msg: "请填写账号" });
  } else if (login_user.passwd == "") {
    $("#login_password").tips({ ...tipsInfo, msg: "请填写密码" });
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

// 注册按钮
$('button[type="button"].register').on("click", () => {
  // 切换表单
  $(".login_info_box").css("display", "none");
  $(".register_info_box").css("display", "block");
  // 用户注册信息
  let register_user = {
    username: $("#register_admin").val().trim(),
    passwd: $("#first_register_password").val().trim(),
    code: $("#auth_code").val().trim(),
  };
  if (!/^1[3456789]\d{9}$/.test(register_user.username)) {
    $("#register_admin").tips({ ...tipsInfo, msg: "请输入正确的手机号" });
  } else if (!/^[\d]{6}$/.test(register_user.code)) {
    $("#auth_code").tips({ ...tipsInfo, msg: "请输入6位数验证码" });
  } else if (!/^[a-z0-9_-]{6,18}$/.test(register_user.passwd)) {
    $("#first_register_password").tips({
      ...tipsInfo,
      msg: "请填写6-18位密码(字母、数字、下划线)",
    });
  } else if (
    $("#first_register_password").val().trim() !==
    $("#last_register_password").val().trim()
  ) {
    $("#last_register_password").tips({
      ...tipsInfo,
      msg: "两次密码填写不一致",
    });
  } else {
    // register(register_user);
    console.log("去注册");
  }
});

// 验证码按钮
$('button[type="button"].auth_code').on("click", () => {
  let phone = $("#register_admin").val().trim();
  if (!/^1[3456789]\d{9}$/.test(phone)) {
    $("#register_admin").tips({ ...tipsInfo, msg: "请输入正确的手机号" });
  } else {
    let ss = 60;
    let times = setInterval(() => {
      $('button[type="button"].auth_code').attr("disabled", "disabled");
      $('button[type="button"].auth_code').text(ss);
      if (ss == 0) {
        $('button[type="button"].auth_code').text("接收验证码");
        $('button[type="button"].auth_code').removeAttr("disabled");
        clearInterval(times);
      }
      ss--;
    }, 1000);
    $.ajax({
      type: "POST",
      url: "https://easydoc.xyz/mock/HE7cbkeQ/p/60916792/gVfJpOJw",
      data: JSON.stringify({ phone }),
      dataType: "json",
      success: function (response) {
        if (response.code == 200) {
          console.log(data);
        } else {
          console.log("err");
        }
      },
      error: function (xhr, status, error) {},
    });
  }
});

// 用于校验登录是否过期，直接跳转进去 否则 重新登录
verifyLogin();
// $("#Check")[0].checked,
