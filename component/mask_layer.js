/**
 * @name MaskLayer
 * @class huiyan.MaskLayer
 * @fileoverview 通用遮罩层，似模态窗口
 *
 * @copyright 2001-2013 adam
 * @author adam <pangyuanxing@baofeng.com>
 * @license {@link www.baofeng.com}
 *
 */

goog.provide('huiyan.MaskLayer');
goog.provide('huiyan.maskLayer');
goog.require('jQuery');
goog.require('huiyan.base');
goog.require('huiyan.SelectLayer');



(function () {

    /**
     * 通用遮罩层
     * @class MaskLayer_
     * @param {string} config.bgcolor 遮罩层背景颜色，默认为白色
     * @param {string} config.opacity 遮罩层透明度
     * @param {string} config.zIndex 遮罩层z-index
     * @private
     * @constructor
     *
     */


    var MaskLayer_ = function ( config ) {
        config = config || {};

        config = $.extend({
            contaier : document.body,
            bgcolor: '#fff',
            opacity: .2,
            zIndex: 9999
        }, config);

        this.config = config;
        /**
         * 渲染遮罩层
         */
        this.render();

        return this;

    };

    /**
     * 生成遮罩层
     * @method render 生成html，插入到页面中
     * @returns {jQuery} 返回遮罩层对象
     */
    MaskLayer_.prototype.render = function () {

        var maskBox = $('<div/>').css({
            position: 'absolute',
            display: 'none',
            background: this.config.bgcolor,
            'z-index': this.config.zIndex,
            left: 0,
            top: 0,
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
            opacity: this.config.opacity
        });

        this.maskBox = maskBox;

        $( this.config.contaier ).append(maskBox);

        return maskBox;

    };

    /**
     * 显示遮罩层
     * @method show 显示
     * @returns {this}
     */
    MaskLayer_.prototype.show = function ( fn ) {
        var doc = document.documentElement;
        this.maskBox.css({
            width: doc.scrollWidth,
            height: doc.scrollHeight
        });
        this.maskBox.show( fn );

        return this;
    };

    /**
     * 隐藏遮罩层
     * @method hide 隐藏
     * @returns {this}
     */
    MaskLayer_.prototype.hide = function ( fn ) {
        this.maskBox.hide( fn );
        return this;
    };

    /**
     * 销毁遮罩层
     * @method destroy
     * @returns {this}
     */
    MaskLayer_.prototype.destroy = function () {
        this.maskBox.remove();
        return this;
    };

    /**
     * 将遮罩层添加到body底部
     * @method appendBody
     * @returns {this}
     */
    MaskLayer_.prototype.appendBody = function () {
        this.maskBox.remove();
        $( document.body ).append( this.maskBox );
        return this;
    };

    /**
     * 外部引用
     * @type {Function}
     */

    huiyan.maskLayer = MaskLayer_;

    var maskLayer;

    /**
     * 单体模式
     * @param config 配置参数
     * @returns {MaskLayer_} 返回遮罩层对象
     * @constructor
     */

    huiyan.MaskLayer = function( config ){
         if( maskLayer ){
             return maskLayer.appendBody();
         }else{
             return maskLayer = new MaskLayer_( config );
         }
    };

})();
