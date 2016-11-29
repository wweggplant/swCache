/**
 * Created by smoke on 2016/9/28.
 */
define(["jquery","common","app","auiTemplate",'TouchSlide',"CONFIG","appList"],function ($,common,app,auiTemplate,TouchSlide,CONFIG,appList) {
    var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    var listFn = appList.listFn;
    $(document).ready(function() {
        //工程
        var scrollLoad = listFn({
            url:urlPaths.presCultural.index,
            param:{pid:1},
            content:"#con_project",
            tpl:"tpl_project"
        }, "#btn","#loading");
        //技术
        var scrollLoad_skill = listFn({
            url:urlPaths.presCultural.index,
            param:{pid:2},
            content:"#con_skill",
            tpl:"tpl_skill"
        }, "#btn_skill","#loading_skill");

    });




});