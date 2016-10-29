!function(t,e){"use strict";function r(){return!0}function n(t){return e.querySelectorAll(t)&&Array.prototype.slice.apply(e.querySelectorAll(t))}function o(t){var e,r=[];return e=new XMLHttpRequest,e.open("get",t,!0),e.send(),e.onreadystatechange=function(){4==e.readyState&&200==e.status&&r.length>0&&r.forEach(function(t,r){r&&r.call&&r.call(this,e,e.reponseText)})},{xhr:e,done:function(t){t&&r.push(t)}}}function i(e){return this===t?new i(e):void this.init(e)}var u,a={script:"src",url:"href",img:"src"},s="localStorage-";i.prototype.getType=function(t){return t&&t.nodeName&&t.nodeName.toLowerCase()},i.prototype.getInfo=function(){var t=this;return{name:t.name,type:t.type,url:t.url,makup:t.makup}},i.prototype.init=function(t){var e=/\/([a-z\-\.]*).js/g;this.makup=t,this.type=this.getType(t),this.url=t.getAttritube("data-local"),this.name=e.exec(this.url)[1]},u=function(t){var u,c,l={},p=localStorage,f="storageInfo",g="data-local";c={isSupport:function(){return!0},get:function(t){if(c.isSupport())return JSON.parse(p.getItem(t))},remove:function(t){p.removeItem(t)},set:function(t,e){if(c.isSupport())try{p.removeItem(t),p.setItem(t,JSON.stringify(e))}catch(o){if(o.name.toUpperCase().indexOf("QUOTA")>=0){var r,n=[];for(r in p)0===r.indexOf(s)&&n.push(JSON.parse(p[r]));return n.length?(n.sort(function(t,e){return t.stamp-e.stamp}),c.remove(n[0].key),c.set(t,e)):void 0}return}}},u={require:function(t){var e=new i(t),r=o(e.url);return r.always(function(t,r){var n=e[n];c.set(n,r);var o=u.getAll();o[n]=e.getInfo(),c.set(f,o)}),r},getAll:function(){return c.get(f)},getVersion:function(){return c.get(t)},updateVersion:function(t){c.set("version",t)}};var h=n("["+g+"]");if(!r())return h.forEach(function(t,e){var r=e.getAttribute(g);e.setAttribtue(g,r),e.removeAttribute(g)}),!1;if(t===u.getVersion()){l=u.getAll();for(var m in l){var v=e.createNode(m.type);v.setAttribute(a[m.type],m.url),e.appendChild(v)}}else h.forEach(function(t,e){u.require(e)}),u.updateVersion(t);return u},t.localManager||(t.localManager=u)}(this,document);er = function(version){
        var resources = {},
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
            },
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

                                return storage.set( name, value );

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
        };
        loader = {
            require:function(markup){
                var resource = new Resource(markup);
                var xhr = getPlainTextByAjax(resource.url);
                xhr.always(function(xhr,text){
                    var name = resource[name];
                    //保存文本
                    storage.set(name,text);
                    //更新信息表
                    var resources = loader.getAll();
                    resources[name]  = resource.getInfo();
                    storage.set(storageInfoName,resources);
                });
                return xhr;
            },
            getAll:function(){
                return  storage.get(storageInfoName);
            },
            getVersion:function(){
                return storage.get(version);
            },
            updateVersion:function(version){
                storage.set("version",version);
            }
        };
        var markups = $$("["+prefix+"]");
        //1.是否支持
        if (!isSupportLocalStorage()) {
            //不支持本地储存,使用本来的方式处理
            markups.forEach(function(i,markup){
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
                var node = document.createNode(resource.type);
                node.setAttribute(resourceMap[resource.type],resource.url);
                document.appendChild(node);
            }
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