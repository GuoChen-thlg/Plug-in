const data = {
  auth_code: null,
};
let tipsInfo = {
  side: 3,
  color: "#FFF",
  bg: "#FF00FF",
  time: "2",
};

$(location).attr("href", "../views/data_list.html");
// 用于校验登录是否过期，直接跳转进去 否则 重新登录
verifyLogin();
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
    login(uslogin_userer);
  }
});

// 注册按钮
$('button[type="button"].register').on("click", () => {
  // 注册逻辑
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
          data.auth_code = response.data.code;
          console.log(data);
        } else {
          console.log("err");
        }
      },
    });
  }
});

// $.cxDialog({
//   title: "提示",
//   info: "你好，",
// });

//    $("#Check")[0].checked,
/**
 * 登录
 *
 * @param {obj} user
 */
function login(user) {
  // 成功后即可登录
  // 假登陆
  verifyLogin();
  $.ajax({
    type: "POST",
    url: "http://192.168.1.146:5000/user/login",
    data: JSON.stringify(user),
    dataType: "json",
    success: function (response) {
      console.log(response);
      chrome.storage.sync.set(
        { user_login_info: "***登录信息**" },
        function () {
          // 通知保存完成。
          console.log("设置已保存");
        }
      );
      // 跳转页面
      $(location).attr("href", "../views/data_list.html");
    },
    error: function (err) {
      console.error(err);
    },
  });
}
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
    error: function (err) {
      $.cxDialog({
        title: "提示",
        info: "注册失败！",
      });
      console.error(err);
    },
  });
}
// chrome.storage.sync.set({ value: "theValue",value1:'1' }, function () {
//   // 通知保存完成。
//   console.log("设置已保存");
// });
function verifyLogin() {
  chrome.storage.sync.get("user_login_info", function (user_login_info) {
    if (user_login_info.token) {
      $(location).attr("href", "../views/data_list.html");
      console.log("已校验");
    } else {
      console.log("请登录");
    }
  });
}
