"use strict";
define(
    ['QUnit','app',"CONFIG"],
    function(QUnit,app,CONFIG) {
        var run = function() {
            QUnit.module( "app 用户部分" );
            QUnit.test('getToken', function(assert ) {
                localStorage.setItem(CONFIG.LOCALSTORAGE_TOKEN,"123123");
                var token = app.user.getToken(CONFIG.LOCALSTORAGE_TOKEN);
                assert.equal(token, "123123", "token 等于 123123");
            });
            QUnit.test('checkToken', function(assert ) {
                localStorage.setItem(CONFIG.LOCALSTORAGE_TOKEN,"123123");
                var token = app.user.getToken(CONFIG.LOCALSTORAGE_TOKEN);
                assert.equal(token, "123123", "token 等于 123123");
            });
        };
        return {run: run}
    }
);