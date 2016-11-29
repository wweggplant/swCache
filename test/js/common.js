/*
    公共的工具模块
    list:
    1.url,url解析 https://github.com/stretchr/arg.js
 */
define(['jquery',"CONFIG"], function($,CONFIG) {
    "use strict";
    var common = {
        //如果是函数执行
        isFunThenApply:function (fn, content, args) {
            if ($.isFunction(fn)) {
                fn.apply(content, args);
            }
        },
        getView:function(dom){
            dom = dom||document.documentElement
            var rect  = dom.getBoundingClientRect&&dom.getBoundingClientRect();
            return {
                screenWidth:rect.width,
                screenHeight:rect.height,
                top:rect.top,
                right:rect.right,
                bottom:rect.bottom,
                left:rect.left
            }
        },
        dateFormat:function (date, format){
            date = new Date(date.replace(/-/g,"/"));
            var map = {
                "M": date.getMonth() + 1, //月份
                "d": date.getDate(), //日
                "h": date.getHours(), //小时
                "m": date.getMinutes(), //分
                "s": date.getSeconds(), //秒
                "q": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            format = format.replace(/([yMdhmsqS])+/g, function(all, t){
                var v = map[t];
                if(v !== undefined){
                    if(all.length > 1){
                        v = '0' + v;
                        v = v.substr(v.length-2);
                    }
                    return v;
                }
                else if(t === 'y'){
                    return (date.getFullYear() + '').substr(4 - all.length);
                }
                return all;
            });
                return format;
        },
        //获取当前url信息
        getURLInfo:function(){
            var urlinfo = {};
            if(typeof GV==="object" && GV.URLINFO){
                urlinfo = GV.URLINFO
                return {
                    app:urlinfo.app,
                    module:urlinfo.module,
                    action:urlinfo.action,
                    query:urlinfo.query
                }
            }
        },
        paramHandle:function(param) {
            return $.extend(param,  CONFIG.API_COMMON_PARAM);
        }
    };
    return common;
});