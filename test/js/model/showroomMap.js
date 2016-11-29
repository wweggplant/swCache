define(["jquery","common","auiTemplate","app","citySelect","appMap","CONFIG"],function ($,common,auiTemplate,app,citySelect,appMap,CONFIG) {
            var MAPCONFIG = CONFIG.MAP,
                URI = common.URI,
                radius = 10000,
                map,
                isGeolocation = false,
                searchRender,
                currentCity = MAPCONFIG.DEFAULT_CITY,
                searchNearBy = false,
                geolocation,//定位对象
                searchOptions = {
                    map:map,
                    pageSize:10,
                    orderBy:'_id:ASC',
                    filter:"type:4"
                };
            //1 实例化地图
            map = new AMap.Map("container", {
                resizeEnable: true,
                zoom: 4,
                animateEnable:false
            });
            //2定位
            appMap.geolocationFn(map,
                function(data){
                    if(!isGeolocation){
                        //定位过程
                        setTimeout(function() {
                            map.setZoom(10);
                            map.setCenter(new AMap.LngLat(data.position.lng,data.position.lat));
                            map.getCity(function(result){
                                $(".list-header h3").text((result.city||result.province).replace("市",""));
                            });
                        }, 1000);
                        init(map);
                    }
                },
                function(){
                    if(!isGeolocation){
                        alert("手机定位失败,地图默认定位到"+MAPCONFIG.DEFAULT_CITY);
                        map.setCity(MAPCONFIG.DEFAULT_CITY)
                        init(map);
                    }
                }
            );

            //3启动
            function init(map){
                map.plugin('AMap.CloudDataSearch', function() {
                    search = new AMap.CloudDataSearch(MAPCONFIG.TABLE_ID, searchOptions); //
                    search.searchByDistrict(currentCity,cloudSeachCallback);
                    //定位
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
                                            $(".list-header h3").text(result.city.replace("市",""));
                                        });
                                        search.searchNearBy(center,radius,function(status, result){
                                            if(status === 'complete' && result.info === 'OK'){
                                                try{
                                                    var searchRender =  searchRender ? searchRender:(new Lib.AMap.CloudDataSearchRender());
                                                    searchRender.autoRender({
                                                        cloudDataSearchInstance:search,
                                                        methodName: "searchNearBy",
                                                        methodArgumments: [center, radius],
                                                        data: result,
                                                        map:map,
                                                    });
                                                }catch(e){
                                                    console.log(e,"地图错误信息");
                                                    console.log(result,"返回数据");
                                                }
                                            }else{
                                                console.log(result);
                                            };
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
                            var obj = new AMap.LngLat(dest._location.lng,dest._location.lat);
                            obj.name = dest._name;
                            dest = obj;
                            appMap.routeGuide(map,dest);
                        }
                    });
                    //城市选择
                    var cityApp = citySelect(CONFIG.ajaxApiUrlRoot+CONFIG.urlPaths.showroom.city,function($city,city,citySelect){
                        console.log(city);
                        citySelectFn(city.name);
                        citySelect.close();
                        map.setCity(city.name);
                    });
                    $(".select-city-btn").on('click', function(event) {
                        event.preventDefault();
                        /* Act on the event */
                        cityApp.toggle();
                    });
                    AMap.event.addListener(map,"moveend",function(event){
                         map.getCity(function(result){
                            if(result.province){
                                var city = result.city||result.province||"全国";
                                if (currentCity!=city) {
                                    currentCity = city;
                                    search.searchByDistrict(currentCity,cloudSeachCallback);
                                }
                            }
                        });
                        $(".amap-lib-guide").hide();
                    });
                });
            }

            function citySelectFn(city){
                city = city.indexOf("省")>=0?city:(city.indexOf("市")>=0?city:(city+"市"));
                if (currentCity!=city) {
                    currentCity = city||"全国";
                    search.searchByDistrict(currentCity,cloudSeachCallback);
                    $(".list-header h3").text(city.replace("市",""));
                }
            }
            function cloudSeachCallback(status, result){
                if(status === 'complete' && result.info === 'OK'){
                    try{
                        searchRender =  searchRender ? searchRender:(new Lib.AMap.CloudDataSearchRender());
                        var dids = [];
                        var squ = [];
                        if (result.datas.length) {
                            result.datas.forEach(function(place,index){
                                dids.push(place.did);
                                squ[place.did] = place;
                            });
                            $.getJSON(CONFIG.ajaxApiUrlRoot+CONFIG.urlPaths.showroom.museums,common.paramHandle({did:dids.join(",")}), function(data, textStatus) {
                                if(data.data&&data.data.length){
                                    data.data.forEach(function(place){
                                        var p= squ[place.did];
                                        p.count = place.list&&place.list.length;
                                    });
                                }
                                searchRender.autoRender({
                                        cloudDataSearchInstance:search,
                                        methodName: "searchByDistrict",
                                        methodArgumments: [currentCity, cloudSeachCallback],
                                        data: result,
                                        map:map,
                                });
                            });
                        }
                    }catch(e){
                        console.log(e,"地图错误信息");
                        console.log(result,"返回数据");
                    }
                }else{
                    console.log(result);
                }
            };
            //信息窗体
            var infoWindow = appMap.infoWindow;
            if (typeof(Lib) == "undefined") {
                Lib = {};
            }
            Lib.AMap = Lib.AMap || {};
            Lib.AMap.CloudDataSearchRender = function() {
                var me = this;
                var currentMarker ;
                //me.author="qiang.niu(http://www.siptea.cn)";
                me.autoRender = function(options) { //options.map otpions.panel options.data
                    me.clear();
                    if (!options || !options.methodName || !options.methodArgumments || (!options.panel && !options.map)) {
                        return;
                    }
                    this.options = options;
                    this.callback('complete', options['data']);

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
                        function dataHandle(data){
                            var templateApp = app.render(auiTemplate).template({
                                url:CONFIG.urlPaths.showroom.museums,
                                mode:"html",
                                param:{did:data.did},
                                content:".amap-lib-infowindow ul",
                                tpl:"tpl"
                            });
                        }
                        me._infoWindow = infoWindow.getInstance({openCallBack:dataHandle});
                        me._overlays = []; //poi
                        me._highlightOverlay = null; //高亮poi
                        if (result['datas']) {
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
                    this.clearPolygon();
                };
                me.drawOverlays = function(result) { //绘制本页所有的点
                    me.clearOverlays();
                    var pois = result.datas;
                    me._overlays = this.addOverlays(pois);
                }
                me.addOverlays = function(points) {
                    var map = this.options.map;
                    var _overlays = [];
                    for (var i = 0, point; i < points.length; i++) { //绘制途经点
                            var content = '<div class="amap_lib_cloudDataSearch_poi"></div>';
                            point = new AMap.Marker({
                                map: map,
                                topWhenClick: true,
                                position: points[i]._location, //基点位置
                                content: content
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
                /**
                 * 根据类名获得元素
                 * 参数说明:
                 *      1、className 类名
                 *      2、tag 元素名 默认所有元素
                 *      3、parent 父元素 默认doucment
                 */
                me.util.getElementsByClassName = function(className, tag, parent) {
                    var testClass = new RegExp("(^|\\s)" + className + "(\\s|$)");
                    //var testClass = new RegExp("(\w|\s)*" + className + "(\w|\s)*");
                    var tag = tag || "*";
                    var parent = parent || document;
                    var elements = parent.getElementsByTagName(tag);
                    var returnElements = [];
                    for (var i = 0, current; i < elements.length; i++) {
                        current = elements[i];
                        if (testClass.test(current.className)) {
                            returnElements.push(current);
                        }
                    }
                    return returnElements;
                }
                me.enableListeners = function() {

                }
                me.listener = {};
                me.listener.markerClick = function(opt) {
                    var marker = opt.target;
                    var data = this._data;
                    var markerWidth;
                    var _offset = {x:-9,y:-31};
                    var strLength = data['_name']&&data['_name']["length"];
                    var  content = '<div class="amap_lib_cloudDataSearch_poi exhibition" style="width:'+(strLength+5)+'em">'+data['_name']+"有"+(data['count']||0)+'个<em>展览</em></div>';
                    marker.setContent(content);
                    console.log(marker.getOffset(),"marker.getOffset()");
                    markerWidth = $(".amap_lib_cloudDataSearch_poi.exhibition").width();
                    marker.setOffset(new AMap.Pixel(-markerWidth/2,_offset.y-8));
                    if (currentMarker&&currentMarker!==marker) {
                        currentMarker.setContent('<div class="amap_lib_cloudDataSearch_poi"></div>');
                        currentMarker.setOffset(new AMap.Pixel(_offset.x,_offset.y));
                    }
                    currentMarker = marker;
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

                var polygonOptions = {
                    id: 'cloudData-search-bound',
                    strokeColor: '#72ccff',
                    strokeOpacity: .7,
                    strokeWeight: 1,
                    fillColor: '#d0e7f8',
                    fillOpacity: .2
                };
                me.drawPolygon = function(polygon) { //为多边形查画多边形
                    me.clearPolygon();
                    polygonOptions.path = polygon;
                    polygonOptions.map = me.options.map;
                    var polygon = new AMap.Polygon(polygonOptions);

                    me.searchPolygon = polygon;
                };

                me.clearPolygon = function() {
                    if (me.searchPolygon) {
                        me.searchPolygon.setMap(null);
                        me.searchPolygon = null;
                    }
                };
            }
});