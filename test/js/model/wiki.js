define(["jquery", "common", "app", "auiTemplate",'TouchSlide', "CONFIG","appList"], function($, common, app, auiTemplate,TouchSlide, CONFIG,appList) {
	//百科

	console.log("wiki");
	var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    var listFn = appList.listFn;
	$(function() {
		$(".shaixuan").hide();
		var scrollLoad = listFn({
			url: urlPaths.wiki.index,
			content: "#content",
			tpl: "tpl",
		},"#btn","#loading");
		$(".zong").show();
		 app.render(auiTemplate).template({
			url: urlPaths.wiki.categorylist,
			content: ".center",
			tpl: "fenlei",
		});
		//点击分类 显示分类；
		$(".sorts").bind('click', function(event) {
			$(".fenlei").fadeIn();
			//$(".filter").css("overflow","hidden");
		});

		//点击分类  筛选词条
		$(".center").delegate(".fenlei-xx li a", "click", function() {
			var cidd = $(this).attr("data-name");
			$(".meiyou,.zong").hide();
			$(".shaixuan").show();
			$("#content .box").hide(); //先清空
			var scrollLoads = listFn({
				url: urlPaths.wiki.categorytype,
				param: {did: cidd},
				content: "#content",
				tpl: "tpl",
			},"#btn-sx","#loading-sx");
			$(".fenlei").fadeOut();
			$(".filter").css("overflow","visible");
		});
			//$(".shaixuan").show();
		//点 分类以外的地方 分类 隐藏
		$(".fenlei").click(function(e) {
			var _target = $(e.target);
			if(_target.closest(".center").length == 0) {
				$(".fenlei").fadeOut();
			$(".filter").css("overflow","visible");
			}
		});
		//点击大分类 隐藏小分类
		$(".center").delegate(".fenlei-title", "click", function() {
			$(this).next(".fenlei-xx").slideToggle();
			$(this).children("span").toggleClass("zhedie");
		});

		//搜索
		var keyword;
		$('#wk-search').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				keyword = $('#wk-search').val();
				$("#content .box").hide();
				$(".sousuo input").blur();
				SearchKeywords();
			}
			$(".zong,.shaixuan").hide();
			$(".sousuobox").show();
		});

		function SearchKeywords() {
			var scrollLoad = listFn({
				url: urlPaths.wiki.searchinfo,
				param: {p: "v",v: "1.0.0",title: keyword},
				content: "#content",
				tpl: "tpl",
			},"#btn-ss","#loading-ss");
		}
	});
});