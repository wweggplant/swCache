define(["jquery","common","app","auiTemplate","CONFIG","appList"],function ($,common,app,auiTemplate,CONFIG,appList) {
    console.log("search");
    var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    var listFn = appList.listFn;
    var urlinfo = common.getURLInfo();
    var keyword = decodeURI(decodeURI(urlinfo.query.kw));
    var scrollLoad
    $(function(){
        $(document).ready(function(){
            $('#search-input').val(keyword);
            SearchKeyword();
        });
        //回车事件
        $('#search-input').bind('keypress',function(event){
            if(event.keyCode == "13")
            {
                keyword=$('#search-input').val();
                SearchKeyword();
                $('#search-input').blur();
            }
        });
        function SearchKeyword() {
            $(".search-num").empty();
            $(".search-list").empty();
            app.render(auiTemplate).template({
                url: urlPaths.search.index,
                param: {p: "v", keyword:keyword},
                content: ".search-num",
                tpl: "searchunm",
            });
            if(scrollLoad&&scrollLoad.destory){
                scrollLoad.destory();
            }
            scrollLoad = listFn({
                url: urlPaths.search.index,
                param: {p: "v", keyword: keyword},
                content: "#search-result",
                tpl: "tpl",
                cb: function(resData, textStatus, jqXHR) {
                    $("#wb-loading").hide();
                    $(".ico-loading").hide();
                    $(".btn-load").show();
                    $(".nomore").hide();

                    if($(".search-list li").length == resData.msg) {
                        $(".btn-load").hide();
                        $(".nomore").show()
                    }
                    //图片懒加载
                    $("#search-result").find('img[data-lazyload]').lazyload({
                        placeholder: CONFIG.DEFAULT_IMAGE_PATH,
                        threshold : 400,
                        effect: "fadeIn"
                    }).error(function(event) {
                        event.preventDefault();
                        $(this).off("error").attr("src",CONFIG.DEFAULT_IMAGE_PATH)
                    }).removeAttr('data-lazyload');
                    //关键字标红
                    for(var i=0;i<resData.data.keyword.length;i++){
                        toRed(resData.data.keyword[i].word);
                    }
                    function toRed(content){
                        var k = 20*Math.floor($(".search-list li").length/21);
                        for(var n=0;n<resData.data.list.length;n++) {
                            var titleHtml = $(".search-tit .tit").eq(n+k).html();
                            var bodyHtml = $(".search-intr").eq(n+k).html();
                            var t = titleHtml.replace(new RegExp(content,"gm"),"<span class=keyword>"+content+"</span>")
                            var x = bodyHtml.replace(new RegExp(content,"gm"),"<span class=keyword>"+content+"</span>")
                            $(".search-tit .tit").eq(n+k).html(t);
                            $(".search-intr").eq(n+k).html(x);
                        }
                    }
                }
            },".btn-load",".ico-loading")
        }
        //reset按钮
        $("#search-reset").click(function () {
            $("#search-input").val("");
        });
    });
});