var typeId, modelId
$(function ($) {
    $("#header").load("common/header.html")
    $("#footer").load("common/footer.html")
    layui.use(['layer', 'laypage', 'laytpl','flow'], function () {
        var layer = layui.layer
        var laypage = layui.laypage;
        var laytpl = layui.laytpl
        var flow = layui.flow;
        flow.lazyimg();
        var total
        cartgoryFunction()
        cartgoryFunction1()
        goDetailsFunction()

        //搜索
        var url = location.search //获取url中"?"符后的字串 ('?modFlag=business&role=1')
        var theRequest = new Object()
        var id3, keyword3
        if (url.indexOf('?') != -1) {
            var str = url.substr(1) //substr()方法返回从参数值开始到结束的字符串；
            var strs = str.split('&')
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
            }
        }
        if (theRequest.id3 != undefined && theRequest.keyword3 != undefined) {
            id3 = theRequest.id3
            keyword3 = theRequest.keyword3
            var decodedUrl = decodeURIComponent(keyword3);
            submit_from(id3, decodedUrl)
        } else {
            goodsList(1, 0, 0)
        }

        function submit_from(id, keyword) {
            $.ajax({
                url: urls.search,
                type: 'POST',
                data: {
                    id: id,
                    keyword: keyword,
                    page: 1
                },
                dataType: 'JSON',
                contentType: 'application/x-www-form-urlencoded',
                success: function (res) {
                    if (res.code === 1) {
                        total = res.count
                        ajaxPage(1, 0, 0, total)
                        var list = res.data;
                        if (list === '') {
                            list = []
                        } else {
                            var getTpl = demoList.innerHTML
                                , view = document.getElementById('viewIDList');
                            laytpl(getTpl).render(list, function (html) {
                                view.innerHTML = html;
                            });
                        }
                    }else{
                        layer.msg(res.msg, {icon: 1, time: 1000})
                    }
                }
            })
        }
        /*渲染分类列表*/
        function cartgoryFunction() {
            $.ajax({
                url: urls.getTypeurl,
                type: 'POST',
                data: {},
                dataType: 'JSON',
                contentType: 'application/x-www-form-urlencoded',
                success: function (res) {
                    if (res.code === 1) {
                        var list = res.data;
                        if (list === '') {
                            list = []
                        } else {
                            var getTpl = demoClassList.innerHTML
                                , view = document.getElementById('viewClassList');
                            laytpl(getTpl).render(list, function (html) {
                                view.innerHTML = html;
                            });
                        }
                        //获取id
                        var ids = $('.option-list ul .addOpen1');
                        for (var d = 0; d < ids.length; d++) {
                            ids[d].onclick = function () {
                                var idsss = this.id
                                var idssstext = this.innerText
                                if (idsss) {
                                    showEditModel(idsss, idssstext)
                                }
                            }
                        }
                    }
                }
            })
        }

        /*渲染型号列表*/
        function cartgoryFunction1() {
            $.ajax({
                url: urls.getModel,
                type: 'POST',
                data: {},
                dataType: 'JSON',
                contentType: 'application/x-www-form-urlencoded',
                success: function (res) {
                    if (res.code === 1) {
                        var list = res.data;
                        if (list === '') {
                            list = []
                        } else {
                            var getTpl = demoClassListCode.innerHTML
                                , view = document.getElementById('viewClassListCode');
                            laytpl(getTpl).render(list, function (html) {
                                view.innerHTML = html;
                            });
                        }
                        //获取id
                        var ids = $('.option-list ul .addOpen2');
                        for (var d = 0; d < ids.length; d++) {
                            ids[d].onclick = function () {
                                if (this.id) {
                                    var iddd = this.id
                                    var idddtext = this.innerText
                                    showCodeFunction(iddd, idddtext)
                                }
                            }
                        }
                    }
                }
            })
        }

        // 显示分类二级弹框
        function showEditModel(mUser, parentsText) {
            layer.open({
                type: 1,
                anim: 1,
                title: '选择二级分类',
                area: ['50%', '50%'],
                offset: 'auto',
                content: $('#modelUser').html(),
                success: function (layero, dIndex) {
                    $.ajax({
                        url: urls.typeChild,
                        type: 'POST',
                        data: {
                            id: mUser
                        },
                        dataType: 'JSON',
                        contentType: 'application/x-www-form-urlencoded',
                        success: function (res) {
                            if (res.code === 1) {
                                var list = res.data;
                                if (list === '') {
                                    list = []
                                } else {
                                    var getTpl = demoClassListModel.innerHTML
                                        , view = document.getElementById('viewClassListModel');
                                    laytpl(getTpl).render(list, function (html) {
                                        view.innerHTML = html;
                                    });
                                    //点击分类获取数据
                                    $(".ClassListModel").click(function (e) {
                                        $(".selectClass").text(`${parentsText} / ${e.target.innerText}`)
                                        typeId = e.target.id
                                        if (modelId) {
                                            goodsList(1, typeId, modelId)
                                            layer.closeAll()
                                        } else {
                                            layer.msg("请选择型号", {icon: 1, time: 1000})
                                            setTimeout(function () {
                                                layer.closeAll()
                                            }, 1000)
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }

        //显示型号二级弹框
        function showCodeFunction(mUser, parentsText) {
            layer.open({
                type: 1,
                anim: 1,
                title: '选择二级分类',
                area: ['50%', '50%'],
                offset: 'auto',
                content: $('#modelUser1').html(),
                success: function (layero, dIndex) {
                    $.ajax({
                        url: urls.modelChild,
                        type: 'POST',
                        data: {
                            id: mUser
                        },
                        dataType: 'JSON',
                        contentType: 'application/x-www-form-urlencoded',
                        success: function (res) {
                            if (res.code === 1) {
                                var list = res.data;
                                if (list === '') {
                                    list = []
                                } else {
                                    var getTpl = demoClassListCodeModel.innerHTML
                                        ,
                                        view = document.getElementById('viewClassListCodeModel');
                                    laytpl(getTpl).render(list, function (html) {
                                        view.innerHTML = html;
                                    });
                                    //点击型号获取数据
                                    $(".ClassListCodeModel").click(function (e) {
                                        $(".selectCode").text(`${parentsText} / ${e.target.innerText}`)
                                        modelId = e.target.id
                                        if (typeId) {
                                            goodsList(1, typeId, modelId)
                                            layer.closeAll()
                                        } else {
                                            layer.msg("请选择分类", {icon: 1, time: 1000})
                                            setTimeout(function () {
                                                layer.closeAll()
                                            }, 1000)
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }

        //模板列表分页
        function ajaxPage(page, typeId, modelId, total) {
            laypage.render({
                elem: 'pageNav'
                , count: total
                , curr: page
                , limit: 12
                , theme: '#000'
                , layout: ['prev', 'page', 'next']
                , jump: function (obj, first) {
                    page = obj.curr;
                    if (!first) {
                        goodsList(obj.curr, typeId, modelId)
                    }
                }
            });
        }

        /*渲染模板列表*/
        function goodsList(page, typeId, modelId) {
            $.ajax({
                url: urls.templateList,
                type: 'POST',
                data: {
                    page: page,
                    type_id: typeId,
                    model_id: modelId
                },
                dataType: 'JSON',
                contentType: 'application/x-www-form-urlencoded',
                success: function (res) {
                    if (res.code === 1) {
                        total = res.count
                        ajaxPage(page, typeId, modelId, total)
                        var list = res.data;
                        if (list === '') {
                            list = []
                        } else {
                            var getTpl = demoList.innerHTML
                                , view = document.getElementById('viewIDList');
                            laytpl(getTpl).render(list, function (html) {
                                view.innerHTML = html;
                            });
                        }
                    } else {
                        var viewEmpty = document.getElementById('viewIDList');
                        viewEmpty.innerHTML = '';
                        layer.msg(res.msg, {icon: 1, time: 1000})
                    }
                }
            })
        }

        /*点击模板进去详情*/
        function goDetailsFunction() {
            // 点击每条数据
            $(".layui-tpl").on("click", '.viedo-box', function (e) {
                var ids = e.currentTarget.id;
                if (ids !== undefined) {
                    location.href = `templateDetails.html?id=${ids}`
                } else {
                    return
                }
            })
        }
        //选择全部
        $(".selectClassAll").click(function(){
            $(".selectClass").text("暂未选择")
            $(".selectCode").text("暂未选择")
            goodsList(1, 0,0)
        })
    })
})


