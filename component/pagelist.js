goog.provide('huiyan.PageList');
goog.require('jQuery');

(function ($) {

    /**
     * 分页组件
     * @class pagelist_
     * @param {jQuery} container 分页盒子
     * @param {object} config 配置参数
     * @constructor
     * @private
     */
    var PageList_ = function (container, config) {
        config = config || {};
        this.container = container;
        this.config = config;


    };


    /**
     * 扩展jQuery插件
     * @param config
     */
    huiyan.PageList = function ( container, config ) {
       new  PageList_( container, config );
    };

})(jQuery);