define(["jquery","common","app","auiTemplate",'TouchSlide',"CONFIG","appList"],function ($,common,app,auiTemplate,TouchSlide,CONFIG,appList) {
    //新闻业务
    console.log("news");
    var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    var listFn = appList.listFn;
    var divh=$(document).width();
    $(document).ready(function() {
        //国内轮播图
        app.render(auiTemplate).template({
            url:urlPaths.news.topNews,
            param:{pid:4},
            content:"#content_topnews",
            tpl:"tpl_top"
        }).done(function () {
            TouchSlide({
                slideCell:"#slideBox",
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"leftLoop",
                autoPage:true, //自动分页
                autoPlay:true
            });
            //$(".slideBox .bd li").css({height:divh});
            //$(".slideBox .pic img").css({top:divh/200+"rem"});
            var widimg = $(".slideBox .pic img").width();
            var heiimg =Math.ceil(widimg*9/13);
            $(".slideBox .pic img").css("height",heiimg);
            $('.pic img').error(function(event) {
                event.preventDefault();
                this
                $(this).off("error").attr("src",CONFIG.DEFAULT_IMAGE_PATH);
            });
        });
        var view = common.getView();//屏幕信息
        // $(".scroll-container").height(view.screenHeight - 104);
        //国内
        var scrollLoad = listFn({
            url:urlPaths.news.news,
            param:{pid:4},
            content:"#content",
            tpl:"tpl"
        }, "#btn","#loading");
        //国际
        var scrollLoad_international = listFn({
            url:urlPaths.news.news,
            param:{pid:7},
            content:"#content_international",
            tpl:"tpl_international"
        }, "#btn_inter","#loading_inter");
        //通知（公告预告）
        var scrollLoad_inform = listFn({
            url:urlPaths.news.news,
            param:{pid:6},
            content:"#content_inform",
            tpl:"tpl_inform"
        },"#btn_inform","#loading_inform");
    });
    //头部放大效果
    //$(window).scroll(function(){
    //    if($(window).scrollTop()<divh/4){
    //        var st=$(document).scrollTop();
    //        var pich=divh-st;
    //        var scaleh=1.7-(st/150);
    //        $(".slideBox .bd li").css({height:pich});
    //        $(".slideBox .pic img").css({"transform":"scale("+scaleh+","+scaleh+") translate3d(0, 0, 0)","-webkit-transform":"scale("+scaleh+","+scaleh+") translate3d(0, 0, 0)"});
    //    }
    //});
});
