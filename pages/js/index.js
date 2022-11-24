$(function () {
    var datalist = []
    var animFlag = true
    initdata()
    /* 获取数据 */
    async function initdata() {
        let res = await axios.get('/todos')
        if (res.status !== 200) return ''
        datalist = res.data
        renderData()
    }
    /* 渲染数据 */
    function renderData() {
        let rowsTodo = []
        let rowsDone = []
        $.each(datalist, function (i, item) {
            let li = `<li>
                        <span id="content">${item.content}</span>
                        <span id="deadline">${item.deadline}</span>
                        <a href="javascript:;" data-id="${item.id}"></a>
                    </li>`
            if (item.done === 0) {
                rowsTodo.unshift(li)
            } else {
                rowsDone.unshift(li)
            }
        })

        $('#todo').empty().append(rowsTodo.join(''))
        $('#done').empty().append(rowsDone.join(''))
        // 动画
        makeAllMoveDown(animFlag)
        animFlag = false
    }

    /* 删除 */
    $('.done, .todo').on('click', 'a', async function (e) {
        e.stopPropagation();
        let id = $(this).attr('data-id')
        let res = await axios.delete(`/todos/${parseInt(id)}`)
        if (res.status !== 200) return ''
        initdata()
    })

    /* toggle完成 */
    $('.done, .todo').on('click', 'li', async function () {
        let id = $(this).children('a').attr('data-id')
        let toggleItem = {
            done: null
        }
        datalist.some((item) => {
            if (item.id === parseInt(id)) {
                toggleItem.done = 1 - item.done
                return true;
            }
        })
        let res = await axios.put(`/todos/${id}`, toggleItem)
        if (res.status !== 200) return ''
        initdata()
    })

    /* 添加todo */
    $('#content, #deadline').on('keyup', async function (e) {
        if (e.key == "Enter") {
            $(this).val($(this).val().trim())

            if ($('#content').val() != '' && $('#deadline').val() != '') {
                let res = await axios.post(`/todos`, {
                    content: $('#content').val(),
                    deadline: $('#deadline').val()
                })
                if (res.status !== 200) return ''
                $('#content').val('')
                $('#deadline').val('')
                $(this).blur()
                initdata()
                return ''
            }

            if ($(this).val() != '') {
                $('#content, #deadline').not(this).focus();
            }
        }
    })
    $('#content, #deadline').on('blur', function () {
        $(this).val($(this).val().trim())
    })

    /* 双击修改事件 */
    // span得到代理一个空的单击事件，解决下面对它们代理的双击事件会因为先触发单击事件导致直接触发到上面对li代理的单击
    $('.todo').on('click', 'span', function (e) {
        e.stopPropagation()
    })
    // 选中不曾选中的span
    $('.todo').on('dblclick', 'span:not([data-dbl])', function (e) {
        e.stopPropagation()
        $(this).attr('data-dbl', 'true')
        let width = $(this).css('width')
        let content = $(this).text()
        $(this).html(`<input type="text" onfocus="this.select()" style="width: ${width}" value="${content}">`)
        $(this).children('input').focus()
        // 回车和失焦都可修改完成
        $(this).children('input').on('blur', inputupdate)
        $(this).children('input').on('keyup', function (e) {
            if (e.key == 'Enter') {
                inputupdate.call($(this))
            }
        })

        async function inputupdate() {
            let todoitem = {}
            let value = $(this).val()
            let name = $(this).parent('span').attr('id')
            if (name === 'content') {
                todoitem = { content: value }
            } else {
                todoitem = { deadline: value }
            }
            let id = $(this).parent('span').siblings('a').attr('data-id')
            let res = await axios.put(`/todos/${id}`, todoitem)
            if (res.status !== 200) return ''
            initdata()
        }
    })


    /* 整点无聊动画 */
    function makeAllMoveDown(flag) {
        if (!flag) return ''
        let allToAnimation = $('section').find('li, h2')
        allToAnimation.css('opacity', '0')
        allToAnimation.css('position', 'relative')
        let iMax = allToAnimation.length;
        let i = 1;
        allToAnimation.eq(0).css({
            opacity: 1,
            animation: 'animMoveDown 0.4s',
        });
        let timer = setInterval(function () {
            allToAnimation.eq(i).css({
                opacity: 1,
                animation: 'animMoveDown 0.4s',
            });
            i++;
            if (i === iMax) {
                clearInterval(timer);
            }
        }, 85);
    }
})