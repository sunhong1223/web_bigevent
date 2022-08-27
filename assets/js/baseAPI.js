// https://jquery.com/ => API Documentation => Ajax => Low-Level Interface => jQuery.ajaxPrefilter() 在每个请求发送之前，在$.ajax()处理之前，处理定制的Ajax选项或修改现有的选项
// 每次 Ajax 请求【包括 $.get() $.post() $.ajax()】前，会先调用 jQuery.ajaxPrefilter() 函数，在这个函数中，可以获取到请求选项【请求的配置对象】
$.ajaxPrefilter(function (options) { // jQuery === $
    // options 请求选项
    // console.log(options.url)   // 在登录页面输入用户名和地址，点击登录按钮，打开谷歌调试面板，切换到console控制台面板，输出结果为 /api/login 是具体的路径，不带根路径
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径 【请求根路径为 http://www.liulongbin.top:3007】
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url)   // 在登录页面输入用户名和地址，点击登录按钮，打开谷歌调试面板，切换到console控制台面板，输出结果为 http://www.liulongbin.top:3007/api/login 页面立即跳转到后台首页
})