define(["jquery", "common", "app", "auiTemplate",'TouchSlide', "CONFIG","appList"], function($, common, app, auiTemplate,TouchSlide, CONFIG,appList) {
	//百科

	console.log("wiki-detail");
    var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    $(function(){
    	
    	
    	var urlinfo = common.getURLInfo();
        var value = urlinfo.query.id;
        $("#wb-loading").show();
        var scrollLoad = app.render(auiTemplate).template({
            url:urlPaths.wiki.info,
            param: {did:value},
            content:"#detalibox",
            tpl:"tpl",
        });
		scrollLoad.done(function(){
			$("#wb-loading").hide();
			
		});
    });
});