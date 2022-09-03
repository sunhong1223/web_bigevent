// https://jquery.com/ => API Documentation => Ajax => Low-Level Interface => jQuery.ajaxPrefilter() 在每个请求发送之前，在$.ajax()处理之前，处理定制的Ajax选项或修改现有的选项
// 每次 Ajax 请求【包括 $.get() $.post() $.ajax()】前，会先调用 jQuery.ajaxPrefilter() 函数，在这个函数中，可以获取到请求选项【请求的配置对象】
$.ajaxPrefilter(function (options) { // jQuery === $
    // options 请求选项
    // console.log(options.url)   // 在登录页面输入用户名和地址，点击登录按钮，打开谷歌调试面板，切换到console控制台面板，输出结果为 /api/login 是具体的路径，不带根路径
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径 【请求根路径为 http://api-breakingnews-web.itheima.net】
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url)   // 在登录页面输入用户名和地址，点击登录按钮，打开谷歌调试面板，切换到console控制台面板，输出结果为 http://api-breakingnews-web.itheima.net/api/login 页面立即跳转到后台首页


    // 统一为需要访问权限的接口设置 headers 请求头【以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功】
    if (options.url.indexOf('/my/') !== -1) { // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。如果要检索的字符串值没有出现，则该方法返回 -1
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局统一挂载 complete 回调函数，通过 res.responseJSON 获取到服务器响应回来的数据
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            localStorage.removeItem('token')
            // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})