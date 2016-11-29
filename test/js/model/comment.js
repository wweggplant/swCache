define(["jquery","common","route","app","appList","auiTemplate","CONFIG"],function ($,common,route,app,appList,auiTemplate,CONFIG) {
   //评论列表
    var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    var listFn = appList.listFn;
    var U = route.U;
    var token=$("#token").val();//获取用户令牌
    $(function(){
        var urlinfo = common.getURLInfo();
        var value = urlinfo.query.id;
        var tvalue = urlinfo.query.type;
        //标题
        app.render(auiTemplate).template({
            url:urlPaths.comment.list,
            param:{p: "v", type: tvalue, pernum: "10", id: value},
            content:"#comment",
            tpl:"tpl_comment"
        }).done(function () {
            var tit=$(".newsdetail-title").html();
            document.title=tit+"—文博在线";
            //发表评论
            $(".comment-submit1").click(function(){
                var con=$("#comment-textarea").val();
                tit=$(".newsdetail-title").html();
                if($("#token").val()!="") {
                    $.post(CONFIG.ajaxApiUrlRoot + "Comment/send", {
                        p: "v",
                        token: token,
                        pid: "0",
                        type: tvalue,
                        title: tit,
                        content: con,
                        id: value
                    }, function (data) {
                        if (data.status == '1') {
                            alert(data.msg);
                            $(".comment-textarea").val("");
                        } else {
                            alert(data.msg);
                        }
                    });
                }
                else{
                    location.href=U("user/index/login");
                }
            });
        });
        //评论列表
        var scrollLoad_comment = listFn({
            url: urlPaths.comment.list,
            param: {p: "v", type: tvalue, pernum: "10", id: value},
            content: ".comment-list",
            tpl: "tpl_commentlist",
            cb:function(resData, textStatus,jqXHR){
                $("#wb-loading").hide();
                $(".ico-loading").hide();
                $(".btn-load").show();
                if(resData.data.length<10) {
                    $(".btn-load").hide();
                    $(".nomore").show()
                }
                if(resData.data.length==0) {
                    $(".btn-load").hide();
                    $(".nomore").hide()
                }
                //评论回复
                $(".btn-reply").click(function () {
                    if ($(this).html() == "回复") {
                        $(".comment-reply").remove();
                        $(".btn-reply").html("回复");
                        $(this).html("取消");
                        var replytextarea = "";
                        replytextarea += "<div class='comment-reply'>";
                        replytextarea += "<textarea class='comment-textarea'></textarea>";
                        replytextarea += "<div class='comment-statement'>网友评论仅供其表达个人看法，并不表明文博在线立场。</div>";
                        replytextarea += "<div class='btn-comment comment-submit2'>评论</div>";
                        replytextarea += "<div class='clear'></div>";
                        replytextarea += "</div>";
                        $(this).parent().parent().parent().find(".clear").first().after(replytextarea);
                        //发表回复评论
                        $(".comment-submit2").click(function(){
                            var recon=$(this).parent().find(".comment-textarea").val();
                            var reid=$(this).parent().parent().find(".reid").val();
                            tit=$(".newsdetail-title").html();
                            if($("#token").val()!="") {
                                $.post(CONFIG.ajaxApiUrlRoot + "Comment/send", {
                                    p: "v",
                                    token: token,
                                    pid: reid,
                                    type: tvalue,
                                    title: tit,
                                    content: recon,
                                    id: value
                                }, function (data) {
                                    if (data.status == '1') {
                                        alert(data.msg);
                                        $(".comment-textarea").val("");
                                    } else {
                                        alert(data.msg);
                                    }
                                });
                            }
                            else{
                                location.href=U("user/index/login");
                            }
                        });
                    }
                    else {
                        $(".comment-reply").remove();
                        $(".btn-reply").html("回复");
                    }
                });
            }
        },".btn-load",".ico-loading")

    });
});