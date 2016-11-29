"use strict";
define(
    ['QUnit','route'],
    function(QUnit,route) {


        var run = function() {
            var U = route.U;
            QUnit.test('U方法 route.setMode(0);', function(assert ) {
                route.setMode(0);
                var url = U();
                assert.equal( url, "/index.php?g=&m=&a=", " path为空,param为空 U(); ==>"+url);
                var url = U("app/moulde/action");
                assert.equal( url, "/index.php?g=app&m=moulde&a=action", 'path===>app/moulde/action,param为空 U("app/moulde/action"); path改变成:'+url );
                var url = U("",{id:13,type:0});
                assert.equal( url, "/index.php?g=&m=&a=&id=13&type=0", 'path为空,param===>{id:13,type:0}  U("",{id:13,type:0}); path改变成:'+url );
                var url = U("app/moulde/action",{id:13,type:0});
                assert.equal( url, "/index.php?g=app&m=moulde&a=action&id=13&type=0", 'path===>app/moulde/action , param===>{id:13,type:0}  U("app/moulde/action",{id:13,type:0});path改变成:'+url );
                var url = U("app/moulde/action",{id:13,type:0},true);
                assert.equal( url, "http://m.wenbo.com/index.php?g=app&m=moulde&a=action&id=13&type=0", 'path===>app/moulde/action , param===>{id:13,type:0},withHost  U("app/moulde/action",{id:13,type:0},true) path改变成:'+url );
            });
            QUnit.test('U方法 route.setMode(1);', function(assert ) {
                route.setMode(1);
                var uri = new route.URI();
                var url = U();
                assert.equal( url, "/index.php", "path为空 param为空 不能为空");
                var url = U("app/moulde/action");
                assert.equal( url, "/index.php/app/moulde/action", 'path===>app/moulde/action,param为空 U("app/moulde/action"); 输出:'+url );
                var url = U("app/moulde/action",{id:13,type:0});
                assert.equal( url, "/index.php/app/moulde/action/id/13/type/0", 'path为空,param===>{id:13,type:0}  U("app/moulde/action",{id:13,type:0}); 输出:'+url );
                var url = U("app/moulde/action",{id:13,type:0},true);
                assert.equal( url,uri.origin()+GV.DIMAUB+"index.php/app/moulde/action/id/13/type/0", 'path===>app/moulde/action , param===>{id:13,type:0},withHost  U("app/moulde/action",{id:13,type:0},true) 输出:'+url );
            });
            QUnit.test('U方法 route.setMode(2);', function(assert ) {
                route.setMode(2);
                var uri = new route.URI();
                var url = U();
                assert.equal( url, "/", "path为空 param为空 不能为空");
                var url = U("app/moulde/action");
                assert.equal( url, "/app/moulde/action", 'path===>app/moulde/action,param为空 U("app/moulde/action"); 输出:'+url );
                var url = U("app/moulde/action",{id:13,type:0});
                assert.equal( url, "/app/moulde/action/id/13/type/0", 'path为空,param===>{id:13,type:0}  U("app/moulde/action",{id:13,type:0}); 输出:'+url );
                var url = U("app/moulde/action",{id:13,type:0},true);
                assert.equal( url,uri.origin()+GV.DIMAUB+"app/moulde/action/id/13/type/0", 'path===>app/moulde/action , param===>{id:13,type:0},withHost  U("app/moulde/action",{id:13,type:0},true) 输出:'+url );
            });
        };
        return {run: run}
    }
);