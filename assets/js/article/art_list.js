$(function() {
  // alert('11111');

  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;


  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date);

    // 获取年月日 时分秒
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }

  // 定义一个查询的参数对象，以便将来请求数据的时候
  // 将需要的请求参数对象提交给服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示条
    cate_id: '', // 文章分类的id，可选
    state: '' // 文章的发布状态
  }

  initTable();
  initCate();

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        // 使用模板引擎渲染页面数据
        var htmlStr = template('tpl-table', res);
        // 渲染HTML结构
        $('tbody').html(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total);
      }
    });
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        // console.log(res);
        if(res.status !== 0) {
          return layer.msg('获取分类数据失败！');
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res);
        // console.log(htmlStr);
        $('[name=cate_id]').html(htmlStr);
        // 通知 layUI 重新渲染表单区域的UI结构
        form.render();
      }
    });
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 获取表单中选中的值（下拉菜单）
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;

    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    // 调用 laypage.render() 方法来渲染分页结构
    // 执行一个laypage实例
    laypage.render({
      elem: 'pageBox', // 分页容器的id 注意，这里的 test1 是 ID，不用加 # 号
      count: total, // 总数据条数 数据总数，从服务端得到
      limit: q.pagesize, // 每页显示的条数
      curr: q.pagenum, // 设置默认被选中的分页 起始页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10], // 每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
      // 分页发生切换之后，触发 jump 回调函数
      // 触发jump 回调的方式有两种
      // 1、点击页码的时候，会触发 jump 回调 此时first为undefined
      // 2、只要调用了 laypage.render() 方法，就会触发jump回调  此时first为true
      jump: function(obj, first) {
        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
        // 如果first的值为 true ，则是方式2触发的
        // 否则就是方式1触发的
        // console.log(first);
        // console.log(obj.curr);
        // console.log(obj.limit); //得到每页显示的条数
        // 将最新的页码值，赋值给 q 这个查询对象的 pagenum 属性中
        q.pagenum = obj.curr;
        // 将最新的条目数，赋值到 q 这个查询参数对象的pageSize 属性中
        q.pagesize = obj.limit;
        // 根据最新的 q 获取对应的数据列表，并渲染表格
        // initTable();
        if(!first) { // 点击页码时才调用initTable()方法 
          initTable();
        }
      }
    });
  }

  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function() {
    // console.log('delete');
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    console.log(len);
    
    // 询问用户是否要删除数据
    var id = $(this).attr('data-id');
    // console.log(id);
      
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      //do something
      // 获取到文章的id
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          // console.log(res);
          if (res.status !== 0) {
            return layer.msg('删除文章失败！');
          }
          layer.msg('删除文章成功！');
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了，则让页码值减1
          if (len === 1) {
            // 如果 len 的值等于1，那证明删除完毕之后，这个页面上就没有任何数据了
            // 页码值最小是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          // 之后再重新调用 initTable() 方法 渲染数据
          // 重新渲染数据
          initTable();
        }
      })
      
      layer.close(index);
    });
  });

})