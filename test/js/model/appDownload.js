define(["jquery",'TouchSlide'],function ($,TouchSlide) {
    $(document).ready(function () {
        TouchSlide({
            slideCell:"#focus",
            titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell:".bd ul",
            effect:"leftLoop",
            autoPlay:false,//自动播放
            autoPage:true //自动分页
        });
//判断是ios还是Android
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid == true){
            $("#down_android").css("display","inline-block");
            //alert('是Android');
        }else if(isiOS == true) {
            //alert('是iOS');
            $("#down_ios").css("display","inline-block");
        }else {
            //alert("不是Android或者ios");
            $("#down_tip").css({"display":"inline-block"});
        }
    });
});
