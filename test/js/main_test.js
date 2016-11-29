require.config({
    baseUrl:"/themes/simplebootx/Public/js",
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
        showroomMap:"model/map/showroomMap",//地图业务基础
        archaeolMap:"model/map/archaeolMap",//考古地图业务
        appDownload:"model/appDownload",//app下载页
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
        console:"component/console",//
        /*各种类库*/
        jquery: 'lib/jquery.min',//jquery不解释
        lazyload:"http://cdn.bootcss.com/jquery.lazyload/1.9.1/jquery.lazyload",//图片懒加载
        auiTemplate:"lib/template",//模板引擎
        URI:"lib/URI.min",//url解析
        URITemplate:"lib/URITemplate",
        SecondLevelDomains:"lib/SecondLevelDomains",//url解析模板
        base64:"lib/jquery.base64.min",//base64加密
        TouchSlide:"lib/TouchSlide.1.1",//轮播图
        nativeShare:"lib/nativeShare",//分享
        friendShare:"lib/friendShare",//邀请好友
        proxyConsole:"lib/proxy-console",//console重写
        QUnit:"lib/qunit.min"
    },
    shim:{
        base64:{
            deps: ['jquery']
        },
        app:{
            deps: ['jquery',"auiTemplate"]
        },
        QUnit: {
           exports: 'QUnit',
           init: function() {
               QUnit.config.autoload = false;
               QUnit.config.autostart = false;
           }
       }
    }
});
var model = "tests/"+document.querySelector("html").dataset.requireTestModel;//加载模块的名字
if(model){
    require(
        ['QUnit',model],
        function(QUnit,model) {
            //加载对应的业务模块
                    model.run();
                    // start QUnit.
                    QUnit.load();
                    QUnit.start();

    });
}