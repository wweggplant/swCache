/*
   路由模块
 */
define(["URI","URITemplate","common","CONFIG"], function(URI,URITemplate,common,CONFIG) {
    "use strict";
    var mode = CONFIG.URL_MODE;
    var route = {
        setMode:function(m){
            mode = m;
        },
        //U方法
        /*
            在模式二下 第一个参数必填
         */
        U:function(path,param,withHost){
            var templates = [
                'index.php?g={app}&m={module}&a={action}{&param*}',
                "index.php{/segments*}{?query*}",
                "{/segments*}{?query*}",
            ];
            var template = templates[mode];
            var pathArr = (path&&typeof path ==="string")? path.split("/"):[];
            var uri = new URI();
            switch(mode){
                case 0:
                    if(pathArr.length==2){
                        pathArr.unshift("");
                        pathArr.unshift("");
                    }
                    if(pathArr.length==1){
                        pathArr.unshift("");
                    }
                    var newPath  = {
                        app:pathArr[0],
                        module:pathArr[1],
                        action:pathArr[2]
                    };
                    newPath.param = param ? param : {};
                    var temp = new URITemplate(template);
                    var result =  temp.expand({app:newPath.app, module:newPath.module, action:newPath.action,param:newPath.param});
                    break;
                case 1:
                case 2:
                    if(pathArr.length==2){
                        pathArr.unshift(null);
                    }
                    if(pathArr.length==1){
                        pathArr.unshift(null);
                        pathArr.unshift(null);
                    }
                    if(pathArr.length==0){
                        pathArr.unshift(null);
                        pathArr.unshift(null);
                        pathArr.unshift(null);
                    }
                    if(param){
                        if(param["_URI_QUERY"]){
                            var query = param["_URI_QUERY"];
                        }
                        for(var p  in param){
                            if(param.hasOwnProperty(p)&&p!=="_URI_QUERY"){
                                pathArr.push(p);
                                pathArr.push(param[p]);
                            }
                        }
                    }
                    var temp = new URITemplate(template);
                    var result =  temp.expand({segments:pathArr, query:query});
                    if(mode==2){
                        result = result.slice(1);
                    }
                    break;
                default:
                    break;
            };
            return (withHost?uri.origin():"")+GV.DIMAUB+result;
        },
        //重定向
        redirect:function(path,param){

        },
        URI:URI
    };
    return route;
});