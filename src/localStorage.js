/*
    localStorage




 */

;(function(window,document){
    "use strict";
    //是否支持LocalStorage
    var map = {},//资源关系对应表
        storage,//储存器
        Resource,//资源
        resourceMap = {
            "script":"src",
            "url":"href",
            "img":"src"
        },
        storagePrefix = 'localStorage-';
    function isSupportLocalStorage() {
        return true;
    }
    function $$(selector){
        return  document.querySelectorAll(selector)&&Array.prototype.slice.apply(document.querySelectorAll(selector));
    }
    function getPlainTextByAjax(url){
        var xhr,queue=[];
        try {xhr = new XMLHttpRequest();}
        catch(e) {
            var IEXHRVers =["Msxml3.XMLHTTP","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
            for (var i=0,len=IEXHRVers.length;i< len;i++) {
                try {xhr = new ActiveXObject(IEXHRVers[i]);}
                catch(e) {continue;}
            }
        }
        xhr.open("get",url,true);
        xhr.send();

        xhr.onreadystatechange = function(){
            //回调队列
            if (xhr.readyState==4 && xhr.status ==200&&queue.length>0) {
                queue.forEach(function(i,cb){
                    cb.call&&cb.call(this,xhr,xhr.reponseText);
                });
            }
        };
        return {
            xhr:xhr,
            done:function(cb){
                 if (cb) {
                    queue.push(cb);
                }
            }
        }
    }
    //判断类型
    Resource.prototype.getType = function(makup){
        return makup&&makup.nodeName&&makup.nodeName.toLowerCase();
    }
    Resource.prototype.makeUrl = function(makup,type){
        return makup.getAttribute([type]||"src");
    }
    //资源类
    function Resource(makup){
        if(this===window){
            return new Resource(makup);
        }
        this.init(makup);
    }
    Resource.prototype.getAll = function(){
        var  r = this;
        return {
            name:o.name,
            type:o.type,
            url:o.url,
            makup:o.makup,
        }
    }
    Resource.prototype.init = function(makup){
        var url;
        this.makup = makup;
        this.type = this.getType(makup);
        this.url = url = this.makeUrl(makup,this.type);

    }
    manager = function(version){
        var resources = [],
            loader,
            local = localStorage,
            storage,
            storageInfoName = "storageInfo",
            prefix = "data-local";
        storage = {
            isSupport:function() {
                return true;
            },
            get:function(name){
                if(storage.isSupport()){
                    return JSON.parse(local.getItem(name));
                }
            },
            remove:function(name){
                local.removeItem(name);
            }
            set:function(name,value){
                //https://github.com/addyosmani/basket.js/blob/gh-pages/dist/basket.js
                if(storage.isSupport()){
                    try{
                        local.removeItem(name);
                        local.setItem(name,JSON.stringify(value));
                    }catch(e){
                        //内存溢出
                        if ( e.name.toUpperCase().indexOf('QUOTA') >= 0 ) {
                            var item;
                            var tempScripts = [];

                            for ( item in local ) {
                                if ( item.indexOf( storagePrefix ) === 0 ) {
                                    tempScripts.push( JSON.parse( local[ item ] ) );
                                }
                            }

                            if ( tempScripts.length ) {
                                tempScripts.sort(function( a, b ) {
                                    return a.stamp - b.stamp;
                                });

                                storage.remove( tempScripts[ 0 ].key );

                                return storage.set( key, storeObj );

                            } else {
                                // no files to remove. Larger than available quota
                                return;
                            }

                        } else {
                            // some other error
                            return;
                        }
                    }

                }
            }
        }
        loader = {
            require:function(markup){
                var resource = new Resource(markup);
                var xhr = getPlainTextByAjax(resource.url);
                resources.push(resource);
                xhr.always(function(xhr,text){
                    var name = "name";
                    //保存文本
                    storage.set(name,text);
                    //更新信息表
                    var resources = storage.get(storageInfoName);
                    resources.name  = resource;
                    storage.set(storageInfoName,resources);
                });
                return xhr;
            },
            getAll:function(){
                resources = storage.get(storageInfoName);

            },
            getVersion:function(){
                return storage.get(version);
            },
            updateVersion:function(version){
                storage.set("version",version);
            }
        }
        var markups = $$("["+prefix+"]");
        //1.是否支持
        if (!isSupportLocalStorage()) {
            //调用不支持时候的函数
            return false;
        }
        //2 . 对比version
        if(version === loader.getVersion()){
            //读取本地资源
            loader.getAll();

             resources.forEach(function(i,resource){
                    var node = document.createNode(resource.type);
                    node.setAttribute(resourceMap[resource.type],resource.link);
                    document.appendChild(node);
                });
        }else{
            //请求本地资源并保存在local中
            markups.forEach(function(i,markup){
                loader.require(markup);
            });
            //保存版本信息
            loader.updateVersion(version);
        }
        return loader;
    };
    if(!window.localManager){
        window.localManager = manager;
    }
})(this,document);


