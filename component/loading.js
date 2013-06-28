/**
 * @name loading
 * @class huiyan.loading
 * @fileoverview 选项卡loading图标
 *
 * @copyright 2001-2013 adam
 * @author adam <pangyuanxing@baofeng.com>
 * @license {@link www.baofeng.com}
 *
 */

goog.provide('huiyan.loading');
goog.require('jQuery');
goog.require('huiyan.MaskLayer');


(function () {
    /**
     * @constructor
     * @param {object} config 配置参数
     * @param {string} config.wrapBox loading容器
     * @param {string} config.url loading小图标链接
     * @param {string} config.width loading小图标宽度
     * @param {string} config.heigth loading小图标高度
     * @param {string} config.isMask 是否显示模式窗口
     * @private
     */

    var loading_ = function (config) {
        var self = this;
        config = config || {};

        /**
         * 参数配置与合并
         * @type {Object}
         */

        config = $.extend({
            url: '/images/loadding.gif',
            isMask: true,
            width: 64,
            height: 64,
            wrapBox: document.body

        }, config);

        this.config = config;

        /**
         * 把config配置参数写入this当前对象上
         */
        $.each(config, function (key, val) {
            self[key] = val;
        });

        this.zIndex = 9999;

        this.create();

        return this;
    };

    /**
     * 检测浏览器是否为ie6
     * @type {loading_.prototype.isIE6}
     */
    loading_.prototype.isIE6 = function(){
        return $.browser.msie && $.browser.version == 6;
    }();

    loading_.prototype = {
        constructor: loading_,
        /**
         * 生成模拟窗口与loading小图标，并渲染到页面body底部
         */
        create: function () {
            var html = '<img style="width:' + this.width + 'px;height:' + this.height + 'px" src="' + this.url + '" />';
            var container = $('<div/>').css({
                position: this.isIE6 ? 'absolute' : 'fixed',
                display: 'none',
                'z-index': this.zIndex,
                left: '50%',
                top: '50%',
                margin: -( this.height / 2 ) + 'px 0 0 ' + -( this.width / 2 ) + 'px'
            });

            container.html(html);

            this.container = container;

            $(this.wrapBox).append(container);

            /**
             * 遮罩层对象
             * @type {MaskLayer}
             */


            if ( this.isMask ) {
                this.maskLayer = huiyan.MaskLayer({
                    contaier: this.wrapBox,
                    zIndex : this.zIndex - 1
                });
            }

            return this;

        },

        /**
         * 显示模拟窗口与loading小图标
         */
        hide: function ( fn ) {

            this.container.hide();
            this.isMask && this.maskLayer.hide( fn );
            return this;
        },

        /**
         * 隐藏模拟窗口与loading小图标
         */
        show: function ( fn ) {
            this.isIE6 && this.container.css( 'margin-top' , -( this.height / 2 ) + document.documentElement.scrollTop );
            this.isMask && this.maskLayer.show( fn );
            this.container.show();
            return this;
        }
    };

    /**
     * 通过单例模式返回一个引用函数
     * @param config 传入配置参数
     * @returns {Function} 返回一个functionr
     */
    var loadObj;
    huiyan.loading = function ( config ) {
        if( loadObj ){
            return loadObj;
        }else{
            return loadObj = new loading_( config );
        }
    };

})();

goog.exportSymbol('huiyan.loading', huiyan.loading);

