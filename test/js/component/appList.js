define(["jquery","common","app","auiTemplate","lazyload",'TouchSlide',"CONFIG"],function ($,common,app,auiTemplate,lazyload,TouchSlide,CONFIG) {
    //列表
    "use strict";
    //列表页通用逻辑
    function listFn(config,loadMoreBtn,loadEl){
        config = $.extend({
                    content:"#content",
                    tpl:"tpl",
                    beforeCallBack:function(){
                        $(loadEl).show();
                    },
                    cb:function(resData, textStatus,jqXHR){
                        console.log("回调成功");
                        $(loadEl).hide();
                        $("#wb-loading").hide();
                        if ($("#leftTabBox").length>0) {
                            //解决TouchSlide在加载时高度不变的问题
                            var index = $(slideOpt.slideCell).find("ul .on").index();
                            slideOpt.endFun(index);
                        }
                        $(config.content).find('img[data-lazyload]').lazyload({
                            placeholder: CONFIG.DEFAULT_IMAGE_PATH,
                            threshold : 400,
                            effect: "fadeIn"
                        }).error(function(event) {
                            event.preventDefault();
                            $(this).off("error").attr("src",CONFIG.DEFAULT_IMAGE_PATH)
                        }).removeAttr('data-lazyload');
                        $(loadMoreBtn).show();
                    },
                    finishCallback:function(){
                        $(loadMoreBtn).hide();
                    }
                }, config);
        var scrollLoad  = app.scrollLoad(config,auiTemplate);
        $(loadMoreBtn).on('click', function(event) {
            //scrollLoad.trigger(true);
            scrollLoad.load();
            $(this).hide();
        });
        var _oldDestory = scrollLoad.destory;
        scrollLoad.destory = function(){
            _oldDestory();
            $(loadMoreBtn).off('click');
        }
        return scrollLoad;
    }
    if ($("#leftTabBox").length>0) {
        var slideOpt = {
        slideCell:"#leftTabBox",
            endFun:function(i){ //高度自适应
                var bd = document.getElementById("leftTabBox-bd");
                if(bd){
                  bd.parentNode.style.height = 100+bd.children[i].children[0].offsetHeight+"px";
                  if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
                }

            }
        };
        TouchSlide(slideOpt);
    }


    return {
        listFn:listFn,
        slideEndFnAppend:function(fn,paramArr){
            var old ;
            if($.isFunction(fn)){
               old =  slideOpt.endFun;
               slideOpt.endFun = function(i){
                   old(i);
                   if (!paramArr) {
                        paramArr=[];
                   }
                   paramArr.unshift(i);
                   fn.apply(null,paramArr);
               }
               TouchSlide(slideOpt);
            }
        }
    }
});