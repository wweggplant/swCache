/*
    基础的业务代码,每个部分都是只做一件事,方便构建
 */
define(["jquery", "common", "CONFIG"], function($, common, CONFIG) {
    var app = {
        init: function() {
            //ajax公共处理
            $.ajaxSetup({
                cache: CONFIG.AJAX_CACHE,
            });
            $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                //修改参数,添加公共的变量等工作会出现重复发请求的情况,暂时舍弃
                /*if(!options.isfilter){
                      options.url = CONFIG.ajaxApiUrlRoot+options.url;
                      options.isfilter = true;
                      console.log(options,"ajaxPrefilter");
                }*/
            });
            $(document).ajaxStart(function() {
                //每一个请求开始...
                console.log("$.ajaxStart");
            });
            $(document).ajaxStop(function() {
                //每一个请求结束...
                console.log("$.ajaxStop");
            });
            $(document).ajaxError(function() {
                //每一个请求发生错误..
                console.log("$.ajaxError");
            });
            $(document).ajaxSuccess(function(event, xhr, settings) {
                //每一个请求成功..
                console.log("$.ajaxSuccess");
            });
        },
        //用户公共模块
        user:{
            checkToken:function(){
                return typeof user.getToken() ==="string";
            },
            getToken:function(){
                if($("html").hasClass('localstorage')){
                    return localStorage.getItem(CONFIG.LOCALSTORAGE_TOKEN);
                }
                return false;
            }
        },
        /*
          render:渲染逻辑
        */
        render: function(tplApp) {
            return {
                template: function(config) {
                    var url,
                        content$,
                        mode,
                        param,
                        dataHandler,//数据处理函数
                        tpl;
                    config = $.extend({ mode: "append", param: {} }, config);
                    param = common.paramHandle(config.param);
                    url = config.url;
                    mode = config.mode; //prepend,append,replace
                    param = config.param;
                    dataHandler = config.dataHandler;
                    tpl = config.tpl;
                    console.log("loading...");
                    var con = $(config.content);
                    url = url.indexOf("http") >= 0 ? url:(CONFIG.ajaxApiUrlRoot + url);
                    console.log(url,"链接请求");
                    return $.getJSON(url, param,function(resp, textStatus, jqXHR) {
                        //渲染模板
                        var resData = respHandle(resp);
                        var content$ = $(config.content);
                        console.log(resData,"app.render.template");
                        // tpl =tpl;
                        if (resData.status !== CONFIG.API_STATUS.EMPTY_METHOD_CALL) {
                            try {
                                var html = "";
                                if($.isFunction(dataHandler)){
                                    resData.data = dataHandler(resData.data);
                                }
                                if(config.source){
                                    var render  = tplApp.compile(config.source);
                                    var html = render(resData.data);
                                }else{
                                    html = tplApp(tpl, { data: resData.data, msg: resData.msg });
                                }
                                if (content$[mode]) {
                                    content$[mode](html);
                                }
                            } catch(e) {
                                console.error(e,"app.render.template 回调出错");
                            }
                        };
                        arguments[0] = resData;
                    });
                },
                //带分页组件
                listPager: function(config) {
                    var me = {},
                        render = this,
                        xhr,
                        cb,
                        stop = true,
                        beforeCallBack,//每次加载的回调
                        finishCallback; //数据完全结束
                    config = $.extend({ mode: "append", param: {}, size: 20, offset: 0 }, config);
                    cb = config.cb;
                    beforeCallBack = config.beforeCallBack;
                    finishCallback = config.finishCallback;
                    me = {
                        isLoad: false,
                        offset: config.offset,
                        papeSize: config.size,
                        xhr:xhr,
                        getIsLoad: function() {
                            return this.isLoad;
                        },
                        getOffset: function() {
                            return this.offset;
                        },
                        load: function() {
                            var _this = this;
                            if (this.isLoad) {
                                return;
                            }
                            this.isLoad = true;
                            config.param.offset = _this.offset;
                            config.param.size = _this.papeSize;
                            if(stop){
                                xhr = render.template(config);
                            }
                            //发请求前调用
                            common.isFunThenApply(beforeCallBack, null, null);

                            xhr.done(function(resData, textStatus, jqXHR) {
                                var data = resData.data;
                                try {
                                     common.isFunThenApply(config.cb, null, arguments);//调用每次执行的函数
                                } catch(e) {
                                    _this.isLoad = false;
                                    console.log(e);
                                }

                                if (resData.status !== CONFIG.API_STATUS.EMPTY_METHOD_CALL) {
                                    if (!data || (data && data.length === 0)) {
                                        stop = false;
                                        common.isFunThenApply(finishCallback, null, arguments);
                                    } else {
                                        _this.offset++;
                                    }
                                }
                            }).always(function() {
                                _this.isLoad = false;
                                console.log("加载完成");
                            });
                        },
                    };
                    return me;
                }
            };
        },
        //滚动加载
        scrollLoad: function(config, tplApp) {
            var app = this,
                me = {},
                loader,
                container$,
                scrollOffset;
            function init(){
                config = $.extend({ container: window, scrollOffset: 60, auto: false},config);
                var oldFinishCallback =  config.finishCallback ;
                config.finishCallback = function(){
                    if($.isFunction(oldFinishCallback)){
                       oldFinishCallback.apply(null,arguments);
                    };
                    container$.off('scroll.dataload');
                    console.log("scrollLoad end");
                };
                container$ = $(config.container);
                if(container$[0] !== window){
                    container$.css("overflow","scroll");
                    container$.wrapInner('<div data-mark="scroll-container-inner" />');//用于计算内部的高度
                }
                loader = app.render(tplApp).listPager(config);
                scrollOffset = config.scrollOffset;
                loader.load();
            }
            init();
            me.loader = loader;
            //绑定滚屏事件
            me.trigger = function(isTrigger) {
                if (isTrigger) {
                    loader.load();
                    container$.on('scroll.dataload', function(event) {
                        event.stopPropagation();
                        event.preventDefault()
                        var sclTop = container$.scrollTop(),
                            docH = container$.children('[data-mark="scroll-container-inner"]').height(),
                            screenH = container$.height(),
                            allowScrollH;
                        allowScrollH = docH - screenH - scrollOffset; //允许滚动的最大距离
                        // console.log("sclTop:"+sclTop+";    docH:"+docH+";    screenH:"+screenH+";    allowScrollHeight:"+allowScrollH)
                        if (allowScrollH <= sclTop) {
                            loader.load();
                        }
                    });
                }
            };
            me.load = function(){
                loader.load();
            };
            me.destory = function(){
                $(config.content).empty();
                container$.off("scroll.dataload");
            }
            me.restart = function(conf){
                me.destory();
                if (conf) {
                    config = $.extend(config, conf);
                }
                init();
            }
            me.updateParam = function(param){
                var newparam  = $.extend(config.param, param);
                me.restart({param:newparam});
            }
            me.trigger(config.auto);
            return me;
        }
    };
    //响应处理,目前仅仅是状态处理
    function respHandle(data) {
        var API_STATUS = CONFIG.API_STATUS,
            STATUS = {
                0: API_STATUS.FAIL,
                1: API_STATUS.SUCCESS,
                404: API_STATUS.EMPTY_METHOD_CALL
            };
        if (data.status !== undefined) {
            data.status = STATUS[data.status];
        }
        return data;
    }
    return app;
});
