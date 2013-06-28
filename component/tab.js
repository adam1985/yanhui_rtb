/**
 * @name tab
 * @class tab
 * @fileoverview 通用tab组件
 *
 * @copyright 2001-2013 adam
 * @author adam <pangyuanxing@baofeng.com>
 * @license {@link www.baofeng.com}
 *
 */

goog.provide('huiyan.tab');
goog.require('jQuery');
goog.require('huiyan.loading');
goog.require('huiyan.ajax');

/**
 * 选项卡构造器
 * @constructor
 * @param {object} config 配置参数
 * @param {string} config.menuBox tab菜单项容器ID
 * @param {string} config.menuSelector tab菜单项标签名或类名,默认为li
 * @param {string} config.container tab内容项容器ID
 * @param {string} config.containerSelector tab内容项标签名或类名,默认为div
 * @param {string} config.class_name 切换类名
 * @param {string} config.eventType 切换事件类型,默认为click
 * @param {string} config.type 类型，默认为静态类型static
 * @param {string} config.url 类型为ajax选项卡，ajax请求初始化地址
 * @param {boolean} config.isload 类型为ajax选项卡,是否有loading效果
 * @private
 */

huiyan.tab = function (config) {
    var self = this;

    /**
     * 参数配置与合并
     * @type {Object}
     */

    config = $.extend({
        menuSelector: 'li',
        containerSelector: 'div',
        class_name: 'on',
        eventType: 'click',
        type: 'static',
        isload: false

    }, config);

    this.config = config;

    /**
     * 把config配置参数写入this当前对象上
     */
    $.each(config, function (key, val) {
        self[key] = val;
    });

    /**
     * 获取DOM元素
     * @type {*|jQuery|HTMLElement}
     */
    this.menuBox = $('#' + config.menuBox);
    this.menuList = menuBox.find(this.menuSelector);
    this.container = $('#' + config.container);
    this.containerList = menuBox.find(this.containerSelector);

    this.addEvent();
    return this;

};

/**
 * 绑定事件
 * @returns {this}
 */

huiyan.tab.prototype.addEvent = function () {
    this.invoke();
    return this;
};


/**
 *  tab选项卡切换
 */
huiyan.tab.prototype.invoke = function () {

    var menuLen = this.menuList.length,
        containerLen = this.containerList.length, self = this;

    /**
     * 切类当前类名，隐藏与显示
     * @param jqObj 待处理jQuery对象
     * @param index 当前索引值i
     * @private
     */
    var toggleClassName_ = function (jqObj, index) {
        jqObj.removeClass(self.class_name).eq(index).addClass(self.class_name);
    };

    /**
     * 返回loading对象
     * @type {huiyan.loading}
     */
    var load = huiyan.loading({
        url: '/images/loadding.gif',
        isMask: true,
        width: 64,
        height: 64
    })();

    if (this.type === 'static') {

        if (menuLen !== containerLen) {
            throw Error('tab菜单项与tab内容项长度不相等!');
        }
    }

    /**
     * 事件监听与处理程序
     */
    this.menuList[ this.eventType ](function () {
        var index = $(this).index();
        self.timeout = setTimeout(function () {
            if (self.type === 'static') {
                /**
                 *  静态类型static
                 */
                toggleClassName_(self.menuList, index);
                toggleClassName_(self.containerList, index);
            } else if (self.type === 'dynamic') {
                /**
                 * 动态类型ajax
                 */
                toggleClassName_(self.menuList, index);
                self.isload && load.show();
                huiyan.ajax({
                    url: self.url,
                    dataType: 'text',
                    success: function (data) {
                        self.isload && load.hide();
                        self.container(data);
                    }
                });
            }

        }, 50);
    });

    /**
     * 防止快速触发事件，延时处理
     */
    this.menuList.mouseout(function () {
        self.timeout && clearTimeout(self.timeout);
    });

    return this;

};
