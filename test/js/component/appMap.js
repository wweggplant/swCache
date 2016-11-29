define(["jquery","route","citySelect","CONFIG"],function ($,route,citySelect,CONFIG) {
            var MAPCONFIG = CONFIG.MAP,
                URI = route.URI,
                dest,
                geolocation;//定位对象
            //1 实例化地图
            function geolocationFn(map,complete,error){
                map.plugin('AMap.Geolocation', function () {
                    geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        noIpLocate: false,//定位失败后是否走IP定位，默认值为false
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                        showButton: true,        //显示定位按钮，默认：true
                        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    });
                    AMap.event.addListener(geolocation, 'complete', function(data){
                        if (data.accuracy) {
                            complete(data);
                        } else {
                            error(data);
                        }

                    });//返回定位信息
                    AMap.event.addListener(geolocation, 'error', error);      //返回定位出错信息
                    geolocation.getCurrentPosition();
                });
            }

            function routeGuide(map,dest){
                var uri = new URI('http://m.amap.com/navi/');
                geolocationFn(map,
                    function(data){
                        uri.setSearch("start",data.position.lng+","+data.position.lat);
                        uri.setSearch("dest", dest.lng+","+dest.lat);
                        uri.setSearch("destName", dest.name);
                        uri.setSearch("naviBy", "car");
                        uri.setSearch("key", MAPCONFIG.KEY);
                        location.href =uri.href();
                        // window.open(uri.href(),"_blank");
                    },
                    function(){
                        alert("定位失败，请打开手机定位");
                    }
                );
            }
            //信息窗体
            var infoWindow = (function () {
                var instantiated;
                function init(config) {
                    /*这里定义单例代码*/
                    config = $.extend({content:".amap-lib-infowindow ul",tpl:"tpl"}, config);
                    var _infowindow;
                    var loadUrl = config.url;
                    var me = {
                        init:function(){
                            var content = document.createElement('div');
                            _infowindow = document.createElement('div');
                            _infowindow.className = 'amap-content-body';
                            var c = [];
                            c.push('<div class="amap-lib-infowindow">');
                            c.push('<ul>');
                            c.push('   </ul>');
                            c.push('</div>');
                            _infowindow.innerHTML = c.join('');
                            var sharp = document.createElement('div');
                            sharp.className = 'amap-combo-sharp';
                            _infowindow.appendChild(sharp);
                            var close = document.createElement('div');
                            document.querySelector(".amap-lib-plugin").appendChild(content);
                            content.appendChild(_infowindow);
                            content.appendChild(sharp);
                            content.classList.add("amap-lib-infowindow-wrap");
                        },
                        openCallBack:function(data){

                        },
                        open:function(data){
                            //渲染
                            if($.isFunction(config.openCallBack)){
                                config.openCallBack.call(me,data);
                            }
                            dest = data;
                            _infowindow.style.display = "block";
                        },
                        close:function(){
                            var ul = _infowindow.querySelector("ul");
                            if(ul){
                                ul.innerHTML = "";
                            }
                            _infowindow.style.display = "none";
                        },
                        destroy:function(){
                            _infowindow.parentNode.remove(_infowindow);
                            instantiated = null;
                        }
                    };
                    me.init();
                    return me;
                }
                return {
                    getInstance: function (url) {
                        if (!instantiated) {
                            instantiated = init(url);
                        }
                        return instantiated;
                    }
                };
            })();
        return {
                geolocationFn:geolocationFn,
                routeGuide:routeGuide,
                infoWindow:infoWindow,
                getDest:function(){
                    return dest;
                }
            }
});