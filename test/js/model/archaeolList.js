define(["jquery","CONFIG","appList","citySelect"],function ($,CONFIG,appList,citySelect) {
    var listFn = appList.listFn;
    var urlPaths = CONFIG.urlPaths;
    $(document).ready(function() {
        var apps = [];
        var selectCity$ = $(".select-city-btn"),
            map$ = $(".map-btn");
        //学术和发现列表
        apps[apps.length] = listFn({
            url:urlPaths.archaeol.expertpoint,
            param:{pid:0},
            content:"#faxian",
            tpl:"faxian-tpl"
        },".btn-load:first",".ico-loading:first");
        apps[apps.length] = listFn({
            url:urlPaths.archaeol.expertpoint,
            param:{pid:2},
            content:"#xueshu",
            tpl:"xueshu-tpl"
        },".btn-load:last",".ico-loading:last");
        appList.slideEndFnAppend(function(i){
            if(i==1){
                selectCity$.hide();
                map$.hide();
            }else{
                selectCity$.show();
                map$.show();
            }
        });
        $(".btn-load:first").on('click', function(event) {
            //scrollLoad.trigger(true);
            apps[0].load();
            $(this).hide();
        });
        $(".btn-load:last").on('click', function(event) {
            //scrollLoad.trigger(true);
            apps[1].load();
            $(this).hide();
        });


        //城市选择
        var cityApp = citySelect(CONFIG.urlPaths.archaeol.city,
            function($city,city,citySelect){
                citySelect.close();
                var index = $("#leftTabBox ul li.on").index();
                var list = apps[index];
                list.updateParam({areaid:city.id});
                $(".list-header h3").text(city.name);
        },{title:"现有考古信息的城市"});
        $(".select-city-btn").on('click', function(event) {
            event.preventDefault();
            cityApp.open();
        });
    });
});