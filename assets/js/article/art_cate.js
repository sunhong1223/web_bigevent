$(function () { // jQuery 入口函数
    // 网页弹出层：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => open 核心方法】
    // 从 layui 中获取 layer 对象
    let layer = layui.layer

    // 从 layui 中获取 form 对象
    let form = layui.form   // 导入了 layui.js 就可以使用 layui 这个对象了；与 jQuery 一样，导入 jQuery.js 就有了 $ 这个成员 $ === jQuery

    // 调用 获取文章分类的列表 的函数initArtCateList
    initArtCateList()

    // 定义 获取文章分类的列表 的函数initArtCateList
    function initArtCateList() {
        // 2. 发起 ajax 数据请求获取文章分类列表的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',   // 在 art_cate.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            success: function (res) {
                console.log(res)   // 控制台输出结果为 {status: 0, message: '获取文章分类列表成功！', data: Array(2)}

                // 4. 调用 template() 函数
                let htmlStr = template('tpl-table', res)   // template 是 art-template 模板引擎提供的函数，不是jQuery，不需要在 id 名 tpl-user 前面加 #
                // console.log(htmlStr)   // 控制台输出结果为 art_cate.html文件中的定义表格数据模板中的内容即<script type="text/html" id="tpl-table">{{each data}}{{/each}}</script>之间的内容
                // console.log(typeof htmlStr)   // 控制台输出结果为 string
                // 5. 渲染 HTML 结构。将 template() 方法返回的内容填充到元素内部
                $('tbody').html(htmlStr)
            }
        })
    }

    // layer.close(index) - 关闭指定层【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => close 关闭层 => 要想关闭当前页的页面层，执行代码 var index = layer.open() 和 layer.close(index) 即可。具体见①②③】
    // ① 先声明一个变量 indexAdd 值为空
    var indexAdd = null
    
    // 为 添加类别 按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        // 网页弹出层：layer.open(options) - 原始核心方法【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => open 核心方法】
        // ② 弹层的调用，会返回一个 indexAdd
        indexAdd = layer.open({
            // Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 基础参数 => type 层类型 => layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。默认：0。若采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
            type: 1,   // 值为 1 ，表示弹出层类型是页面层，没有 确定 按钮
            // Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 基础参数 => area 宽高 => 在默认状态下，layer是宽高都自适应的，即值为 auto，但只想定义宽度时，可以area: '500px'，高度仍然是自适应的。当宽高都要定义时，可以area: ['500px', '300px']
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()   // html() 方法未设置参数，则返回被选元素的当前内容
        })
    })

    // id 为 form-add 的 form 表单是通过js动态添加到页面上的。详见上一行代码 content: $('#dialog-add').html()
    // 通过事件委托的方式，为 id 为 form-add 的 form 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起 ajax 数据请求实现新增文章分类的功能
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',   // 在 art_cate.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            // 快速获取表单中的数据【serialize() 方法通过序列化表单值，创建 URL 编码文本字符串。可以选择一个或多个表单元素（比如 input 及/或 文本框），或者 form 元素本身。序列化的值可在生成 AJAX 请求时用于 URL 查询字符串中】
            data: $(this).serialize(),   // $(this) 获取到的是 id 为 form-add 的 form 表单
            success: function (res) {
                console.log(res)   // 点击 添加分类 按钮，输入 分类名称 和 分类别名 后，点击 确认添加 按钮，控制台输出结果为 {status: 1, message: "ER_DUP_ENTRY: Duplicate entry '2147483647' for key 'PRIMARY'"}。2147483647 是32位操作系统中最大的符号型整型常量。所以再次插入数据的时候会一直报这个数的主键冲突。
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('新增文章分类失败!')
                }

                // 调用 获取文章分类的列表 的函数initArtCateList
                initArtCateList()
                // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                layer.msg('新增文章分类成功!')

                // ③ 根据索引 indexAdd ，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // layer.close(index) - 关闭指定层【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => close 关闭层 => 要想关闭当前页的页面层，执行代码 var index = layer.open() 和 layer.close(index) 即可。具体见①① ②② ③③】
    // ①① 先声明一个变量 indexEdit 值为空
    var indexEdit = null

    // 通过事件委托的方式，为类名为 btn-edit 的 编辑 按钮绑定点击事件【复制上面 为 添加类别 按钮绑定点击事件 的代码按需修改】
    $('tbody').on('click', '.btn-edit', function () {
        // 网页弹出层：layer.open(options) - 原始核心方法【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => open 核心方法】
        // ②② 弹层的调用，会返回一个 indexEdit
        indexEdit = layer.open({
            // Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 基础参数 => type 层类型 => layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。默认：0。若采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
            type: 1,   // 值为 1 ，表示弹出层类型是页面层，没有 确定 按钮
            // Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 基础参数 => area 宽高 => 在默认状态下，layer是宽高都自适应的，即值为 auto，但只想定义宽度时，可以area: '500px'，高度仍然是自适应的。当宽高都要定义时，可以area: ['500px', '300px']
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()   // html() 方法未设置参数，则返回被选元素的当前内容
        })

        // console.log($(this))   // 点击任何一个 编辑 按钮，控制台输出结果为 k.fn.init [button.layui-btn.layui-btn-xs.btn-edit]。说明 $(this) 指向 编辑 按钮
        var id = $(this).attr('data-id')   // jQuery 的 attr() 方法返回被选元素的属性值
        // console.log(id)   // 点击第1个 编辑 按钮，控制台输出结果为 1 ；点击第2个 编辑 按钮，控制台输出结果为 2 ；点击第3个 编辑 按钮，控制台输出结果为 3 ；......
        // 发起 ajax 数据请求实现根据 Id 获取文章分类数据的功能
        $.ajax({
            method: 'GET',
            // ！！！注意！！！url地址
            // url: '/my/article/cates/:id',   // :id 表示动态参数。id 表示分类的Id，这是一个URL参数
            url: '/my/article/cates/' + id,   // 动态拼接 url 地址。在 art_cate.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            success: function (res) {
                // console.log(res)   // 点击第1个 编辑 按钮，控制台输出结果为 {status: 0, message: '获取文章分类数据成功！', data: {…}}，其中 data 属性的值为 {Id: 1, name: '数码科技', alias: '什么科技', is_delete: 0}。第2个第3个... 编辑 按钮同理
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('获取文章分类数据失败!')
                }

                // 表单赋值：【语法：form.val('filter', object) 其中 filter 即 class="layui-form" 所在元素 form 的属性 lay-filter="" 对应的值。filter 可自定义，这里定义为 form-edit】
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过事件委托的方式，为 id 为 form-edit 的 修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起 ajax 数据请求实现根据 id 更新文章分类数据的功能
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',   // 在 art_cate.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            // 快速获取表单中的数据【serialize() 方法通过序列化表单值，创建 URL 编码文本字符串。可以选择一个或多个表单元素（比如 input 及/或 文本框），或者 form 元素本身。序列化的值可在生成 AJAX 请求时用于 URL 查询字符串中】
            data: $(this).serialize(),   // $(this) 指的是 id 为 form-edit 的 修改分类的表单；serialize() 方法快速获取表单中的 id、name、alias 对应的3个数据。所以要在 id 为 form-edit 的 修改分类的表单表单中添加一个隐藏域 <input type="hidden" name="id" value=""> 用来保存id值
            success: function (res) {
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('更新文章分类数据失败!')
                }
                // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                layer.msg('更新文章分类数据成功!')

                // ③③ 根据索引 indexEdit ，关闭对应的弹出层
                layer.close(indexEdit)

                // 调用 获取文章分类的列表 的函数initArtCateList
                initArtCateList()
            }
        })
    })

    // 通过事件委托的方式，为类名为 btn-delete 的 删除 按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')   // $(this) 指向 删除 按钮；jQuery 的 attr() 方法返回被选元素的属性值；
        // console.log(id)   // 点击第1个 删除 按钮，控制台输出结果为 1 ；点击第2个 删除 按钮，控制台输出结果为 2 ；点击第3个 删除 按钮，控制台输出结果为 3 ；......

        // 询问框，询问用户是否确认删除：【Layui镜像站 => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => confirm 询问 => layer.confirm(content, options, yes, cancel) - 询问框 => 复制HTMl结构按需修改】
        layer.confirm('确认删除?', {icon: 3, title: '提示'}, function (index) {
            // 发起 ajax 数据请求实现根据 Id 删除文章分类的功能
            $.ajax({
                method: 'GET',
                // url: '/my/article/deletecate/:id',   // :id 表示动态参数。id 要删除的分类 Id，这是一个URL参数
                url: '/my/article/deletecate/' + id,   // 动态拼接 url 地址。在 art_cate.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
                success: function (res) {
                    if (res.status !== 0) {
                        // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                        return layer.msg('删除文章分类数据失败!')
                    }
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    layer.msg('删除文章分类数据成功!')

                    // 关闭 confirm 询问框
                    layer.close(index)

                    // 调用 获取文章分类的列表 的函数initArtCateList
                    initArtCateList()
                }
            })
        })
    })
})
