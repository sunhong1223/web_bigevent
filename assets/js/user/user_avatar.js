$(function () {
    // 网页弹出层：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示 => layer.msg(content, options, end) - 提示框 默认3秒后自动消失】
    // 从 layui 中获取 layer 对象
    let layer = layui.layer


    /* ------- */
    /* 以下代码详见 cropper基本用法.md文件 */
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
      // 纵横比
      aspectRatio: 1,
      // 指定预览区域
      preview: '.img-preview'
    }
    
    // 1.3 创建裁剪区域
    $image.cropper(options)
    /* ------- */


    // 为 上传 按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 点击 上传 按钮，通过代码的形式模拟用户的点击行为，点击文件选择框
        $('#file').click()
    })
    // 为文件选择框绑定 change 事件
    $('#file').on('change', function (e) {
        console.log(e)   // 用户点击上传按钮选择图片后，触发了文件选择框的 change 事件，在控制台打印 e ，控制台输出结果为 k.Event {originalEvent: Event, type: 'change', target: input#file, currentTarget: input#file, isDefaultPrevented: ƒ, …}。其中有一个属性是 target，target 中还有一个属性叫 files，是个伪数组，数组中 length 表示当前用户选择的文件个数，选择的每个文件都可以通过索引获取
        // 获取用户选择的文件
        let filelist = e.target.files
        console.log(filelist)   // 用户点击上传按钮选择图片后，控制台输出结果为 FileList {0: File, length: 1}
        if (filelist.length === 0) {
            // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
            return layer.msg('请选择图片!')
        }


        /* ------- */
        // 更换裁剪的图片
        /* 以下代码详见 cropper基本用法.md文件 */
        // 1. 获取用户选择的文件
        var file = e.target.files[0]
        // 2. 根据选择的文件，创建一个对应的URL地址
        let newImgURL = URL.createObjectURL(file)   // URL.createObjectURL() 方法会根据传入的参数创建一个指向该参数对象的URL。这个URL的生命仅存在于它被创建的这个文档里。新的对象URL指向执行的File对象或者是Blob对象。File对象就是一个文件
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        /* ------- */
    })

    // 为 确定 按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        /* ------- */
        // 1. 获取到用户裁剪过后的头像
        /* 以下代码详见 cropper基本用法.md文件 */
        // 将裁剪后的图片，输出为 base64 格式的字符串
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        /* ------- */

        // 2. 发起 ajax 数据请求实现更换头像的功能(调用接口，把头像上传到服务器)
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',   // 在 user_avatar.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            data: { // 请求体
                avatar: dataURL   // avatar 为请求的参数，值为用户裁剪过后的新头像
            },
            success: function (res) {
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('更换头像失败!')
                }
                // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                layer.msg('更换头像成功!')

                // 调用父页面 index.html 中的 getUserInfo 函数，重新渲染用户的头像和用户的信息。在调用获取用户基本信息的函数后，获取到更新后的用户的基本信息，然后再调用 renderAvatar 函数重新渲染用户的头像。父页面 index.html 中的头像更换成功
                // 本页面 user_avatar.html 是子页面是在 iframe 中进行呈现的，父页面 index.html 通过浏览器窗口中呈现的。如何在 iframe 的页面调用父页面中的函数呢？方法如下：
                window.parent.getUserInfo()   // window 代表 iframe 所在的页面；parent 代表父页面
            }
        })
    })
})