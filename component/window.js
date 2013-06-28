/**
 * @name window
 * @module window
 * @fileoverview 通用弹出窗口
 *
 * @copyright 2001-2013 adam
 * @author adam <pangyuanxing@baofeng.com>
 * @license {@link www.baofeng.com}
 *
 */

goog.provide('huiyan.window');
goog.require('jQuery');
goog.require('huiyan.base');
goog.require('huiyan.MaskLayer');


/**
 * 通用弹出窗口
 * @class huiyan.window
 * @param {object} config 配置默认参数
 * @param {function} confirmFn 确定回调
 * @param {function} cancelFn 取消回调
 * @constructor
 */

huiyan.window = function ( config, confirmFn, cancelFn) {
    config = config || {};
    var self = this;
    /**
     * 参数配置与合并
     * @type {Object}
     */
    config = $.extend({
        uid : 1,
        width: 620,
        wrapper : $(document.body),
        zIndex : 9999,
        ismask : false,
        isSearch : false,
        isHasText : false,
        isClose : true,
        selectList : null,
        onshow : goog.nullFunction,
        isGrayBtn : false,
        alertMsg : '',
        searchFn : goog.nullFunction,
        buttons : [
            {
                text : '确定'
            }
        ],
        templatesLayout: null
    }, config);

    config.buttons  = config.buttons || [];

    if( config.alertType === 'confirm'){
        config.buttons.push({
            text : '取消'
        });
    }
    var args =  arguments;
    $.each( config.buttons, function( index ){
        this.fn = args[ index + 1 ] || null;
    });


    /**
     * 把config配置参数写入this当前对象上
     */

    $.each(config, function (key, val) {
        self[key] = val;
    });


    /**
     * 初化始MaskLayer对象
     * @type {huiyan.MaskLayer}
     */
    this.maskLayer = huiyan.MaskLayer({
        zIndex : this.zIndex,
        bgcolor : '#ccc',
        opacity :.3
    });

    /**
     * 防止重复生成窗口
     */
    for (var i = 0, len = huiyan.window.uidlist_.length; i < len; i++) {
        if ( huiyan.window.uidlist_[i] && huiyan.window.uidlist_[i].uid === this.uid) {
            var win = huiyan.window.uidlist_[i].win;
            return win.updateTemplate( this.createTemplate() ).
                createButton( this.buttons, this.alertType ).
                closeStatus( this.isClose ).show();
        }
    }

    /**
     * 初始化窗口
     */
    this.render();

    return this;


};

/**
 * 检测浏览器是否为ie6
 * @static ISIE6 静态属性
 * @type {Boolean}
 */
huiyan.window.prototype.ISIE6 = huiyan.base.isIe6;

/**
 * 初始化弹出窗口
 * @method render 渲染窗口，生成html，插入到页面中
 * @returns {this}返回当前对象
 */

huiyan.window.prototype.render = function () {
    var self = this;
    var container = $('<div class="pop ml20 width619"></div>');

    /**
     * 窗口容器浮动css设置
     */

    container.css({
        'width' : this.width,
        'display': 'none',
        'z-index' : this.zIndex + 1
    });

    if( !this.ISIE6 ){
        container.css({
            'position' : 'fixed',
            'left' : '50%',
            'top' : '50%',
            'margin-left' : -( this.width / 2 )
        });
    }else{
        container.css({
            'position' : 'absolute'
        }).addClass('fixed-center');
    }


    this.container = container;

    /**
     * 通用弹窗头部
     * @type {jQuery}
     */
    var headerStr = '<div class="pop_title">', searchTip = '请输入城市名称';
        if( this.isClose ){
            headerStr += '<span class="fr">' +
                            '<a href="javascript:void(0)" class="popup-close"><img src="/images/close.gif"></a>' +
                        '</span>'
        }else if( this.isSearch ){
            headerStr += '<span class="fr search">';
            if( this.selectList ){
                headerStr += '<select id="hot-city-search" style="display: none;">';
                headerStr += '<option value="">' + searchTip + '</option>';
                $.each( this.selectList, function( index, val ){
                    headerStr += '<option value="' + val.id + '">' + val.name + '</option>'
                });
                headerStr += '</select>';
            }else{
                headerStr += '<input type="text" id="search_con" />';
            }
            headerStr += '<input type="button" id="search_btn" value="" class="city-query-btn"></span>';
        }

    headerStr += '<span class="popup-title">' + this.title + '</span></div>';

    var header = $( headerStr),
        cityQueryBtn = header.find('.city-query-btn');

    cityQueryBtn.click( function(){
        self.searchFn( this, searchTip );
    } );

    this.closeBtn = header.find('.popup-close');

    /**
     * 通用弹窗内容
     * @type {jQuery}
     */

    var bodyer = $('<div class="pop_con' + ( this.isHasText ? '' : ' coman_text' ) + ' popup-body"></div>').css({
         width : this.width - 33
    });

    var containerBody = $('<div/>');
    this.templateStr = this.createTemplate();
    containerBody.html( this.templateStr );
    bodyer.append( containerBody );

    this.containerBody = containerBody;

    /**
     * 插入通用弹窗按钮
     */

     var btnGroup = $('<div class="btn_st mt20"></div>') ;

     this.btnGroup = btnGroup;

     this.createButton( this.buttons, this.alertType );

    bodyer.append( btnGroup );


    /**
     * 渲染到页面中
     */
    container.append(header);
    container.append(bodyer);
    /**
     * 生成IE6 select iframe layer
     * @type {huiyan.SelectLayer}
     */
    this.selectLayer = huiyan.SelectLayer({
        container : container
    });
    this.wrapper.append( container );



    /**
     * 关闭窗口事件
     */
    this.close();

    /**
     * 记录窗口状态
     */
    huiyan.window.uidlist_.push({
           uid : this.uid,
           win : this
    });
};

/**
 * 重新更新按钮组
 * @method createButton
 * @param buttons 按钮组
 * @param alertType 按钮类型
 * @returns {this} 返回当前对象
 */

huiyan.window.prototype.createButton = function( buttons, alertType ){
    var confirmBtn, cancelBtn, self = this;
    self.btnGroup.html('');
    $.each( buttons, function(index, val){
        if( index === 0 ){
            confirmBtn = $('<a class="start_btn" href="javascript:void(null)">' + val.text + '</a>');
            self.btnGroup.append( confirmBtn );
            confirmBtn[0].onclick = function(){
                if( 'function' === typeof val.fn ) {
                    val.fn( confirmBtn ) || self.hide();
                }else{
                    self.hide();
                }
                return false;
            };
        }else if( index === 1){
            var cancelBtnStr = '';
            if( alertType == 'confirm' ){
                var grayClass = '';
                if( this.isGrayBtn ){
                    grayClass =  'end_btn';
                }else{
                    grayClass =  'start_btn';
                }
                cancelBtnStr = '<a class="' + grayClass + ' ml10" href="javascript:void(null)">' + val.text + '</a>';

                cancelBtn = $( cancelBtnStr );

                self.btnGroup.append( cancelBtn );
                cancelBtn[0].onclick = function(){
                    if( 'function' === typeof val.fn ) {
                        val.fn( cancelBtn ) ||  self.hide();
                    }else{
                        self.hide();
                    }
                    return false;
                };

            }
        }
    });

    this.confirmBtn = confirmBtn;
    this.cancelBtn = cancelBtn;

    return this;
};

/**
 * 生成内容模板字符串
 * @method createTemplate
 * @return {string}
 */

huiyan.window.prototype.createTemplate = function () {
    /**
     * 通用模板插入数据
     */
    var templates;

    if( 'function' === typeof this.templatesLayout ){
        templates = this.templatesLayout()
    }else{
        templates = '<div class="alert-msg">' + this.alertMsg + '</div>';
    }

    return templates;
};

/**
 * 更新内容模板数据
 * @method updateTemplate
 * @param {string} _template 模板数据
 * @returns {this} 返回当前对象
 */


huiyan.window.prototype.updateTemplate = function( _template ){
       this.containerBody.html( _template );
       return this;
};

/**
 * 打开窗口
 * @method show
 * @returns {this} 返回当前对象
 */
huiyan.window.prototype.show = function () {
    var self = this;
    this.container.css({
        'margin-top' : -( this.container.height() / 2  )
    });

    this.ismask && this.maskLayer.show();
    if( $.browser.msie ){
        this.container.show( 0, function(){
            goog.bind(self.selectLayer.setHeight, self.selectLayer)();
            self.onshow();
        } );
    }else{
        this.container.fadeIn(500, function(){
            goog.bind(self.selectLayer.setHeight, self.selectLayer)();
            self.onshow();
        });
    }

    return this;
};

/**
 * 隐藏窗口
 * @method hide
 * @returns {this} 返回当前对象
 */
huiyan.window.prototype.hide = function () {
    if( $.browser.msie ){
        this.container.hide(0);
    }else{
        this.container.fadeOut(0);
    }


    this.ismask && this.maskLayer.hide();
    return this;
};

/**
 * 关闭窗口
 * @method close
 * @returns {this} 返回当前对象
 */
huiyan.window.prototype.close = function () {
    var self = this;
    this.container.find('.popup-close').click( function(){
          self.hide();
    });
    return this;
};

/**
 * 是否显示关闭按钮
 * @param status 如果为true显示，否则隐藏
 * @method closeStatus
 * @public
 */
huiyan.window.prototype.closeStatus = function( status ){
        if( status ){
            this.closeBtn.show();
        }else{
            this.closeBtn.hide();
        }
        return this;
};

/**
 * 销毁窗口
 * @method remove
 * @returns {this} 返回当前对象
 */
huiyan.window.prototype.remove = function () {
    this.container.remove();
    delete huiyan.window.uidlist_[ this.uid ];
    return this;
};

/**
 * 记录窗口UID
 * @type {Array}
 * @private
 */
huiyan.window.uidlist_ = [];

