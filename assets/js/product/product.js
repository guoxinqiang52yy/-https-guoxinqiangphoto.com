var typeId
$(function () {
    $("#header").load("common/header.html")
    $("#footer").load("common/footer.html")

    layui.use(['laypage', 'laytpl', 'layer','flow',"form"], function () {
        var laypage = layui.laypage;
        var laytpl = layui.laytpl;
        var layer = layui.layer
        var flow = layui.flow;
        var form = layui.form
        flow.lazyimg();
        var total
        cartgoryFunction()
        //搜索
        var url = location.search //获取url中"?"符后的字串 ('?modFlag=business&role=1')
        var theRequest = new Object()
        var id2, keyword2
        if (url.indexOf('?') != -1) {
            var str = url.substr(1) //substr()方法返回从参数值开始到结束的字符串；
            var strs = str.split('&')
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
            }
        }
        if (theRequest.id2 != undefined && theRequest.keyword2 != undefined) {
            id2 = theRequest.id2
            keyword2 = theRequest.keyword2
            var decodedUrl = decodeURIComponent(keyword2);
            submit_from(id2, decodedUrl)
        } else {
            goodsList(1, 0)
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
                        ajaxPage(1,0,total)
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
        /*分页*/
        function ajaxPage(page, idList,total) {
            laypage.render({
                elem: 'pageNav'
                , limit: 12
                , curr: page
                ,count:total
                ,theme:'#000'
                , layout: ['prev', 'page', 'next']
                , jump: function (obj,first) {
                    page = obj.curr;
                    if (!first){
                        goodsList(obj.curr, idList)
                    }

                }
            });
        }

        /*渲染产品列表*/
        function goodsList(page, idList) {
            $.ajax({
                url: urls.productList,
                type: 'POST',
                data: {
                    page: page,
                    type_id: idList
                },
                dataType: 'JSON',
                contentType: 'application/x-www-form-urlencoded',
                success: function (res) {
                    if (res.code === 1) {
                        total = res.count
                        ajaxPage(page,idList,total)
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
                                        goodsList(1, typeId)
                                        layer.closeAll()
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }
        $(".selectClassAll").click(function(){
            $(".selectClass").text("暂未选择")
            goodsList(1, 0)
        })

    })
    goDetailsFunction()
})


/*渲染*/


//laytpl


/*点击产品进去详情*/
function goDetailsFunction() {
    // 点击每条数据
    $("#viewIDList").on("click", '.viedo-box', function (e) {
        var ids = e.currentTarget.id;
        if (ids){
            location.href = `productDetails.html?id=${ids}`
        }
    })
}

