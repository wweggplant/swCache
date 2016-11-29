define(["jquery","common","auiTemplate","app","CONFIG"],function ($,common,auiTemplate,app,CONFIG) {
    var instance = false;
    var source ='   <div class="city-select-wrap" style="display:none">'+
                '           <div class="city-select">'+
                '              <div>'+
                '              {{if hot}}'+
                '                    <h3>{{title | default : "现有展览城市"}}</h3>'+
                '                <section>'+
                '                    <h4>热门城市</h4>'+
                '                    <div class=""><ul class="hot city-list">'+
                '                        {{each hot as city index}}'+
                '                            <li><a href="#" class="city" data-city={{city | json_encode}}>{{city.name}}</a></li>'+
                '                        {{/each}}'+
                '                    </ul></div>'+
                '                </section>'+
                '                <section>'+
                '                    <div class=""><ul>'+
                '                        {{each dcity as city index}}'+
                '                            <li ><a href="#" class="city" {{city.name}} data-city={{city | json_encode}}>{{city.name}}</a></li>'+
                '                        {{/each}}'+
                '                    </ul></div>'+
                '                    <div><ul  class="province-city-list">'+
                '                        {{each list as province index}}'+
                '                            <li><a class="province" href="#">{{province.name}}</a></li>'+
                '                            <li><ul>'+
                '                               {{each province.city as city index}}'+
                '                                   <li><a href="#" class="city" data-city={{city | json_encode}}>{{city.name}}</a></li>'+
                '                               {{/each}}'+
                '                           </ul></li>'+
                '                        {{/each}}'+
                '                    </ul></div>'+
                '                </section>'+
                '                 {{else}}'+
                '                 <div class="city-select-no-data">没有数据供选择</div> '+
                '                 {{/if}}'+
                '           </div>'+
                '           <span class="close">×</span>'+
                '       </div>'+
                '    </div>';
    return  function(url,cityHandle,data){
                if (!instance) {
                    var xhr =  app.render(auiTemplate).
                        template({
                                    url:url,
                                    content:"body",
                                    source:source,
                                    dataHandler:function(resData){
                                        if(data&&data.title){
                                            resData.title = data.title;
                                        }
                                        resData.dcity = resData.dcity&resData.dcity.length?resData.dcity:[{name:"全国",id:""}]
                                        return resData;
                                    }
                                });
                    var $citySelect,
                        isOpen = false,
                        currentClass = "on";
                    xhr.done(function(){
                        $citySelect = $(".city-select-wrap")
                        $citySelect.on('click', '.city-select a.city', function(event) {
                            event.preventDefault();
                            // window.location.href = new URI("")
                            if($.isFunction(cityHandle)){
                                cityHandle(this,$(this).data("city"),instance);
                                $citySelect.find('.city-select a.city').removeClass(currentClass)
                                $(this).addClass(currentClass)
                            }
                        });
                        $citySelect.on('scroll',function(event) {
                            event.stopPropagation();
                        });
                        $citySelect.find(".city-select > div").on('scroll',function(event) {
                            event.stopPropagation();
                        });
                        $citySelect.on('click', 'section', function(event) {
                            event.stopPropagation();
                        });
                        $citySelect.on('click', function(event) {
                            event.stopPropagation();
                            instance.close();
                        });
                        $citySelect.on('click', '.close', function(event) {
                            event.preventDefault();
                            instance.close();
                        });
                    });

                    instance = {
                        open:function(){
                            isOpen = true;
                            $citySelect.show();
                            $citySelect.find(".city-select > div").scrollTop(0);
                        },
                        close:function(){
                            isOpen = false;
                            $citySelect.hide();
                        },
                        toggle:function(){
                            if(isOpen){
                                this.close();
                            }else{
                                this.open();
                            }
                        }
                    }
                }
                return instance;
            };
});