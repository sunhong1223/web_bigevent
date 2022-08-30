$(function () { // jQuery 入口函数
    // 自定义校验规则：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 表单 => 右侧浮动目录 => 验证 => 在表单元素上加上 lay-verify="" 属性值即可。layui中未内置的验证规则需要借助form.verify()方法自定义验证规则】
    // 从 layui 中获取 form 对象
    let form = layui.form
    // 网页弹出层：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示 => layer.msg(content, options, end) - 提示框 默认3秒后自动消失】
    // 从 layui 中获取 layer 对象
    let layer = layui.layer
    // 通过 form.verify() 方法自定义校验规则
    form.verify({
        // 自定义了一个叫做 nickname 的校验规则【采用函数的方式。也支持数组的形式】。当自定义了验证规则后，只需要把 key (这里指的是 nickname)赋值给文本输入框的 lay-verify 属性即可。lay-verify 属性有多个属性值(多条规则的验证)时，多个属性值(多条规则的验证)之间用|分隔。
        nickname: function (value) { // 通过形参 value 获取到的是用户昵称文本框中的内容(形参 value 是表单的值)
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间!'
            }
        }
    })

    // 调用 初始化用户的基本信息 的函数
    initUserInfo()

    // 定义 初始化用户的基本信息 的函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',   // 在 user_info.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            success: function (res) {
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('获取用户信息失败!')
                }
                console.log(res)   // 点击后台主页的个人中心的基本资料，控制台输出结果为 {status: 0, message: '获取用户基本信息成功！', data: {…}}。属性 data 中有用户的基本信息 email、id、nickname、user_pic、username
                // 表单赋值：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 表单 => 右侧浮动目录 => 赋/取值 => 语法：form.val('filter', object) 用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值】
                form.val('formUserInfo', res.data)   // formUserInfo 即 class="layui-form" 所在元素属性 lay-filter="" 对应的属性值，这个属性值自定义
            }
        })
    }

    // 为 重置 按钮绑定点击事件
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为。如果不阻止的话，重置 按钮，会将整个表单中的数据清空，包括登录名称在内的获取到的用户的基本信息
        e.preventDefault()

        // 调用 初始化用户的基本信息 的函数，重新获取用户的基本信息，重新填充表单
        initUserInfo()
    })

})

// 为表单绑定提交事件
$('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求实现更新用户的基本信息的功能
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        // 快速获取表单中的数据【serialize() 方法通过序列化表单值，创建 URL 编码文本字符串。可以选择一个或多个表单元素（比如 input 及/或 文本框），或者 form 元素本身。序列化的值可在生成 AJAX 请求时用于 URL 查询字符串中】
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                return layer.msg('更新用户信息失败!')
            }
            // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
            layer.msg('更新用户信息成功!')

            // 调用父页面 index.html 中的 getUserInfo 函数，重新渲染用户的头像和用户的信息。在调用获取用户基本信息的函数后，获取到更新后的用户的基本信息，然后再调用 renderAvatar 函数重新渲染用户的头像
            // 本页面 user_info.html 是子页面是在 iframe 中进行呈现的，父页面 index.html 通过浏览器窗口中呈现的。如何在 iframe 的页面调用父页面中的函数呢？方法如下：
            window.parent.getUserInfo()   // window 代表 iframe 所在的页面；parent 代表父页面
        }
    })
})