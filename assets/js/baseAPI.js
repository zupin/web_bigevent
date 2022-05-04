// 注意：每次调用$.get()或者$.post 或$.ajax()的时候，会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的内置对象
$.ajaxPrefilter(function(options) {
  // console.log(options.url);
  // 在发起真正的Ajax请求之前，统一拼接请求的根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url;
  // console.log(options.url); // http://www.liulongbin.top:3007/api/login

  // 统一 为有权限的接口，设置headers请求头
  // headers 就是请求头配置对象
  // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载 complete 回调函数
  options.complete = function(res) {
    // 在 complete 回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1、强制清空token
      localStorage.removeItem('token');
      // 2、强制跳转到登录界面
      location.href = '/login.html';
    }
  }
  
})