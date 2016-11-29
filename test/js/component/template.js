define(["template","common","route"],function(template,common,route){
    template.helper('dateFormat', common.dateFormat);
    template.helper('json_encode', function (object) {
        if(typeof JSON !="undefined"){
            try{
               return JSON.stringify(object);
            }catch(e){
                console.log(e);
            }
        }
    });
    template.helper('U', function(path,param){
        return route.U(path ,param);
    });
    template.helper('replace', function (string,find,replace) {
        if (typeof string ==="string"&&string) {
            if(typeof find !== "undefined" &&typeof replace !== "undefined")
            return string.replace(find,replace);
        }
    });
    template.helper('default', function (a,replace) {
        return (typeof a ==="undefined"||!(!!a))?replace:a;
    });
    template.helper('default_img', function (a) {
        return (typeof a ==="undefined"||!(!!a))?GV&&(GV.TMPL_Public+"/images/default-thumbnail.png"): a;
    });
    template.helper('date_during', function (a,format) {
        var now = new Date();
        var d = new Date(a.replace(/\-/,"/"));
        var during;
        if (!isNaN( d.getDate() )) {
            during = d - now;
            var days = Math.ceil(during/(1000*60*60*24));
            var months = Math.floor(days/30);
            if(months<3&&months>0){
                return "还有" + months + "个月";
            }
            if(days<15&&days>0){
                return "还有" +days + "天";
            }
        }
        return format?common.dateFormat(a,format):a;
    });
    return template;
});