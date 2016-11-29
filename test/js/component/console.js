define(["proxyConsole"],function(proxyConsole){
    'use strict';
    var tpl = '<div id="console">'+
                   '<div class="console-inner"><p>欢迎使用console移动端调试</p></div>'+
                   '<div class="console-close"><span class="close">X</span></div>'+
              '</div>';
    var start_btn_tpl = "<a id='console-start-btn'></a>";
    var runner = (function(){
        var dom =  document.createElement("div");
        var start_btn =  document.createElement("div");
        dom.innerHTML=tpl;
        start_btn.innerHTML=start_btn_tpl;
        document.querySelector("body").appendChild(dom);
        document.querySelector("body").appendChild(start_btn);
        dom.querySelector(".console-close").onclick = function(){
            dom.style.display = "none";
        }
        start_btn.onclick = function(){
            dom.style.display = "block";
        };
        dom.style.display = "none";
        return {
            dom:dom,
            postMessage:function(method,args){
                this.dom.querySelector('.console-inner').innerHTML +="<p class="+method+">"+ [].join.call(args, '') + "</p>";
            },
        }
    }());
    new proxyConsole(runner);
});