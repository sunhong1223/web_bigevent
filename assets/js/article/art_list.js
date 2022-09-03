$(function () { // jQuery 入口函数
    // 网页弹出层：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => open 核心方法】
    // 从 layui 中获取 layer 对象
    let layer = layui.layer

    let form = layui.form

    // 分页：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 分页 => 右侧浮动目录 => 快速使用】
    let laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n   // 三元运算符
    }

    // 定义一个查询的参数对象，将来请求获取文章的列表数据时需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1,   // 页码值，默认请求第一页的数据
        pagesize: 2,   // 每页显示数据条数，默认每页显示2条
        cate_id: '',   // 文章分类的Id
        state: ''   // 文章的状态，发布 / 草稿
    }

    // 调用 获取文章列表数据 的函数inittable
    initTable()
    // 调用 初始化(所有分类的下拉选择框中的)文章分类 的函数initCate
    initCate()

    // 定义 获取文章列表数据 的函数inittable
    function initTable() {
        // 2. 发起 ajax 数据请求获取文章的列表数据
        $.ajax({
            method: 'GET',
            url: '/my/article/list',   // 在 art_pub.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('获取文章列表数据失败!')
                }
                // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                layer.msg('获取文章列表数据成功!')

                // 使用模板引擎渲染页面的文章列表数据
                // 4. 调用 template() 函数
                let htmlStr = template('tpl-table', res)   // template 是 art-template 模板引擎提供的函数，不是jQuery，不需要在 id 名 tpl-user 前面加 #
                // console.log(htmlStr)   // 控制台输出结果为 art_list.html文件中的定义文章表格数据模板中的内容即<script type="text/html" id="tpl-table">{{each data}}{{/each}}</script>之间的内容
                // console.log(typeof htmlStr)   // 控制台输出结果为 string
                // 5. 渲染 HTML 结构。将 template() 方法返回的内容填充到元素内部
                $('tbody').html(htmlStr)

                // 调用 渲染分页 的函数
                renderPage(res.total)   // res.total 获取到数据总条数
            }
        })
    }

    // 定义 初始化(所有分类的下拉选择框中的)文章分类 的函数initCate【请求方式和请求URL地址详见API接口文档中的关于获取文章分类列表的说明】
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',   // 在 art_pub.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
            success: function (res) {
                if (res.status !== 0) {
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    return layer.msg('获取文章分类失败!')
                }
                // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                layer.msg('获取文章分类成功!')

                // 调用模板引擎渲染所有分类的下拉选择框中的可选项
                // 调用 template() 函数
                let htmlStr = template('tpl-cate', res)   // template 是 art-template 模板引擎提供的函数，不是jQuery，不需要在 id 名 tpl-user 前面加 #
                
                // console.log(htmlStr)   
                // 控制台输出结果为 art_list.html文件中的定义所有分类的下拉选择框中的可选项模板中的内容即<script type="text/html" id="tpl-cate"></script>之间的内容，如下：
                // <option value="">所有分类</option>
                // <option value="1">数码科技</option>
                // <option value="2">娱乐新闻</option>
                // <option value="865">军事频道</option>
                // console.log(typeof htmlStr)   // 控制台输出结果为 string

                // 渲染 HTML 结构。将 template() 方法返回的内容填充到元素内部
                $('[name=cate_id]').html(htmlStr)

                // art_list.html文件中所有分类的的下拉选择框select标签中没有任何内容，代码一直往下执行，加载了layui.all.js文件，自动渲染下拉选择框，发现里面没有任何内容，于是在页面渲染了一个空的下拉选择框。继续向下执行代码，加载了自己的js文件，通过动态发ajax方式异步请求回所有分类的下拉选择框中的可选项，通过模板引擎动态将这些可选项插入到select标签中，但是插入可选项的操作并没有被leyui.all.js文件监听到，因此页面上依旧是个空的下拉选择框
                // 通知 layui 重新渲染下拉选择框的UI结构
                form.render()
            }
        })
    }

    // 为 id 为 form-search 的form表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 获取表单中两个下拉选择框中的选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染文章列表数据
        initTable()
    })

    // 定义 渲染分页 的函数
    function renderPage(total) {
        // console.log(total)
        // 调用 laypage.render() 函数渲染分页的结构
        // 分页：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 分页 => 右侧浮动目录 => 基础参数选项】
        // 通过核心方法 laypage.render(options) 来设置基础参数
        laypage.render({
            // 基础参数选项
            elem: 'pageBox',   // 指向存放分页的容器，值可以是容器ID、DOM对象。如：1. elem: 'id' 注意：这里不能加 # 号；2. elem: document.getElementById('id')
            count: total,   // 数据总数
            limit: q.pagesize,   // 每页显示的条数
            curr: q.pagenum,   // 起始页，默认被选中的分页
            // 自定义排版：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 分页 => 右侧浮动目录 => 基础参数选项 => layout】
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],   // count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            limits: [2, 3, 5, 10],   // 每页条数的选择项
            // jump - 切换分页的回调：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 分页 => 右侧浮动目录 => 分页的回调】
            jump: function (obj, first) { // 触发 jump 回调的方式有两种：1 点击分页中的页码时；2 调用了 laypage.render() 函数
                // obj包含了当前分页的所有参数 elem count limit curr
                console.log(obj.curr)   // obj.curr 得到当前页。第一次进入文章列表页面时，控制台输出结果为 1。因为默认显示页码值为1的数据列表
                console.log(first)   // 第一次进入文章列表页面时，控制台输出结果为 true，是因为调用了 laypage.render() 函数触发了 jump 回调函数；当点击分页中的页码时，也会触发 jump 回调函数，控制台输出结果为 undefined
                q.pagenum = obj.curr   // obj.curr 得到当前页，以便向服务端请求对应页的数据

                // 切换 每页条数 limits 时，本质上也会触发一次 jump 回调，把最新的每页显示数据条数，赋值到请求获取文章的列表数据时请求的查询参数对象 q 的 pagesize 属性中。最后调用 获取文章列表数据 的函数inittable，渲染表格数据
                q.pagesize = obj.limit

                // 根据最新的查询的参数对象 q 获取对应的数据列表，并渲染表格
                // initTable()   // 直接调用 initTable() 函数，造成死循环 原因：initTable() 函数中调用了 renderPage() 函数，renderPage() 函数中调用了 initTable() 函数。jump 回调函数会一直触发，停留在默认请求第一页的数据即页码值为1即 pagenum: 1 的页面，即使点击分页中的其他页码，也不会有任何变化。在 jump 回调函数中判断通过哪种方式触发的 jump 回调，如果是通过第2种方式触发的 jump 回调，就不应该调用 initTable() 函数，因为会造成死循环

                //首次不执行
                if(!first){ // first 值有2个：true 和 undefined
                    // 根据最新的查询的参数对象 q 获取对应的数据列表，并渲染表格
                    initTable()   // 当 first 为 undefined 时(点击分页中的页码时)执行此行代码
                }
            }
        })
    }

    // 通过事件委托的方式，为 删除 按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 在删除文章之前获取删除按钮的个数
        let len = $(this).length
        console.log(len)

        // 获取要删除的文章的Id
        let id = $(this).attr('data-id')   // $(this) 指向 删除 按钮；jQuery 的 attr() 方法返回被选元素的属性值；
        // console.log(id)   // 点击第1个 删除 按钮，控制台输出结果为 1 (不确定一定是1，但是该删除按钮对应的数据的Id，下同)；点击第2个 删除 按钮，控制台输出结果为 2 ；点击第3个 删除 按钮，控制台输出结果为 3 ；......

        // 询问框，询问用户是否确认删除：【Layui镜像站 => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => 内置方法 => confirm 询问 => layer.confirm(content, options, yes, cancel) - 询问框 => 复制HTMl结构按需修改】
        layer.confirm('确认删除?', {icon: 3, title: '提示'}, function (index) {
            // 发起 ajax 数据请求实现根据 Id 删除文章数据的功能
            $.ajax({
                method: 'GET',
                // url: '/my/article/delete/:id',   // :id 动态参数。id 表示要删除的文章Id。这是一个URL参数
                url: '/my/article/delete/' + id,   // 动态拼接 url 地址。在 art_cate.html 中导入 baseAPI.js 文件，该文件中的 jQuery.ajaxPrefilter() 函数统一拼接请求的根路径。且函数中统一为需要访问权限的接口(以 /my 开头的请求路径)设置了 headers 请求头
                success: function (res) {
                    if (res.status !== 0) {
                        // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                        return layer.msg('删除文章数据失败!')
                    }
                    // 网页弹出层：layer.msg(content, options, end) - 提示框 【详见Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 弹出层 => 右侧浮动目录 => msg 提示】
                    layer.msg('删除文章数据成功!')
                    
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余数据。如果没有剩余的数据了，则让页码值 -1 之后，再重新调用 inittable() 函数
                    if (len === 1) {
                        // 如果 len === 1 ，说明删除文章之前删除按钮有1个，删除完毕之后，页面上就没有任何数据了
                        
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 
                    }
                    
                    // 调用 获取文章列表数据 的函数inittable
                    initTable()
                }
            })
            
            // 关闭 confirm 询问框
            layer.close(index)
        })
    })


    /// 通过事件委托的方式，为 编辑 按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // TODO: ... ...
    })
})