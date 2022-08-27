$(function () { // jQuery 入口函数
    // 为 去注册 链接绑定点击事件
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 为 去登录 链接绑定点击事件
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })
})


// 自定义校验规则：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 表单】
// 从 layui 中获取 form 对象
let form = layui.form   // 导入了 layui.js 就可以使用 layui 这个对象了；与 jQuery 一样，导入 jQuery.js 就有了 $ 这个成员 $ === jQuery
// 网页弹出层：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 目录 => msg 提示 => layer.msg(content, options, end) - 提示框 默认3秒后自动消失】
// 从 layui 中获取 layer 对象
let layer = layui.layer
// 通过 form.verify() 方法自定义校验规则
form.verify({
    // 自定义了一个叫做 pwd 的 校验规则【采用数组的形式。也支持函数的方式】
    // 数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pwd: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
    ],
    // 当自定义了验证规则后，只需要把 key 赋值给输入框的 lay-verify 属性即可。lay-verify 属性有多个属性值(多条规则的验证)时，多个属性值(多条规则的验证)之间用|分隔。

    // 自定义了一个叫做 repwd 的校验规则(校验两次密码是否一致的规则)【采用函数的方式。也支持数组的形式】
    repwd: function (value) {
        // 通过形参 value 拿到的是密码确认框中的内容(形参 value 是表单的值)
        // 还需要拿到密码框中的内容
        // 然后进行一次等于的判断
        // 如果判断失败，则 return 一个提示消息即可
        let val = $('.reg-box [name=password]').val()
        if(value !== val) { // value 密码确认框的内容；val 密码框的内容
            return '两次密码不一致!'
        }
    }
})


// 监听注册表单的提交事件
$('#form_reg').on('submit', function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    // 发起 Ajax 的 POST 请求【详见day1.md文件】
    $.post(
        // 请求的三个参数为URL地址【项目的请求根路径 http://www.liulongbin.top:3007 和 请求URL /api/reguser 的拼接】、请求参数对象和回调函数
        // 'http://www.liulongbin.top:3007/api/reguser', 
        // jQuery.ajaxPrefilter() 函数统一拼接请求的根路径，详见同级目录中的 baseAPI.js 文件
        '/api/reguser', 
        {username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()}, 
        function (res) {
            if (res.status !== 0) {
                // return console.log(res.message)
                // layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 目录 => msg 提示】
                return layer.msg(layer.message)
            }
            // console.log('注册成功!')
            // layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 目录 => msg 提示】
            layer.msg('注册成功,请登录!')
            // 模拟人的点击行为
            $('#link_login').click()
        }
    )
})


// 监听登录表单的提交事件
$('#form_login').submit(function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
        // url: 'http://www.liulongbin.top:3007/api/login',
        // jQuery.ajaxPrefilter() 函数统一拼接请求的根路径，详见同级目录中的 baseAPI.js 文件
        url: '/api/login',
        method: 'POST',
        // 快速获取表单中的数据【serialize() 方法通过序列化表单值，创建 URL 编码文本字符串。可以选择一个或多个表单元素（比如 input 及/或 文本框），或者 form 元素本身。序列化的值可在生成 AJAX 请求时用于 URL 查询字符串中】
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !==0) {
                return layer.msg('登录失败!')
            }
            layer.msg('登录成功!')
            // console.log(res.token)
            // 获取 token 属性值，预存起来，后面以 /my 开头的请求路径需要访问权限，需要在 Headers 请求头中携带 Authorization 身份认证字段才能访问成功。其中 Authorization 的属性值为 token 属性值
            // localstorage.setItem(key, value) 本地存储 设置指定 key 的数据
            localStorage.setItem('token', res.token)   // 输入用户名和密码，点击 登录 按钮，打开谷歌调试面板，切换到 Application 面板，点击 Storage 存储下面的 Local Storage 本地存储空间中的 http://127.0.0.1:5500 URL 地址，即可显示出键 token 和对应的值
            // 跳转到后台主页
            location.href= '/index.html'   // location.href 页面跳转
        }
    })
})
