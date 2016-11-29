define(["jquery","common","route","app","auiTemplate","CONFIG","nativeShare"],function ($,common,route,app,auiTemplate,CONFIG) {
   //新闻详情
    var urlPaths = CONFIG.urlPaths; //渲染模板的公共的方法
    var U = route.U;
    var token=$("#token").val();//获取用户令牌
    $(function(){
        var urlinfo = common.getURLInfo();
        var value = urlinfo.query.id;
        //新闻详情
        var scrollLoad = app.scrollLoad({
            url:urlPaths.news.content,
            param:{p:"v",object_id:value},
            content:"#newsdetail",
            tpl:"tpl",
            beforeCallBack:function(){
                $(".loading").show();
            },
            cb:function(resData, textStatus,jqXHR){
                document.title=resData.data.post_title+"—文博在线";
                $(".loading").hide();
                var config = {
                    url:location.href,
                    title:resData.data.post_title,
                    desc:resData.data.post_excerpt || resData.data.post_title,
                    img:resData.data.thumb || "http://192.168.11.226:8081/themes/simplebootx/Public/images/img_logo.png",
                    //img_title:resData.data.post_title,
                    from:"文博在线"
                };
                var share_obj = new nativeShare('nativeShare',config);

                //百度分享
                window._bd_share_config = {
                    common : {
                        bdText : resData.data.post_title,
                        bdDesc : resData.data.post_excerpt || resData.data.post_title,
                        bdUrl : location.href,
                        bdPic : resData.data.thumb || "http://192.168.11.226:8081/themes/simplebootx/Public/images/img_logo.png"
                    },
                    share : [{

                    }],

                }
                with (document)0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];

                ////非UC浏览器和QQ浏览器时
                //$("#shareToQzone").click(function(){
                //    var _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
                //    _shareUrl += 'url=' + encodeURIComponent(document.location);   //参数url设置分享的内容链接|默认当前页location
                //    _shareUrl += '&showcount=' + 0;      //参数showcount是否显示分享总数,显示：'1'，不显示：'0'，默认不显示
                //    _shareUrl += '&desc=' + encodeURIComponent(resData.data.post_title);    //参数desc设置分享的描述，可选参数
                //    _shareUrl += '&summary=' + encodeURIComponent('分享摘要');    //参数summary设置分享摘要，可选参数
                //    _shareUrl += '&title=' + encodeURIComponent(resData.data.post_title);    //参数title设置分享标题，可选参数
                //    _shareUrl += '&site=' + encodeURIComponent('文博在线');   //参数site设置分享来源，可选参数
                //    _shareUrl += '&pics=' + encodeURIComponent('http://www.wenbozaixian.com/data/upload/20160426/571f140504b6b.jpg');   //参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
                //    window.open(_shareUrl);
                //});
                //$("#shareToSinaWB").click(function(){
                //    var _shareUrl = 'http://v.t.sina.com.cn/share/share.php?&appkey=895033136';     //真实的appkey，必选参数
                //    _shareUrl += '&url='+ encodeURIComponent(document.location);     //参数url设置分享的内容链接|默认当前页location，可选参数
                //    _shareUrl += '&title=' + encodeURIComponent(resData.data.post_title);    //参数title设置分享的标题|默认当前页标题，可选参数
                //    _shareUrl += '&source=' + encodeURIComponent('文博在线');
                //    _shareUrl += '&sourceUrl=' + encodeURIComponent('http://www.wenbozaixian.com');
                //    _shareUrl += '&content=' + 'utf-8';   //参数content设置页面编码gb2312|utf-8，可选参数
                //    _shareUrl += '&pic=' + encodeURIComponent('http://www.wenbozaixian.com/data/upload/20160426/571f140504b6b.jpg');  //参数pic设置图片链接|默认为空，可选参数
                //    window.open(_shareUrl);
                //});
            }

        },auiTemplate);

        //评论列表
        var tit=$(".newsdetail-title").html();
        var scrollLoad_comment = app.scrollLoad({
            url:urlPaths.comment.list,
            param:{p:"v",type:"0",pernum:"3",id:value},
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
                            tit=$(".newsdetail-title").html();
                            if($("#token").val()!=""){
                                $.post(CONFIG.ajaxApiUrlRoot+"Comment/send",{ p:"v",token:token,pid:reid,type:"0",title:tit,content:recon,id:value},function(data){
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
                    tit=$(".newsdetail-title").html();
                    if($("#token").val()!=""){
                        $.post(CONFIG.ajaxApiUrlRoot+"Comment/send",{ p:"v",token:token,pid:"0",type:"0",title:tit,content:con,id:value},function(data){
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
            location.href=U("portal/index/comment",{type:0,id:value});
        });

        //相关新闻
        var scrollLoad_relevant = app.scrollLoad({
            url:urlPaths.news.content,
            param:{p:"v",object_id:value},
            content:".newsdetail-relevant",
            tpl:"tpl_relevant",
            beforeCallBack:function(){
                $(".loading").show();
            },
            cb:function(resData, textStatus,jqXHR){
                console.log("回调成功");
                $(".loading").hide();
            }
        },auiTemplate);



    });



});