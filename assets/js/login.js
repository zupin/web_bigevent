$(function() {
  // alert(11);
  // 点击去注册账号的链接 切换成注册状态
  $('#link_reg').on('click', function() {
    // $('.login-box').css('display', 'none');
    $('.login-box').hide();
    // $(this).parent().hide()
    // $('.reg-box').css('display', 'block');
    $('.reg-box').show();
  });
  // 点击去登录的链接 切换成登录状态
  $('#link_login').on('click', function() {
    $('.reg-box').hide();
    $('.login-box').show();
  });

  // 从layUI上获取form对象
  var form = layui.form;
  // 通过form.verify()来自定义校验规则
  form.verify({
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    // 自定义了一个pwd的规则
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致的规则
    repwd: function(value) {
      // 通过形参拿到的是确认密码框的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败，则return一个提示消息即可
      var pwd = $('.reg-box [name=password]').val();
      if (value !== pwd) {
        return '两次密码不一致';
      }
    }
  });   
  
  // 从layUI上获取layer对象
  var layer = layui.layer;
  var data = {
    username: $('#form_reg [name=username]').val(),
    password: $('#form_reg [name=password]').val()
  };
  // 监听注册表单的点击事件
  $('#form_reg').on('submit', function(e) {
    // 1、阻止表单默认提交行为
    e.preventDefault();
    // 2、发起Ajax的post请求
    $.post('/api/reguser', data, function(res) {
      // console.log(res);
      if (res.status !== 0) {
        // 注册失败
        // return console.log(res.message);
        return layer.msg(res.message);
      } 
      // console.log('注册成功！');
      layer.msg('您已注册成功！请登录！');
      // 模拟人的点击登录行为
      $('#link_login').click();
    });
    
  });

  // 监听登录表单的点击事件
  $('#form_login').submit(function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/login',
      /* data: {
        username: $('#form_login [name=username]').val(),
        password: $('#form_login [name=password]').val()
      }, */
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function(res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('登录失败！');
        } 
        layer.msg('登录成功！');
        // console.log(res.token);
        // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDk5MiwidXNlcm5hbWUiOiJ6dXBpbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIiLCJlbWFpbCI6IiIsInVzZXJfcGljIjoiIiwiaWF0IjoxNjUxNTAwMDQ0LCJleHAiOjE2NTE1MzYwNDR9.gqsymAnE6BjIcfsF8r9GICogONrK7GHt72W7fjVQNdw
        // 将登录成功的token字符串，保存到localStorage中
        localStorage.setItem('token', res.token);
        // 跳转到后台主页
        location.href = '/index.html'

      }
    })
  });




})