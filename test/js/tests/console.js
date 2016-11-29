"use strict";
define(
    ['QUnit','console'],
    function(QUnit,console) {
        var run = function() {
            QUnit.module( "console" );
            QUnit.test('console test', function(assert ) {
                console.log("你好")
            });

        };
        return {run: run}
    }
);