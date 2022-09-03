$(function () {
    // 网页弹出层：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => open 核心方法】
    // 从 layui 中获取 layer 对象
    let layer = layui.layer

    let form = layui.form

    // 调用 获取文章分类列表 的函数initCate
    initCate()


    // -------
    // 以下代码详见 富文本编辑器的实现步骤.md文件
    // 初始化富文本编辑器
    initEditor()
    // -------


    // 定义 获取文章分类列表 的函数initCate
    function initCate() {
        // 2. 发起 ajax 请求获取文章分类列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',   // 在 art_pub.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            success: function (res) {
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('获取文章分类列表失败!')
                }
                // 调用模板引擎，渲染文章类别的下拉选择框
                // 4. 调用 template 函数
                let htmlStr = template('tpl-cate', res)   // template 是 art-template 模板引擎提供的函数，不是jQuery，不需要在 id 名 tpl-user 前面加 #
                // console.log(htmlStr)   // 控制台输出结果为 art_pub.html文件中的定义文章类别的下拉选择框模板中的内容即<script type="text/html" id="tpl-cate"></script>之间的内容
                // console.log(typeof htmlStr)   // 控制台输出结果为 string
                // 5. 渲染 HTML 结构。将 template() 方法返回的内容填充到元素内部
                $('[name=cate_id]').html(htmlStr)

                // art_pub.html文件中文章类别的下拉选择框select标签中没有任何内容，代码一直往下执行，加载了layui.all.js文件，自动渲染下拉选择框，发现里面没有任何内容，于是在页面渲染了一个空的下拉选择框。继续向下执行代码，加载了自己的js文件，通过动态发ajax方式异步请求回文章类别的下拉选择框中的可选项，通过模板引擎动态将这些可选项插入到select标签中，但是插入可选项的操作并没有被leyui.all.js文件监听到，因此页面上依旧是个空的下拉选择框
                // 通知 layui 重新渲染下拉选择框的UI结构
                form.render()
            }
        })
    }


    // -------
    // 以下代码详见 图片封面裁剪的实现步骤.md文件
    // 实现基本裁剪效果：
    // 初始化图片裁剪器
    var $image = $('#image')
    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options)
    // -------


    // 为 选择封面 按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 点击 选择封面 按钮，通过代码的形式模拟用户的点击行为，点击文件选择框
        $('#coverFile').click()
    })

    // 为 id 为 coverFile 的文件选择框绑定 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // console.log(e)   // 用户点击 选择封面 按钮选择图片后，触发了文件选择框的 change 事件，在控制台打印 e ，控制台输出结果为 k.Event {originalEvent: Event, type: 'change', target: input#coverFile, currentTarget: input#coverFile, isDefaultPrevented: ƒ, …}。其中有一个属性是 target，target 中还有一个属性叫 files，是个伪数组，数组中 length 表示当前用户选择的文件个数，选择的每个文件都可以通过索引获取
        
        // -------
        // 更换裁剪的图片：
        // 以下代码详见 图片封面裁剪的实现步骤.md文件
        // 获取到用户选择的文件列表数组
        let files = e.target.files
        // console.log(files)   // 用户点击上传按钮选择图片后，控制台输出结果为 FileList {0: File, length: 1}
        // 判断用户是否选择了文件
        if (files.length === 0) {
            // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
            return layer.msg('请选择图片!')
        }
        // 根据文件，创建对应的 URL 地址
        let newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')   // 销毁旧的裁剪区域
            .attr('src', newImgURL)   // 重新设置图片路径
            .cropper(options)   // 重新初始化裁剪区域
        // -------
    })


    // 发布新文章：【第一步：准备好发布新文章的请求体中的参数们(title、cate_id、content、cover_img、state)；调接口发起 ajax 请求成功发布新文章】
    // 定义文章的发布状态，默认为已发布。点击 发布 按钮时，文章的发布状态就是默认的已发布，发起 ajax 请求发布新文章；当点击 存为草稿 按钮时，监听用户的点击行为，为 存为草稿 按钮绑定点击事件，将发布状态由 已发布 改为 草稿，发起 ajax 请求发布新文章【发布新文章的数据请求中，请求体的其中一个参数state的可选值为已发布和草稿】
    let art_state = '已发布'

    // 为 存为草稿 按钮，绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为 id 为 form-pub 的表单绑定 submit 事件
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象【API接口文档中发布新文章的请求体要求是 FormData 格式】
        let fd = new FormData($(this)[0])   // $(this)[0] 获取到 id 为 form-pub 的表单的DOM元素
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)   // append() 方法在被选元素的结尾（仍然在内部）插入指定内容

        /* 
        fd.forEach(function (value, key) { // forEach() 方法按顺序为数组中的每个元素调用一次函数(遍历数组)
            console.log(key, value)
            // 文章标题输入月薪过2万，文章类别选择测试，文章内容输入加油加油加油！，点击 发布 按钮，控制台输出结果为
            // title 月薪过2万
            // cate_id 895
            // content <p>加油加油加油！</p>
            // state 已发布
            // 文章标题输入月薪过2万，文章类别选择测试，文章内容输入加油加油加油！，点击 存为草稿 按钮，控制台输出结果为
            // title 月薪过2万
            // cate_id 895
            // content <p>加油加油加油！</p>
            // state 草稿
        }) 
        // 这一步证明 fd 中已经存入发布新文章的请求体中的5个参数(title、cate_id、content、cover_img、state)中的4个参数 title、cate_id、content、state。还差 cover_img 参数(即封面裁剪后的图片文件)
        */

        // 4. 将封面裁剪后的图片，输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 请求，发布新文章
                publishArticle(fd)
            })
    })

    // 定义 发布新文章 的函数publishArticle
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',   // 在 art_pub.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项：
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('发布新文章失败!')
                }
                // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                layer.msg('发布新文章成功!')
                // 发布新文章成功后，跳转到文章列表页面
                location.href = 'art_list.html'
            }
        })
    }
})