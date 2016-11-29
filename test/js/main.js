
//全局变量
var GV = {
    DIMAUB: "/",
    JS_ROOT: "public/js/",
    TOKEN: "",
    TMPL_Public:".",
    URLINFO:{"query":[],"app":"Portal","module":"Index","action":"index"}
};

require.config({
    baseUrl:GV.TMPL_Public+"/js",
    waitSeconds: 15,
    //urlArgs: "bust=" +  (new Date()).getTime(),//打开可以解决文件缓存问题
    paths: {
        CONFIG:"config",//全局的变量参数
        common:"common",//公共的工具方法
        app:"app",//基础业务逻辑处理模块
        search:"model/search",//检索业务逻辑模块
        news:"model/news",//新闻业务逻辑模块
        newsDetail:"model/newsDetail",//新闻详情逻辑模块
        wiki:"model/wiki",//百科业务逻辑模块
        wikiDetail:"model/wikiDetail",//百科详情逻辑模块
        user:"model/user",//用户业务逻辑模块
        special:"model/special",//专栏业务逻辑模块
        presCultural:"model/presCultural",//文保业务逻辑模块
        presCulturalDetail:"model/presCulturalDetail",//文保详情
        archaeolList:"model/archaeolList",//考古业务
        archaeolDetail:"model/archaeolDetail",//考古详情
        showroomList:"model/showroomList",//考古列表
        showroomMuseumsList:"model/showroomMuseumsList",//博物馆展览详情
        showroomDetail:"model/showroomDetail",//博物馆详情
        showroomMap:"model/showroomMap",//地图业务基础
        archaeolMap:"model/archaeolMap",//考古地图业务
        appDownload:"model/appDownload",//app下载页
        console:"component/console",//
        //各种类库
        comment:"model/comment",//评论逻辑模块
        /*
            业务基础组件
            appList     通用列表页
            appMap      地图
            citySelect  城市
         */
        appList:"component/appList",//公用列表
        appMap:"component/appMap",//地图
        citySelect:"component/citySelect",//城市选择
        route:"component/route",//url模式
        auiTemplate:"component/template",
        /*各种类库*/
        jquery: 'lib/jquery.min',//jquery不解释
        lazyload:"http://cdn.bootcss.com/jquery.lazyload/1.9.1/jquery.lazyload",//图片懒加载
        template:"lib/template",//模板引擎
        URI:"lib/URI.min",//url解析
        URITemplate:"lib/URITemplate",//url解析模板
        base64:"lib/jquery.base64.min",//base64加密
        TouchSlide:"lib/TouchSlide.1.1",//轮播图
        nativeShare:"lib/nativeShare",//分享
        friendShare:"lib/friendShare",//邀请好友
        proxyConsole:"lib/proxy-console",//console重写
        amap:"http://webapi.amap.com/maps?v=1.3&key=5cf994399b57a615536ff4aa0211571f&plugin=AMap.CitySearch"//高度地图
    },
    shim:{
        base64:{
            deps: ['jquery']
        },
        app:{
            deps: ['jquery',"auiTemplate"]
        }
    },
    callback:function  () {
        localManager("0.0.1");
        console.log();
    }
});

require(['app',"jquery","route","CONFIG","auiTemplate","console"],function (app,$,route,CONFIG,auiTemplate) {
    app.init(CONFIG);
    var U = route.U;
    //加载对应的业务模块
    var model = $("html").data("require-model");//加载模块的名字
    if(model){
        require(model.split(" "));
    }
    //禁止滚动
    var nomove;
    document.addEventListener("touchmove",function(e){
        if(nomove==0){
            e.preventDefault();
            e.stopPropagation();
        }
    },false);
    //导航弹出
    $(".wb-header .header-btn-nav").click(function(){
        //setTimeout(function(){
        //    $(".filter").addClass("blur");
        //},150)
        //$("nav").addClass("nav-open");
        $("nav").fadeIn(150);
        nomove=0;
    });
    //导航关闭
    $("nav .nav-btn-close").click(function(){
        //$(".filter").removeClass("blur");
        //$("nav").removeClass("nav-open");
        $("nav").fadeOut(150);
        nomove=1;
    });
    //搜索弹出
    $(".wb-header .header-btn-search").click(function(){
        //$(".filter").addClass("blur");
        $(".pop-search").fadeIn(150);
        nomove=0;

    });
    //搜索关闭
    $('.pop-search-input, .pop-search-hot').click(function(event) {
        event.stopImmediatePropagation();//取消事件冒泡；
    });
    $(".pop-search").bind("click",function(){
        //$(".filter").removeClass("blur");
        $(".pop-search").fadeOut(150);
        nomove=1;
    });
    //获取热门搜索
    var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    $(document).ready(function() {
        var scrollLoad_relevant = app.scrollLoad({
            url: urlPaths.search.keywords,
            param: {p: "v", knum: 5},
            content: "#search-hot-list",
            tpl: "tpl_hot",
            cb: function (resData, textStatus, jqXHR) {
                console.log("回调成功");
                //点击热门搜索
                $(".pop-search-hot li").click(function(){
                    kw=$(this).html();
                    PopSearch();
                });
            }
        }, auiTemplate);
    })
    //搜索回车
    $('.pop-search-input').bind('keypress',function(event){
        if(event.keyCode == "13")
        {
            kw=$('.pop-search-input').val();
            PopSearch();
        }
    });
    //搜索
    function PopSearch(){
        kw=encodeURI(encodeURI(kw));
        location.href=U("portal/search/index",{kw:kw});
        $(".filter").removeClass("blur");
        $(".pop-search").hide();
        nomove=1;
    }
    //导航与底部宽度
    $(document).ready(function(){
        var ww=$(window).width();
        $(".wb-nav").css("width",ww);
        $(".wb-footer").css("width",ww);
    });
    $(window).resize(function(){
        var ww=$(window).width();
        $(".wb-nav").css("width",ww);
        $(".wb-footer").css("width",ww);
    });
    //底部定位
    $(document).ready(function(){
        footposition();
    });
    var autoren = setInterval(footposition, 100);
    //setTimeout(function(){
    //    clearInterval(autoren);
    //},60000)
    function footposition(){
        $(".wb-footer").removeClass("fix");
        var wh=$(window).height();
        var h=$(document).height();
        //$(".filter").css("height",wh);
        if(h<=wh){
            $(".wb-footer").addClass("fix");
        }
    }
    //限制详情页图片大小
    setInterval(function(){
        $(".newsdetail-text img,.magxiangx img").css("max-width","100%");
    },100);

    //首次打开跳转app下载页
    function setCookie(name,value,days){
        var exp=new Date();
        exp.setTime(exp.getTime() + days*24*60*60*1000);
        var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        document.cookie=name+"="+escape(value)+";expires="+exp.toGMTString()+";path=/";
    }
    function getCookie(name){
        var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr!=null){
            return unescape(arr[2]);
            return null;
        }
    }
    function delCookie(name){
        var exp=new Date();
        exp.setTime(exp.getTime()-1);
        var cval=getCookie(name);
        if(cval!=null){
            document.cookie=name+"="+cval+";expires="+exp.toGMTString();
        }
    }
    function out(){
        if(getCookie("out")!="yes"){
            setCookie("out","yes",30);
            // location.href=U("portal/index/appdl");
        }
    }
    out();
    //判断是否横屏
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
    function hengshuping() {
        if (window.orientation == 90 || window.orientation == -90) {
            alert("竖屏下体验更佳！");
        }
    }

    //去掉iphone手机在顶部或底部时滑动默认行为
    var startY, endY;
    document.body.addEventListener("touchstart", touchStart, false);
    document.body.addEventListener("touchmove", touchMove, false);
    document.body.addEventListener("touchend", touchEnd, false);
    function touchStart(event) {
        var touch = event.touches[0];
        startY = touch.pageY;
        if($(document).scrollTop()>50) {
            $(".btn-gotop").fadeOut(200);
        }

    }
    function touchMove(event) {
        //var touch = event.touches[0];
        //endY = (startY - touch.pageY);
        //if($(document).scrollTop()==0 && endY<0 || $(document).scrollTop()>=$(document).height()-$(window).height() && endY>0){
        //    event.preventDefault();
        //}
        $(".btn-gotop").hide();
    }
    function touchEnd(event) {
        if($(document).scrollTop()>50) {
            $(".btn-gotop").fadeIn(200);
        }
    }
    //返回顶部
    $(".btn-gotop").click(function(){
        $("html,body").animate({scrollTop:0},300);
        setTimeout(function(){
            $(".btn-gotop").hide();
        },200)

    });
    //$(window).scroll(function(){
    //    if($(document).scrollTop()>50){
    //        $(".btn-gotop").fadeIn(200);
    //    }
    //    else{
    //        $(".btn-gotop").fadeOut(200);
    //    }
    //});

});
