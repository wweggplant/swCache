define(["jquery","common","auiTemplate","app","citySelect","appMap","CONFIG"],function ($,common,auiTemplate,app,citySelect,appMap,CONFIG) {
            var MAPCONFIG = CONFIG.MAP,
                URI = common.URI,
                radius = 10000,
                map,
                isGeolocation = false,
                searchRender,
                currentCity,
                currentPlace,
                searchNearBy = false,
                geolocation;//定位对象

            //1 实例化地图
            map = new AMap.Map("container", {
                resizeEnable: true,
                zoom: 4,
                zooms:[3,10],
                animateEnable:false
            });
            //2定位
           /* appMap.geolocationFn(map,
                function(data){
                    if(!isGeolocation){
                        //定位过程
                        setTimeout(function() {
                            map.setZoom(10);
                            map.setCenter(new AMap.LngLat(data.position.lng,data.position.lat));
                            map.getCity(function(result){
                                citySelectFn(result.city||result.province);
                            });
                        }, 1000);
                        init(map);
                    }
                },
                function(){
                    if(!isGeolocation){
                        map.setCenter(MAPCONFIG.DEFAULT_POSITION)
                        init(map);
                    }
                }
            );*/
            init(map);
            //3启动
            function init(map){
                    /*//定位
                    $(".amap-lib-geolocation").on('click', function(event) {
                        event.preventDefault();
                        appMap.geolocationFn(map,
                            function(data){
                                    if(!isGeolocation){
                                    //定位过程
                                    setTimeout(function() {
                                        map.setZoom(10);
                                        var center = new AMap.LngLat(data.position.lng,data.position.lat);
                                        map.setCenter(center);
                                        map.getCity(function(result){
                                            citySelectFn(result.city||result.province);
                                        });
                                    }, 500);
                                };
                            },
                            function(){
                                alert("定位失败");
                            }
                        )
                    });
                    //导航
                    $(".amap-lib-guide").on('click', function(event) {
                        if (appMap.getDest()) {
                             var dest = appMap.getDest();
                            var obj = new AMap.LngLat(dest.x,dest.y);
                            obj.name = dest.title;
                            dest = obj;
                            appMap.routeGuide(map,dest);
                        }
                    });*/
                    callback(map.getCenter(),map.getCenter().distance(map.getBounds().getNorthEast()));
                    //城市选择
                    var cityApp = citySelect(CONFIG.ajaxApiUrlRoot+CONFIG.urlPaths.archaeol.city,function($city,city,citySelect){
                        console.log(city);
                        citySelectFn(city.name);
                        citySelect.close();
                        map.setCity(city.name);
                    },{title:"现有考古信息的城市"});
                    $(".select-city-btn").on('click', function(event) {
                        event.preventDefault();
                        /* Act on the event */
                        cityApp.toggle();
                    });
                    AMap.event.addListener(map,"moveend",function(event){
                        var center = map.getCenter();
                        var bound = map.getBounds();
                        var radius = center.distance(bound.getNorthEast());//从中心点到东北角(西北)坐标的距离
                        callback(center,radius);
                        $(".amap-lib-guide").hide();
                        // map.getCity(function(result){
                        //     citySelectFn(result.city||result.province);
                        // });
                    });
            }
            function callback(center,radius){
                $.getJSON(CONFIG.ajaxApiUrlRoot+CONFIG.urlPaths.archaeol.tag,
                    common.paramHandle({x:center.getLng(),y:center.getLat(),r:radius}),
                    function(json, textStatus) {
                         if (json.status ===1 &&json.data) {
                            var searchRender =  searchRender ? searchRender:(new Lib.AMap.CloudDataSearchRender());
                            searchRender.autoRender({
                                data: json.data,
                                map:map,
                            });
                         }
                    });
            }

            function citySelectFn(city){
                city = city.indexOf("省")>=0?city:(city.indexOf("市")>=0?city:(city+"市"));
                currentCity = city||"全国";
                $(".list-header h3").text(city.replace("市",""));
            }

            if (typeof(Lib) == "undefined") {
                Lib = {};
            }
            var infoWindow = appMap.infoWindow;
            Lib.AMap = Lib.AMap || {};
            Lib.AMap.CloudDataSearchRender = function() {
                var me = this;

                //me.author="qiang.niu(http://www.siptea.cn)";
                me.autoRender = function(options) { //options.map otpions.panel options.data
                    me.clear();
                    this.options = options;
                    this.callback('complete', options);

                }
                function dataHandle(data){
                    var render = auiTemplate.compile($("#tpl").html());
                    var html = render({data:data});
                    $(".amap-lib-infowindow ul").html(html);
                }
                me.callback = function(status, result) {
                    me.clear();
                    var options = me.options;
                    if (options.callback) {
                        options.callback(status, result);
                    }
                    if (status != "complete") {
                        return;
                    }
                    me.result = result;
                    if (options.map) {

                        me._infoWindow = infoWindow.getInstance({openCallBack:dataHandle});
                        me._overlays = []; //poi
                        me._highlightOverlay = null; //高亮poi
                        if (result['data']) {
                            me.drawOverlays(result);
                        }
                        if (options.methodName == "searchNearBy") { //如果是周边查询，画出圆的范围
                            var a = me.options.methodArgumments;
                            me.drawCircle(a[0], a[1]);
                        }
                    }
                    me.enableListeners();
                }
                me.clear = function() {
                    this.clearOverlays();
                    this.clearCircle();
                };
                me.drawOverlays = function(result) { //绘制本页所有的点
                    me.clearOverlays();
                    var pois = result.data;
                    me._overlays = this.addOverlays(pois);
                }
                me.addOverlays = function(points) {
                    var map = this.options.map;
                    var _overlays = [];
                    for (var i = 0, point; i < points.length; i++) { //绘制途经点
                            point = new AMap.Marker({
                                map: map,
                                topWhenClick: true,
                                position: ( new AMap.LngLat(points[i]["x"],points[i]["y"])), //基点位置
                                content: '<div class="amap_lib_cloudDataSearch_poi archaeol"><img src="'+points[i]["pic_url"]+'" alt="" /></div>'
                            });
                            points[i].index = i;
                            point._data = points[i];
                            AMap.event.addListener(point, "click", this.listener.markerClick);
                            _overlays.push(point);

                    }
                    return _overlays;
                }
                me.clearOverlays = function() {
                    if (this._overlays) {
                        for (var i = 0, overlay; i < this._overlays.length; i++) {
                            overlay = this._overlays[i];
                            overlay.setMap(null);
                        }
                        this._overlays = [];
                    }
                    if (this._infoWindow) {
                        this._infoWindow.close();
                    }

                }
                me.setCenter = function(index) {
                    var poi = me.result.datas[index];
                    poi.index = index;
                    me.options.map.setCenter(poi._location);
                    me._overlays[index].setTop(true);
                    me.listener.markerClick.call({
                        _data: poi,
                        getPosition: function() {
                            return poi._location;
                        }
                    });
                }
                me.util = {};
                me.enableListeners = function() {

                }
                me.listener = {};
                me.listener.markerClick = function() {
                    var data = this._data;
                    $(".amap-lib-guide").show();
                    me._infoWindow.open(data);
                }
                me.view = {}; //创建dom结构类的方法

                var circleOptions = {
                    id: 'cloudData-search-circle',
                    radius: 3000,
                    strokeColor: '#72ccff',
                    strokeOpacity: .7,
                    strokeWeight: 1,
                    fillColor: '#d0e7f8',
                    fillOpacity: .5
                };

                me.drawCircle = function(center, radius) { //为周边查询画圆
                    me.clearCircle();
                    circleOptions.map = me.options.map;
                    circleOptions.center = center;
                    circleOptions.radius = radius;
                    me.searchCircle = new AMap.Circle(circleOptions);
                };

                me.clearCircle = function() {
                    if (me.searchCircle) {
                        me.searchCircle.setMap(null);
                        me.searchCircle = null;
                    }
                };
            }
});