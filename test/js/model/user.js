define(["jquery","common","route","app","auiTemplate","CONFIG","appList","base64","friendShare"],function ($,common,route,app,auiTemplate,CONFIG,appList) {
    var token = $("#token").val();
    var urlInfo = common.getURLInfo();
    var U = route.U;
    //判断是否登录
    //$(document).ready(function(){
    //    if(token==""){
    //        location.href="index.php?g=user&m=index&a=login";
    //    }
    //});

    // 用户登录
    if (urlInfo.action.toLowerCase()=="login"&&urlInfo.app.toLowerCase()=="user") {
        // 回车事件
        $('#password').bind('keypress',function(event){
            if(event.keyCode == "13")
            {
                $(".user-success").click();
            }
        });
        $(".user-success").click(function(){
            var txt=$("#mobile").val();
            var verify=$("#password").val();
            var password =$.base64.encode(verify);
            $.post(CONFIG.ajaxApiUrlRoot+"login/index",{ p:"v",username:txt,password:password},function(data){
                var token=data.data.token;
                var ustatus=data.data.user_status;
                if(data.status=='1'){
                    if(ustatus==1){
                        // window.location.href="index.php?g=user&m=index&a=center&token=" + token;
                        window.location.href  = U("user/index/center",{token:token});

                    }
                    else{
                        // window.location.href="index.php?g=user&m=Register&a=email_activation&token=" + token;
                        window.location.href  = U("user/Register/email_activation",{token:token});
                    };
                }
                else{
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                };
            });
        });
    };
    // 邮箱忘记密码
    if (urlInfo.action.toLowerCase()=="email_password"&&urlInfo.app.toLowerCase()=="user") {
        $(".user-email-btn").click(function () {
            var txt= $("#email").val();
            $.post(CONFIG.ajaxApiUrlRoot + "login/forgetpasse", {p: "v", email:txt}, function (data) {
                if (data.status == '1') {
                    test1();
                } else {
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                }
            });
        });
    };
    // 手机忘记密码
    if (urlInfo.action.toLowerCase()=="forgot_password"&&urlInfo.app.toLowerCase()=="user") {
        $("#getverify").click(function () {
            var txt= $("#iphone").val();
            $.post(CONFIG.ajaxApiUrlRoot + "login/send", {p: "v", mobile:txt}, function (data) {
                if (data.status == '1') {
                    test1();
                } else {
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                }
            });
        });
        $(".user-forgot-btn").click(function () {
            var txt = $("#iphone").val();
            var verify=$("#iphone-security").val();
            $.post(CONFIG.ajaxApiUrlRoot + "login/forgetpass", {p: "v", mobile:txt,code:verify}, function (data) {
                if (data.status == '1') {
                    window.location.href  = U("user/index/reset_password");
                    // window.location.href="index.php?g=user&m=index&a=reset_password";
                }
                else {
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000)
                }
            });
        });
    };
    /*倒计时开始*/
    function test1()
    {
        var sleep = 60, interval = null;
        var btn = document.getElementById ('getverify');
        if (!interval)
        {

            btn.style.backgroundColor = 'rgb(243, 182, 182)';
            btn.disabled = "disabled";
            btn.style.cursor = "wait";
            btn.value = "重新发送 (" + sleep-- + ")";
            interval = setInterval (function ()
            {
                if (sleep == 0)
                {
                    if (!!interval)
                    {
                        clearInterval (interval);
                        interval = null;
                        sleep = 60;
                        btn.style.cursor = "pointer";
                        btn.removeAttribute ('disabled');
                        btn.value = "免费获取验证码";
                        btn.style.backgroundColor = '';
                    }
                    return false;
                }
                btn.value = sleep-- +"秒后重新发送";
                $(".verify_img").trigger("onclick");
            }, 1000);
        }
    }
    /*倒计时结束*/

    // 邮箱激活
    $(function(){
        $("#send111").click(function(){
            // var token=$("#token").val();
            $.get(CONFIG.ajaxApiUrlRoot + "login/doactive", {p: "v", token:token}, function (data) {
                if (data.status == '1') {
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                } else {
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                }
            });
        });
    })
    // 重置密码
    if (urlInfo.action.toLowerCase()=="reset_password"&&urlInfo.app.toLowerCase()=="user") {
        $("#save").click(function(){
            var txt=$("#before").val();
            var verify=$("#new").val();
            var password =$.base64.encode(verify);
            var repassword=$("#confirm").val();
            var repeat =$.base64.encode( repassword);
            $.post(CONFIG.ajaxApiUrlRoot+"login/resetpass",{ p:"v",username:txt,password:password,repassword:repeat},function(data){
                if(data.status=='1'){
                    alert(data.msg);
                    window.location.href  = U("user/index/login");
                    // window.location.href="index.php?g=user&m=index&a=login";
                }else{
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                }
            });
        })
    };
    // 手机注册
    if (urlInfo.action.toLowerCase()=="iphone_register"&&urlInfo.app.toLowerCase()=="user") {
        $("#getverify").click(function () {
            var txt= $("#iphone-address").val();
            $.post(CONFIG.ajaxApiUrlRoot + "register/send", {p: "v", mobile:txt}, function (data) {
                if (data.status == '1') {
                    test1()
                } else {
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                }
            });
        });
        $("#send").click(function(){
            if($(".user-check").is(":hidden")){
                var txt= $("#iphone-address").val();
                var safe= $("#iphone-security").val();
                var name= $("#name").val();
                var rec= $("#recomment").val();
                var password= $("#iphone-password").val();
                var code =$.base64.encode( password);
                var recode =$.base64.encode( $("#iphone-confirm").val());
                $.post(CONFIG.ajaxApiUrlRoot + "register/index", {p: "v", username:txt,password:code,repassword:recode,user_nicename:name,code:safe,recommend:rec}, function (data) {
                    if (data.status == '1') {
                        alert(data.msg);
                        window.location.href  = U("user/index/login");
                        // window.location.href="index.php?g=user&m=index&a=login";
                    } else {
                        $("#thing").text( data.msg );
                        $("#thing").css("display","inline").fadeOut(3000);
                    }
                });
            };
        });
        // 判断是否勾选用户注册协议
        $(".user-check").click(function(){
            $(this).hide();
            $(".user-again-check").show();
            $(".tip-text").hide();
            $(".user-iphone-btn").css("background", "#834254");
            $(".user-iphone-btn").attr("disabled", false);
        });
        $(".user-again-check").click(function(){
            $(this).hide();
            $(".user-check").show();
            $(".tip-text").show();
            $(".user-iphone-btn").css("background", "#ccc");
            $(".user-iphone-btn").attr("disabled", true);
        });
    };
    $(function(){
        $(".checkbox a").click(function(){
            $(".user-protocol").show()
        });
        $(".user-iphone-delete").click(function(){
            $(".user-protocol").hide()
        });
    });
    // 邮箱注册
    if (urlInfo.action.toLowerCase()=="email_register"&&urlInfo.app.toLowerCase()=="user") {
         $("#btn-ereg").click(function() {
             if ($(".user-check").is(":hidden")) {
                 $("#btn-ereg").click(function () {
                     var txt = $("#address").val();
                     var password = $("#input-password").val();
                     var code =$.base64.encode( password);
                     var repeat = $("#confirm-password").val();
                     var confirm=$.base64.encode( repeat);
                     var name = $("#name").val();
                     var rec= $("#recomment").val();
                     $.post(CONFIG.ajaxApiUrlRoot + "register/register", {
                         p: "v",
                         username: txt,
                         password: code,
                         repassword: confirm,
                         user_nicename: name,
                         recommend:rec,
                     }, function (data) {
                         var token=data.data.hash;
                         if (data.status == '1') {
                             // alert(data.msg)
                             // $("#thing").text(data.msg);
                             // $("#thing").css("display", "inline").fadeOut(3000);
                             window.location.href  = U("user/index/login");
                             // window.location.href = "index.php?g=user&m=index&a=login&token=" + token;
                         } else {
                             $("#thing").text(data.msg);
                             $("#thing").css("display", "inline").fadeOut(3000);
                         };
                     });
                 });
             };
         });
        //判断是否勾选用户注册协议
        $(".user-check").click(function(){
            $(this).hide();
            $(".user-again-check").show();
            $(".tip-text").hide();
            $(".user-login-btn").css("background", "#834254");
            $(".user-login-btn").attr("disabled", false);
        });
        $(".user-again-check").click(function() {
            $(this).hide();
            $(".user-check").show();
            $(".tip-text").show();
            $(".user-login-btn").css("background", "#ccc");
            $(".user-login-btn").attr("disabled", true);
        });
     };
    // 意见反馈
    if (urlInfo.action.toLowerCase()=="suggestion"&&urlInfo.app.toLowerCase()=="user") {
      $("#submit_bt").click(function(){
          var msg= $("#thanks-text").val();
          var iphone= $("#contact").val();
          // var token= $("#token").val();
          $.post(CONFIG.ajaxApiUrlRoot + "guestbook/index", {p: "v",msg:msg,mobile:iphone,token:token}, function (data) {
              if (data.status == '1') {
                  alert(data.msg);
                  window.location.href  = U("user/index/center");
              } else {
                  $("#thing").text( data.msg );
                  $("#thing").css("display","inline").fadeOut(3000);
              }
          });
      });
    };
    //个人中心
    if (urlInfo.action.toLowerCase()=="center"&&urlInfo.app.toLowerCase()=="user") {
        $.get(CONFIG.ajaxApiUrlRoot + "user/uinfo", {p: "v", token:token}, function (data) {
            if (data.status == '1') {
                $(".user-center-head img").attr('src', data.data.avatar);
                $(".user-center-name").html(data.data.user_login);
                $(".user-center-vip").html(data.data.type);
                $(".user-center-number").html("积分："+data.data.score);
                $(".user-center-background").attr('src', data.data.avatar);
            };
            if (data.data.message== '0') {
                $(".user-center-message img").attr('src',GV.TMPL_Public+'/images/user/message_1.png');
            }else if(data.data.message== '1'){
                $(".user-center-message img").attr('src',GV.TMPL_Public+'/images/user/message_2.png');
            };
            if (data.data.sex== '男') {
                $(".user-center-sex img").attr('src',GV.TMPL_Public+'/images/user/boy.png');
            }else if(data.data.sex== '女'){
                $(".user-center-sex img").attr('src',GV.TMPL_Public+'/images/user/girl.png');
            };
        });
        //积分弹窗
        $(function(){
            // $(".user-center-left").click(function () {
            //     $(".user-center-description").show();
            // });
            // $(".user-center-del").click(function () {
            //     $(".user-center-description").hide();
            // });
            $(".user-center-right").click(function () {
                $(".user-center-rightjf").show();
            });
            $(".user-center-dl").click(function () {
                $(".user-center-rightjf").hide();
            });
        });
    };
    // 修改手机
    if (urlInfo.action.toLowerCase()=="new_iphone"&&urlInfo.app.toLowerCase()=="user") {
        $("#new_getverify").click(function () {
            var txt= $("#new-address").val();
            $.post(CONFIG.ajaxApiUrlRoot + "register/send", {p: "v", mobile:txt}, function (data) {
                if (data.status == '1') {
                    test()
                } else {
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                }
            });
        });
        $("#keep").click(function(){
            var txt= $("#new-address").val();
            var code= $("#new-security").val();
            $.post(CONFIG.ajaxApiUrlRoot + "profile/editmobile", {p: "v", mobile:txt,code:code,token:token,}, function (data) {
                if (data.status == '1') {
                    window.location.href  = U("user/index/account");
                    // window.location.href="index.php?g=user&m=index&a=account";
                } else {
                    $("#thing").text( data.msg );
                    $("#thing").css("display","inline").fadeOut(3000);
                }

            });
        });
    };
    /*倒计时开始*/
    function test()
    {
        var sleep = 60, interval = null;
        var btn = document.getElementById ('new_getverify');
        if (!interval)
        {

            btn.style.backgroundColor = 'rgb(243, 182, 182)';
            btn.disabled = "disabled";
            btn.style.cursor = "wait";
            btn.value = "重新发送 (" + sleep-- + ")";
            interval = setInterval (function ()
            {
                if (sleep == 0)
                {
                    if (!!interval)
                    {
                        clearInterval (interval);
                        interval = null;
                        sleep = 60;
                        btn.style.cursor = "pointer";
                        btn.removeAttribute ('disabled');
                        btn.value = "免费获取验证码";
                        btn.style.backgroundColor = '';
                    }
                    return false;
                }
                btn.value = sleep-- +"秒后重新发送";
                $(".verify_img").trigger("onclick");
            }, 1000);
        }
    }
    /*倒计时结束*/
    // 修改邮箱
    if (urlInfo.action.toLowerCase()=="new_email"&&urlInfo.app.toLowerCase()=="user") {
        $("#keep_email").click(function () {
            var txt = $("#new_email").val();
            $.post(CONFIG.ajaxApiUrlRoot + "profile/email", {p: "v",email: txt,token:token}, function (data) {
                if (data.status == '1') {
                    alert(data.msg);
                    window.location.href  = U("user/index/account");
                    // window.location.href="index.php?g=user&m=index&a=account";
                } else {
                    $("#thing").text(data.msg);
                    $("#thing").css("display", "inline").fadeOut(3000);
                }
            });
        });
    };
    // 修改密码
    if (urlInfo.action.toLowerCase()=="change_password"&&urlInfo.app.toLowerCase()=="user") {
        $("#keep_password").click(function(){
            var old=$.base64.encode( $("#before_password").val());
            var new_pass= $("#new_password").val();
            var password =$.base64.encode( new_pass);
            var reapeat= $("#repeat_password").val();
            var repeatpass =$.base64.encode( reapeat);
            $.post(CONFIG.ajaxApiUrlRoot + "profile/editpass", {p: "v",oldpass: old,token:token,pass:password,repass:repeatpass,}, function (data) {
                if (data.status == '1') {
                    alert("修改成功!")
                    window.location.href  = U("user/index/logout");
                    // window.location.href="index.php?g=user&m=index&a=logout";
                } else {
                    $("#thing").text(data.msg);
                    $("#thing").css("display", "inline").fadeOut(3000);
                }
            });
        });
    };
    // 账户设置
    if (urlInfo.action.toLowerCase()=="account"&&urlInfo.app.toLowerCase()=="user") {
        $.get(CONFIG.ajaxApiUrlRoot + "user/uinfo", {p: "v",token:token}, function (data) {
            if (data.status == '1') {
                $("#name").html(data.data.user_login);
                $("#email").html(data.data.user_email);
                $("#iphone").html(data.data.umobile);
                $("#time").html(data.data.create_time);
            }else {
                $("#thing").text(data.msg);
                $("#thing").css("display", "inline").fadeOut(3000);
            }
        });
    };

    // 评论
    $(function(){
         /* 我的评论 by ww*/
        if (urlInfo.action=="comment") {
            var scrollLoad = appList.listFn({
                url:"comment/indexs",
                param:{token:token},
                content:".user-comment-sty:eq(0) div.content",
                tpl:"comment_send_tpl",
                // container:".scroll-container:eq(0)"
            }, ".btn-load:eq(0)",".ico-loading:eq(0)");
            var scrollLoad2 = appList.listFn({
                url:"comment/indexr",
                param:{token:token},
                content:".user-comment-sty:eq(1) div.content",
                tpl:"comment_received_tpl",
                // container:".scroll-container:eq(0)"
            }, ".btn-load:eq(1)",".ico-loading:eq(1)");

        }
        $(".user-comment-title .user-comment-input").click(function(){
            $(".user-comment-title .user-comment-input").removeClass("current");
            $(this).addClass("current");
            var n = $(".current").index();
            $(" .user-comment-sty ").css("display","none")
            $(" .user-comment-sty ").eq(n).css("display","block")
        });
        $(".user-comment-title .user-comment-input").click(function(){
                $(".user-comment-title .user-comment-input").removeClass("current");
                $(this).addClass("current");
                var n = $(".current").index();
                $(" .user-comment-sty ").css("display","none")
                $(" .user-comment-sty ").eq(n).css("display","block")
        });
    });

    //邀请好友
    if (urlInfo.action.toLowerCase()=="invitation"&&urlInfo.app.toLowerCase()=="user") {
        var scrollLoad_friend = appList.listFn({
            url: "user/recommend",
            param: {token: token},
            content: ".user-invitation-content",
            tpl: "tpl_friend",
            beforeCallBack: function () {
                $(".loading").show();
            },
            cb: function (resData, textStatus, jqXHR) {
                console.log("回调成功");
                $(".loading").hide();
                var config = {
                    url: resData.data,
                    title: "欢迎注册文博在线",
                    desc: "文昭天下，博览乾坤",
                    img: "http://192.168.11.226:8081/themes/simplebootx/Public/images/img_logo.png",
                    from: "文博在线"
                };
                var share_obj = new nativeShare('friendShare', config);
                //百度分享
                window._bd_share_config = {
                    common: {
                        bdText: "欢迎注册文博在线",
                        bdDesc: "文昭天下，博览乾坤",
                        bdUrl: resData.data,
                        searchPic:1,
                        bdPic: "http://192.168.11.226:8081/themes/simplebootx/Public/images/img_logo.png",
                    },
                    share: [{}],
                }
                with (document)0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
            }

        }, auiTemplate);
    };


    /* 用户信息 by ww*/

    if (urlInfo.action.toLowerCase()=="index"&&urlInfo.app.toLowerCase()=="user") {
        app.render(auiTemplate).template({
            url:"user/uinfo",
            param:{token:token},
            content:".user-index",
            tpl:"uinfo_uinfo"
        });
    }
    /* 用户信息 end*/


    /* 系统消息 by ww*/
    if (urlInfo.action.toLowerCase()=="message"&&urlInfo.app.toLowerCase()=="user") {
        appList.listFn({
               url:"Message/index",
                param:{token:token},
                content:".user-message-content",
                tpl:"system_tpl"
        }, ".btn-load:eq(0)",".loading:eq(0)");
    }
    /* 系统消息 end*/

    /* 系统消息详情 by ww*/
    if (urlInfo.action.toLowerCase()=="message_detail"&&urlInfo.app.toLowerCase()=="user") {
        app.render(auiTemplate).template({
            url:"Message/content",
            param:{token:token,id:urlInfo.query?(urlInfo.query.id||""):""},
            content:".user-about",
            tpl:"tpl"
        });
    }
    /* 系统消息详情 end*/
});