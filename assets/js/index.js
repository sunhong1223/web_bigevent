$(function () { // jQuery 入口函数
    // 调用 getUserInfo 函数获取用户基本信息
    getUserInfo()
})

// 定义 获取用户的基本信息 的函数
function getUserInfo() {
    $.ajax({
        method: 'GET',

        // url: 'http://www.liulongbin.top:3007/my/userinfo',
        // jQuery.ajaxPrefilter() 函数统一拼接请求的根路径，先在 index.html 文件中导入自己封装的 baseAPI.js 文件。详见同级目录中的 baseAPI.js 文件
        url: '/my/userinfo',

        /* 
        // headers 请求头配置对象
        // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
        headers: { // 注意：这里的 headers 的 h 小写；而 Postman 中的 Headers 的 H 大写
            // localStorage.setItem(keyname, value) 设置指定本地存储项的值。其中 keyname 字符串，指定要设置其值的键的名称；value 字符串，指定要设置其值的键的值
            // localStorage.getItem(keyname) 获取指定本地存储项的值。其中 keyname 字符串，指定要获取其值的键的名称
            Authorization: localStorage.getItem('token') || ''   // 如果没有键 token，Authorization 属性值为空字符串
        }, 
        // 在同级目录下的 baseAPI.js 文件中的 $.ajaxPrefilter() 函数中统一为需要访问权限的接口设置 headers 请求头。因为每次 Ajax 请求前，会先调用 jQuery.ajaxPrefilter() 函数，且在函数中可以获取到请求的配置对象
        */

        success: function (res) {
            console.log(res)   // 登录页面登录成功后，页面跳转到后台主页，控制台输出结果为 {status: 0, message: '获取用户基本信息成功！', data: {…}}。用户的基本信息存在 data 属性中
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败!')
            }
            // 调用 renderAvatar 函数渲染用户的头像
            renderAvatar(res.data)   // res 为服务器返回给客户端的数据，其中一个属性是 data ，包含用户基本信息
        },

        /* 
        // 用户在未登录的状态下理论上是不允许访问后台主页的。现在可以直接访问后台主页 127.0.0.1:5500/index.html ，打开谷歌调试面板，切换到 Network 面板，再选择 Fetch/XHR ，点击左侧 名称 下面的 userinfo ，右侧 响应 下面显示出 {status: 1, message: "身份认证失败！"}。Headers 下的 Request Headers 中的 Authorization 没有值，因为用户没有登陆，没有 token ，默认发送一个空字符串''过去，因此需要访问权限的接口就请求失败了。正确的应该是在登录页面未登录状态下直接访问后台主页url地址，回车后强制跳转回登录页面。解决方法如下：【方法总结：在访问需要访问权限的接口时都会执行 complete 回调函数，通过 res.responseJSON 获取到服务器响应回来的数据。如果 res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！' 就强制清空 token 并强制跳转到登录页面】
        // 使用 $.get()、$.post()或$.ajax() 发起请求，无论成功还是失败，最终都会执行 complete 回调函数
        complete: function (res) {
            console.log('执行了 complete 回调')
            console.log(res)   // res 为服务器响应回来的数据，在登录页面未登录状态下直接访问后台主页url地址，回车后，获取用户的基本信息失败，控制台输出结果(res)为 {readyState: 4, getResponseHeader: ƒ, getAllResponseHeaders: ƒ, setRequestHeader: ƒ, overrideMimeType: ƒ, …}。时，res 其中的一个属性 responseJSON 属性值为一个包含了 status 状态和 message 信息的对象：responseJSON: {status: 1, message: '身份认证失败！'} 与 Network 面板下看到的结果是完全一样的。证明在 complete 中要想获取到服务器响应回来的数据使用 res.responseJSON 即可
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空 token
                localStorage.removeItem('token')
                // 2. 强制跳转到登录页面
                location.href = '/login.html'
            }
        } 
        // 每次访问有权限的接口时都要执行 complete 回调函数，把上面的代码复制粘贴一遍，繁琐！不在每一个请求里面写，统一写到同级目录下的 baseAPI.js 文件中的 $.ajaxPrefilter() 函数中。详见同级目录下的 baseAPI.js 文件
        */
    })
}

// 定义 渲染用户的头像 的函数
function renderAvatar(user) {
    // 1. 获取用户的昵称。有昵称优先获取昵称，没有昵称获取登录名称
    let name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()   // name[0] 获取字符串name中的第一个字符，可能是中文也可能是英文，这里把name当作一个数组。toUpperCase() 方法用于把字符串转换为大写，而非字母的字符不受影响;toLowerCase() 方法用于把字符串转换为小写，而非字母的字符不受影响。
        $('.text-avatar')
            .html(first)
            .show()
    }
}

// 为 退出 按钮绑定点击事件，实现退出功能
let layer = layui.layer
$('#btnLogout').on('click', function () {
    // 提示用户是否确认退出：【Layui镜像站 => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => confirm 询问 => 按需修改】
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
        //do something
        // 1. 清空本地存储中的 token
        localStorage.removeItem('token')
        // 2. 跳转到登录页面
        location.href = '/login.html'
        
        // 关闭 confirm 询问框
        layer.close(index)
      })
})