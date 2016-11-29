define(["jquery","common","route","app","auiTemplate","appMap","CONFIG","nativeShare",],function ($,common,route,app,auiTemplate,appMap,CONFIG) {
   //展览详情
    var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    var U = route.U;
    var token=$("#token").val();//获取用户令牌
    $(function(){
        var urlinfo = common.getURLInfo();
        var value = urlinfo.query.id;
        var map;
        //展览详情
        var scrollLoad = app.scrollLoad({
            url:urlPaths.showroom.content,
            param:{p:"v",id:value},
            content:"#showroomdetail",
            tpl:"tpl",
            beforeCallBack:function(){
                $(".loading").show();
            },
            cb:function(resData, textStatus,jqXHR){
                document.title=resData.data.title+"—文博在线";
                $(".loading").hide();
                $(".picshow .pic").css("width",+resData.data.pic_url.length*3+"rem")
                var config = {
                    url:location.href,
                    title:resData.data.title,
                    desc:resData.data.excerpt || resData.data.title,
                    img:resData.data.item_background  || "http://192.168.11.226:8081/themes/simplebootx/Public/images/img_logo.png",
                    //img_title:resData.data.title,
                    from:'文博在线'
                };
                var share_obj = new nativeShare('nativeShare',config);

                //百度分享
                window._bd_share_config = {
                    common : {
                        bdText : resData.data.title,
                        bdDesc : resData.data.excerpt || resData.data.title,
                        bdUrl : location.href,
                        bdPic : resData.data.item_background || "http://192.168.11.226:8081/themes/simplebootx/Public/images/img_logo.png"
                    },
                    share : [{

                    }],

                }
                with (document)0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];

                $(".showroomdetail-route").click(function(event){
                    // event.preventDefault();
                    if(!resData.data.x){
                        alert("没有提供博物馆地理信息，无法导航，请在互联网检索相关信息");
                        retrun;
                    }
                    if (!map) {
                        $("body").append('<div id="map-container" style="display:none"></div>');
                        map = new AMap.Map("container", {
                            resizeEnable: true,
                            zoom: 4,
                            animateEnable:false
                        });
                    }
                    appMap.routeGuide(map,{name:resData.data.item_location,lng:resData.data.x,lat:resData.data.y});
                });
            }
        },auiTemplate);
        //评论列表
        var tit=$(".showroomdetail-title").html();
        var scrollLoad_comment = app.scrollLoad({
            url:urlPaths.comment.list,
            param:{p:"v",type:"1",pernum:"3",id:value},
            content:"#comment",
            tpl:"tpl_comment",
            cb:function(resData, textStatus,jqXHR){
                console.log("回调成功");
                //弹出回复框
                $(".btn-reply").click(function(){
                    if($(this).html()=="回复"){
                        $(".comment-reply").remove();
                        $(".btn-reply").html("回复");
                        $(this).html("取消");
                        var replytextarea= "";
                        replytextarea += "<div class='comment-reply'>";
                        replytextarea += "<textarea class='comment-textarea'></textarea>";
                        replytextarea += "<div class='comment-statement'>网友评论仅供其表达个人看法，并不表明文博在线立场。</div>";
                        replytextarea += "<div class='btn-comment comment-submit2'>评论</div>";
                        replytextarea += "<div class='clear'></div>";
                        replytextarea += "</div>";
                        $(this).parent().parent().parent().append(replytextarea);
                        //发表回复评论
                        $(".comment-submit2").click(function(){
                            var recon=$(this).parent().find(".comment-textarea").val();
                            var reid=$(this).parent().parent().find(".reid").val();
                            tit=$(".showroomdetail-title").html();
                            if($("#token").val()!=""){
                                $.post(CONFIG.ajaxApiUrlRoot+"Comment/send",{ p:"v",token:token,pid:reid,type:"1",title:tit,content:recon,id:value},function(data){
                                    if(data.status=='1'){
                                        alert(data.msg);
                                        $(".comment-textarea").val("");
                                    }else{
                                        alert(data.msg);
                                    }
                                });
                            }
                            else{
                                location.href=U("user/index/login");
                            }
                        });
                    }
                    else{
                        $(".comment-reply").remove();
                        $(".btn-reply").html("回复");
                    }
                });
                //隐藏全部评论按钮
                if(resData.data!=null){
                    $(".comment-all").css("display","block")
                }
                //发表评论
                $(".comment-submit1").click(function(){
                    var con=$("#comment-textarea").val();
                    tit=$(".showroomdetail-title").html();
                    if($("#token").val()!=""){
                        $.post(CONFIG.ajaxApiUrlRoot+"Comment/send",{ p:"v",token:token,pid:"0",type:"1",title:tit,content:con,id:value},function(data){
                            if(data.status=='1'){
                                alert(data.msg);
                                $(".comment-textarea").val("");
                            }else{
                                alert(data.msg);
                            }
                        });
                    }
                    else{
                        location.href=U("user/index/login");
                    }
                });
            }
        },auiTemplate);
        //点击全部评论按钮
        $(".comment-all").click(function(){
            location.href=U("portal/index/comment",{type:1,id:value});
        });

    });



});