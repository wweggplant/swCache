/*
    localStorage




 */

;(function(window,document){
    "use strict";
    //是否支持LocalStorage
    var manager,//管理器
        resourceMap = {
            "script":"src",
            "link":"href",
            "img":"src"
        },
        createNodeMap = {
            "script":"script",
            "link":"style",
            "img":"img"
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
        if(url){
            xhr = new XMLHttpRequest();
            xhr.open("get",url,true);
            xhr.send();

            xhr.onreadystatechange = function(){
                //回调队列
                if (xhr.readyState==4 && xhr.status ==200&&queue.length>0) {
                    queue.forEach(function(cb){
                        cb&&cb.call&&cb.call(this,xhr,xhr.responseText);
                    });
                }
            };
        }
        return {
                xhr:xhr,
                done:function(cb){
                     if (cb) {
                        queue.push(cb);
                    }
                }
            };

    }
    //判断类型
    Resource.prototype.getType = function(makup){
        return makup&&makup.nodeName&&makup.nodeName.toLowerCase();
    };

    //资源类
    function Resource(makup){
        if(this===window){
            return new Resource(makup);
        }
        this.init(makup);
    }

    /*
        返回对象信息
     */
    Resource.prototype.getInfo = function(){
        var  r = this;
        return {
            name:r.name,
            type:r.type,
            url:r.url,
            makup:r.makup,
        };
    };
    Resource.prototype.init = function(makup){
        this.makup = makup;
        this.type = this.getType(makup);
        this.url = makup.getAttribute("data-local-url");
        this.name = makup.getAttribute("data-local-name");
    };
    manager = function(version){
        var resources = {},
            loader,
            local = localStorage,
            storage,
            storageInfoName = "storageInfo",
            prefix = "data-local-name";
        storage = {
            isSupport:function() {
                return localStorage&&localStorage.setItem;
            },
            get:function(name){
                if(storage.isSupport()){
                    try{
                        return JSON.parse(local.getItem(storagePrefix+name));
                    }catch(e){
                        return local.getItem(storagePrefix+name);
                    }

                }
            },
            remove:function(name){
                local.removeItem(name);
            },
            set:function(name,value){
                //https://github.com/addyosmani/basket.js/blob/gh-pages/dist/basket.js
                if(storage.isSupport()){
                    try{
                        local.removeItem(storagePrefix+name);
                        local.setItem(storagePrefix+name,JSON.stringify(value));
                    }catch(e){
                        //内存溢出
                        if ( e.name.toUpperCase().indexOf('QUOTA') >= 0 ) {
                            //如果要存的东西比较大的话,这会造成死循环
                            // var item;
                            // var tempScripts = [];

                            // for ( item in local ) {
                            //     if ( item.indexOf( storagePrefix ) === 0 ) {
                            //         tempScripts.push( JSON.parse( local[ item ] ) );
                            //     }
                            // }

                            // if ( tempScripts.length ) {
                            //     tempScripts.sort(function( a, b ) {
                            //         return a.stamp - b.stamp;
                            //     });

                            //     storage.remove( tempScripts[ 0 ].key );

                            //     return storage.set( name, value );

                            // } else {
                            //     // no files to remove. Larger than available quota
                            //     return;
                            // }
                            console.error(e.stack);
                        } else {
                            // some other error
                            console.error(e.stack);
                            return;
                        }
                    }

                }
            }
        };
        loader = {
            require:function(markup){
                var resource = new Resource(markup);
                var xhr = getPlainTextByAjax(resource.url);
                xhr.done(function(xhr,text){
                    var name = resource.name;
                    //恢复node的请求
                    if (markup.setAttribute) {
                        markup.setAttribute(resourceMap[resource.type],resource.url)
                    }else{
                        markup[resourceMap[resource.type]] = resource.url
                    }
                    //保存文本
                    storage.set(name,text);
                    //更新信息表
                    resources = loader.getAll()||{};
                    resources[name]  = resource.getInfo();
                    storage.set(storageInfoName,resources);
                });
                return xhr;
            },
            getAll:function(){
                return  storage.get(storageInfoName);
            },
            getVersion:function(){
                return storage.get("version");
            },
            updateVersion:function(version){
                storage.set("version",version);
            }
        };
        var markups = $$("["+prefix+"]");
        //1.是否支持
        if (!isSupportLocalStorage()) {
            //不支持本地储存,使用本来的方式处理
            markups.forEach(function(markup){
                var url = markup.getAttribute(prefix);
                markup.setAttribtue(prefix,url);
                markup.removeAttribute(prefix);
            });
            return false;
        }
        //2 . 对比version
        if(version === loader.getVersion()){
            //读取本地资源
            resources = loader.getAll();
            for(var resource  in resources){
                if(!$$(resources[resource]["type"]+"[data-from-local='"+resource+"']").length){
                    var type = resources[resource]["type"];
                    var node = document.createElement(createNodeMap[type]);
                    var storageText = storage.get(resource);
                    node.innerHTML = storageText;
                    node.setAttribute('data-from-local',resource);
                    // node.setAttribute(resourceMap[resource.type],resource.url);
                    document.body.appendChild(node);
                }
            }
        }else{
            //请求本地资源并保存在local中
            markups.forEach(function(markup){
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