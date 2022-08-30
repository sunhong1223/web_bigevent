$(function () { // jQuery 入口函数
    // 自定义校验规则：【Layui镜像站https://layuion.com/ => 文档 => 内置模块 => 表单 => 右侧浮动目录 => 验证 => 在表单元素上加上 lay-verify="" 属性值即可。layui中未内置的验证规则需要借助form.verify()方法自定义验证规则】
    // 从 layui 中获取 form 对象
    let form = layui.form
    // 通过 form.verify() 方法自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 的 校验规则【采用数组的形式。也支持函数的方式】
        // 数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        
        // 自定义了一个叫做 samePwd 的校验规则(校验新旧密码是否相同的规则)【采用函数的方式。也支持数组的形式】
        samePwd: function (value) { // 通过形参 value 拿到的是新密码框中的内容(形参 value 是表单的值)
            if (value === $('[name=oldPwd').val()) { // $('[name=oldPwd').val() 获取的是原密码框中的内容
                return '新旧密码不能相同!'
            }
        },

        // 自定义了一个叫做 rePwd 的校验规则(校验确认新密码和新密码是否一致的规则)【采用函数的方式。也支持数组的形式】
        rePwd: function (value) { // 通过形参 value 拿到的是确认新密码框中的内容(形参 value 是表单的值)
            if (value !== $('[name=newPwd').val()) { // $('[name=newPwd').val() 获取的是新密码框中的内容
                return '两次密码不一致!'
            }
        }

        // 当自定义了验证规则后，只需要把 key (这里指的是 pwd)赋值给密码框的 lay-verify 属性即可。lay-verify 属性有多个属性值(多条规则的验证)时，多个属性值(多条规则的验证)之间用|分隔。
    })

    
    // 为表单绑定提交事件
    $('.layui-form').on('submit', function () {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起 ajax 数据请求实现重置密码的功能
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 快速获取表单中的数据【serialize() 方法通过序列化表单值，创建 URL 编码文本字符串。可以选择一个或多个表单元素（比如 input 及/或 文本框），或者 form 元素本身。序列化的值可在生成 AJAX 请求时用于 URL 查询字符串中】
            data: $(this).serialize(),   // 向服务器提交原密码和新密码
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败!')
                }
                layer.msg('更新密码成功!')
                // 调用 DOM 中的reset() 方法把表单中的元素重置为它们的默认值(jQuery中是没有reset()方法的)
                $('.layui-form')[0].reset()   // $('.layui-form')[0] 将 jQuery 对象转化为原生 DOM 对象
            }
        })
    })
})