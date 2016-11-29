define({
    //切换环境
    ajaxApiUrlRoot:"http://192.168.11.226:8082/",
    // ajaxApiUrlRoot:"http://192.168.10.20/wbzxapi/",
    AJAX_CACHE:false,
    LOCALSTORAGE_PREFIX:"WB",
    LOCALSTORAGE_TOKEN:"TOKEN",
    URL_MODE:1,//URL模式 0 本地开发模式 1 开发/测试服务器模式 2 正式环境模式
    API_STATUS:{
        SUCCESS:"SUCCESS",
        FAIL:"FAIL",
        EMPTY_METHOD_CALL:"EMPTY_METHOD_CALL"
    },
    DEFAULT_IMAGE_PATH: typeof GV ==="object" ?GV.TMPL_Public+"/images/default-thumbnail.png":"",
    MAP:{
        TABLE_ID:"56f0b05b305a2a3288c02f7e",
        KEY:"5cf994399b57a615536ff4aa0211571f",
        DEFAULT_CITY:"北京",
        DEFAULT_POSITION:[117.214249, 39.084356]
    },
    API_COMMON_PARAM:{
        p:"v",
        v:"1.0.0"
    },
    urlPaths:{
        news:{
            news:"news/news",
            topNews:"news/topnews",
            picNotice:"news/picNotice",
            content:"news/content"
        },
        search:{
            index:"search/index",
            keywords:"search/keywords"
        },
        user:{
            register:"user/register",
            login:"user/login",
            uinfo:"user/uinfo",//获取当前用户信息
            recommend:"user/recommend"//当前用户推荐好友链接
        },
        wiki:{
            index:"wiki/index",//百科列表
            info:"wiki/info",//词条详情
            categorylist:"wiki/categorylist",//词条分类
            categorytype:"wiki/categorytype",//词条分类筛查结果
            searchinfo:"wiki/searchinfo"//词条搜索
        },
        archaeol:{
            expertpoint:"archaeol/expertpoint",//学术、发现
            tag:"archaeol/tag",//考古首页标签
            content:"archaeol/content",// 详情页
            tag:"archaeol/tag",// 考古首页标签
            city:"archaeol/city"// 城市列表
        },
        showroom:{
            museums:"showroom/museums",//获取博物馆对应展览
            exlist:"showroom/exlist",//获取展览列表
            city:"showroom/city",//城市列表
            content:"showroom/content"// 详情页

        },
        presCultural:{
            index:"relic/project",//文保列表
            content:"relic/info"//文保详情
        },
        comment:{
            list:"comment/index"//文章评论列表
        }
    }
});