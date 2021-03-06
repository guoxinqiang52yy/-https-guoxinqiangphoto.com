$(function () {
    $("#header").load("common/header.html")
    $("#footer").load("common/footer.html")
    detailsFun()
})

function detailsFun() {
    var url = location.search //获取url中"?"符后的字串 ('?modFlag=business&role=1')
    var theRequest = new Object()
    if (url.indexOf('?') != -1) {
        var str = url.substr(1) //substr()方法返回从参数值开始到结束的字符串；
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
        }
        $.ajax({
            url: urls.productDetail,
            type: 'POST',
            data: {
                id: theRequest.id
            },
            dataType: 'JSON',
            contentType: 'application/x-www-form-urlencoded',
            success: function (res) {
                if (res.code === 1) {
                    var b = '';
                    var c = '';
                    var w = ''
                    b += `<h3>Watch Video</h3>
                            <a class="popup-video wow pulse infinite"
                               href="${res.data.video}">
                                <i class="fa fa-play"></i>
                            </a>`
                    c += `<p>${res.data.content}</p>`
                    $('.videos-icon-text').html(b);
                    $(".blog-details-content").html(c)
                }
            }
        })
    }
}