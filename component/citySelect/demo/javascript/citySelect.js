(function($) {
    var citySelect_ = function( container, options ){
        var defaults = {
            data: [],
            callBack: null
        };
        this.container = container;
        this.city = null;
        this.myContent = null;
        this.placeArr = [24, 106, 188, 270];
        this.provinceArr = {};
        this.cityArr = {};
        this.timer = null;
        this.options = $.extend(defaults, options);
        /**
         * 初始化
         */
        this.init = function() {
            this.initData(this.options.data, false);
            this.initHtml();
            this.initProvince(this.provinceArr);
            this.initBindEvent();
        };
        /**
         * 初始化数据
         */
        this.initData = function(data, bool) {
            for (var i in data) {
                var temp = data[i];
                var parent_id = temp.parent_id;
                temp.isSelected = bool;
                if (parent_id == '0') {
                    temp.isAllSelected = bool;
                    temp.isExpand = true;
                    this.provinceArr[temp.id] = temp;
                } else {
                    !this.cityArr[parent_id] ? (this.cityArr[parent_id] = []) : (this.cityArr[parent_id][temp.id] = temp);
                }
            }
        };
        /**
         * 初始化左侧省级面板
         */
        this.initProvince = function(arr) {
            var html = '';
            for (var i in arr) {
                var check = arr[i].isSelected ? 'checked="checked"' : '';
                var color = arr[i].isSelected ? 'class="checked-color"' : ''
                html += '<dd ' + color + '  id=' + arr[i].id + ' name=' + arr[i].name + '><input type="checkbox" ' + check + ' /><label>' + arr[i].name + '</label></dd>';
            }
            document.getElementById('province').innerHTML = html;
        };
        /**
         * 绑定事件
         */
        this.initBindEvent = function() {
            this.city = $('#city');
            this.myContent = $('#myContent');
            var province = $('#province');
            var self = this;
            province.click(function(ev) {
                self.onProvinceHandler.call(self, ev);
            });
            province.mouseover(function(ev) {
                self.overHandler.call(self, ev);
            });
            province.mouseleave(function(ev) {
                self.timer = setTimeout(function() {
                    self.city.hide();
                }, 100);
            });
            this.city.mouseenter(function(ev) {
                clearTimeout(self.timer);
            });
            this.city.mouseleave(function(ev) {
                self.timer = setTimeout(function() {
                    self.city.hide();
                }, 100);
            });
            $('#city dd').live('mouseenter', function(ev) {
                self.onCityHandler(ev.currentTarget, 1);
            });
            this.city.delegate('dd', 'mouseleave', function(ev) {
                self.onCityHandler(ev.currentTarget, 2);
            });
            this.city.on('click', 'dd', function(ev) {
                self.onCityHandler(ev.currentTarget, 3);
            });
            this.myContent.click(function(ev) {
                self.clickContent.call(self, ev);
            });
            $('#deleAllBtn').click(function() {
                self.addRemove.call(self, 'remove');
            });
            $('#addAllBtn').click(function() {
                self.addRemove.call(self, 'add');
            });
            $('#resultBtn').click(function(ev) {
                self.sendResult.call(self, ev);
            });
        };
        /**
         * 添加全部／删除全部
         */
        this.addRemove = function(type) {
            var bool = type == 'remove' ? false : true;
            this.initData(this.options.data, bool);
            this.initProvince(this.provinceArr);
            this.changeCityAndProvince();
        };
        /**
         * 一级省份
         */
        this.onProvinceHandler = function(ev) {
            ev.target.parentNode.nodeName == 'DD' && this.handlerProvinceData(ev.target.parentNode.id);
        };
        /**
         * 鼠标悬浮
         */
        this.overHandler = function(ev) {
            var parent = ev.target.parentNode;
            if (parent && parent.nodeName == 'DD') {
                this.cityArr[parent.id] ? this.city.show() : this.city.hide();
                this.cityArr[parent.id] && this.changeContent(parent);
            }
        };
        /**
         * 全部处理右侧栏目
         */
        this.clickContent = function(ev) {
            var target = ev.target;
            var id = target.parentNode.parentNode.parentNode.id;
            if (target.nodeName == 'INPUT') {
                id = id.replace('pid_', '');
                this.provinceArr[id].isExpand = !this.provinceArr[id].isExpand;
                this.changeCityAndProvince();
                return;
            } else if (target.nodeName == 'A') {
                if (target.parentNode.parentNode.nodeName == 'DIV') {
                    id = id.replace('pid_', '');
                    var temp = this.cityArr[id];
                    for (var i in temp) {
                        temp[i].isSelected = false;
                    }
                } else if (target.parentNode.parentNode.nodeName == 'DT') {
                    cid = id.replace('cid_', '');
                    id = target.parentNode.parentNode.parentNode.parentNode.id;
                    id = id.replace('pid_', '');
                    this.cityArr[id][cid].isSelected = false;
                }
            }
            if (!isNaN(id) && id != '') {
                this.centerShow(id);
            }
        };
        /**
         * 统一处理数据中心---province
         */
        this.handlerProvinceData = function(id) {
            for (var i in this.cityArr[id]) {
                this.cityArr[id][i].isSelected = !this.provinceArr[id].isSelected;
            }
            this.centerShow(id);
        };
        /**
         * 统一处理数据中心---city
         */
        this.handlerCityData = function(target) {
            var id = target.id;
            var parent_id = target.getAttribute('parent_id');
            this.cityArr[parent_id][id].isSelected = !this.cityArr[parent_id][id].isSelected;
            this.centerShow(parent_id);
        };
        /**
         * 统一展示数据
         */
        this.centerShow = function(id) {
            this.changeCity(id);
            this.changeProvince(id);
            this.changeCityAndProvince();
        };
        /**
         * 右侧数据展示
         */
        this.changeCityAndProvince = function() {
            var text = '';
            this.myContent.html(text);
            for (var i in this.provinceArr) {
                var pro = this.provinceArr[i];
                var isAll = pro.isAllSelected;
                if (pro.isSelected) {
                    if (isAll) {
                        text += '<li id=pid_' + pro.id + '><div><em class="fl">' + pro.name + '</em><span class="fr"><a href="javascript:void(0);">删除</a></span></div></li>';
                    } else {
                        var arr = this.cityArr[pro.id];
                        var img = pro.isExpand ? 'images/expand.png' : 'images/packup.png';
                        text += '<li id=pid_' + pro.id + '><div><span class="fl col_gray fb"><input type="image" src=' + img + '>' + pro.name + '</span><span class="fr"><a href="javascript:void(0);">删除</a></span></div>';
                        if (pro.isExpand) {
                            for (var j in arr) {
                                var temp = arr[j];
                                if (temp.isSelected) {
                                    text += '<dl id=cid_' + temp.id + '><dt><span class="fl">' + temp.name + '</span><span class="fr"><a href="javascript:void(0);">删除</a></span></dt></dl>';
                                }
                            }
                        }
                        text += '</li>';
                    }
                }
            }
            this.myContent.html(text);
        };
        /**
         * 修改province的样式
         */
        this.changeProvince = function(id) {
            var bool = this.provinceArr[id].isSelected;
            var mc = $('#' + id);
            bool ? mc.addClass('checked-color') : mc.removeClass('checked-color');
            mc.find('input').attr('checked', bool);
        };
        /**
         * 修改city的样式
         */
        this.changeCity = function(id) {
            if (this.cityArr[id]) {
                var isAll = true,
                    isPart = false;
                var arr = this.cityArr[id];
                for (var i in arr) {
                    !arr[i].isSelected ? (isAll = false) : (isPart = true);
                    $('#' + arr[i].id).find('input').attr('checked', arr[i].isSelected);
                }
                this.provinceArr[id].isAllSelected = isAll;
                this.provinceArr[id].isSelected = isPart;
            } else {
                this.provinceArr[id].isAllSelected = this.provinceArr[id].isSelected = !this.provinceArr[id].isSelected;
            }
        };
        /**
         * 响应二级城市
         */
        this.onCityHandler = function(target, type) {
            switch (type) {
                case 1:
                    $(target).css('backgroundColor', '#feeecc');
                    break;
                case 2:
                    $(target).css('backgroundColor', '');
                    break;
                case 3:
                    this.handlerCityData(target);
                    break;
            }
        };
        /**
         * 展示city内容
         */
        this.changeContent = function(parent) {
            var begin = this.placeArr[Math.floor(parent.offsetLeft / 76)];
            var fontL = parent.children[1].firstChild.nodeValue.length;
            var num = fontL >= 5 ? 5 : fontL;
            var end = begin + num * 13;
            var content = '<dl>' + this.getCityData(this.cityArr[parent.id]) + '</dl>';
            this.city.css('left', end);
            this.city.html(content);
        };
        /**
         * 获取二级城市的数据
         */
        this.getCityData = function(data) {
            var str = '';
            for (var i in data) {
                var checked = data[i].isSelected ? 'checked="checked"' : '';
                str = str + '<dd id=' + data[i].id + ' parent_id=' + data[i].parent_id + ' name=' + data[i].name + '><input type="checkbox" ' + checked + ' /><label>' + data[i].name + '</label></dd>'
            }
            return str;
        };
        /**
         * 初始化整体结构
         */
        this.initHtml = function() {
            this.container.innerHTML = '<div class="pop width640"><div class="pop_title">选择地域</div><div class="area_con"><div class="area_left"><div class="area_title"><span class="fl fb">省/市</span><span class="fr add-all fb"><a href="javascript:void(0);" class="col369 udline" id="addAllBtn">全部添加</a></span></div><dl id="province"></dl></div><div class="area_center">&gt;&gt;</div><div class="area_right"><div class="area_title"><span class="fl">已选地理位置</span><span class="fr add-all fb"><a href="javascript:void(0);" class="col369 udline" id="deleAllBtn">全部删除</a></span></div><div class="select-info"><ul id="myContent"></ul></div></div><div class="area_btn clear" id="resultBtn"><span class="start_btn"><a href="javascript:void(0);">完成</a></span> <span class="end_btn ml10"><a href="javascript:void(0);">取消</a></span></div></div><div class="area-float-layer" id="city" ></div>';
        };
        /**
         * 最后发送结果
         */
        this.sendResult = function(ev) {
            if (ev.target.nodeName == 'A' && this.options.callBack) {
                ev.target.parentNode.className == 'start_btn' ?
                    this.options.callBack(this.getResult()) :
                    this.options.callBack(this.getResult());
                this.hide();
            }
        };

        /**
         * 显示窗口
         */
        this.show = function(){
            $( this.container ).show();
        };

        /**
         * 隐藏窗口
         */
        this.hide = function(){
            $( this.container ).hide();
        };
        /**
         * 得到最终的结果
         */
        this.getResult = function() {
            var arrStr = [];
            var arrId = [];
            for (var i in this.provinceArr) {
                var temp = this.provinceArr[i];
                if (temp.isAllSelected) {
                    arrStr.push(temp.name);
                    arrId.push(temp.id);
                } else {
                    var city = this.cityArr[temp.id];
                    if (city) {
                        for (var j in city) {
                            var uu = city[j];
                            if (uu.isSelected) {
                                arrStr.push(uu.name);
                                arrId.push(uu.id);
                            }
                        }
                    }
                }
            }
            return [arrStr, arrId]
        };
        this.init();
    };
    var cityQuery;
	$.fn.citySelect = function( options ) {

       this.each( function(){
           if( cityQuery ){
               cityQuery.show();
           }else{
               cityQuery = new citySelect_( this, options);
           }

        });
	}
})(jQuery);