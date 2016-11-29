define(["jquery","CONFIG","appList","citySelect"],function ($,CONFIG,appList,citySelect) {
    var listFn = appList.listFn;
    var urlPaths = CONFIG.urlPaths;
    $(document).ready(function() {
        //最热
        var apps = [];
        apps[apps.length] = listFn({
            url:urlPaths.showroom.exlist,
            param:{pid:0},
            content:"#hot",
            tpl:"tpl"
        },"button:eq(0)",".ico-loading:eq(0)");
        //即将
        apps[apps.length] = listFn({
            url:urlPaths.showroom.exlist,
            param:{pid:1},
            content:"#todo",
            tpl:"tpl"
        },"button:eq(1)",".ico-loading:eq(1)");
        //正在
        apps[apps.length] = listFn({
            url:urlPaths.showroom.exlist,
            param:{pid:2},
            content:"#doing",
            tpl:"tpl"
        },"button:eq(2)",".ico-loading:eq(2)");
        //结束
        apps[apps.length] = listFn({
            url:urlPaths.showroom.exlist,
            param:{pid:3},
            content:"#done",
            tpl:"tpl"
        },"button:eq(3)",".ico-loading:eq(3)");
        var cityApp = citySelect(CONFIG.urlPaths.showroom.city,
            function($city,city,citySelect){
                citySelect.close();
                var index = $("#leftTabBox ul li.on").index();
                var list = apps[index];
                for (var i = apps.length - 1; i >= 0; i--) {
                    apps[i].updateParam({cityId:city.id});
                }
                $(".list-header h3").text(city.name);
        });
        //城市选择
        $(".select-city-btn").on('click', function(event) {
            event.preventDefault();
            cityApp.open();
        });
    });
});