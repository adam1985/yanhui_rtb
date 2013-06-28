/**
 * @name SelectLayer
 * @class SelectLayer
 * @class huiyan.SelectLayer
 * @fileoverview 修复ie6无法遮盖select的组件
 *
 * @copyright 2001-2013 adam
 * @author adam <pangyuanxing@baofeng.com>
 * @license {@link www.baofeng.com}
 *
 */

goog.provide('huiyan.SelectLayer');

goog.require('jQuery');
goog.require('huiyan.base');

(function(){

    /**
     * 修复ie6无法遮盖select
     * @constructor
     * @name SelectLayer
     * @class SelectLayer
     * @private
     *
     */


    var SelectLayer_ = function ( config ) {
        config = config || {};

        config = $.extend({
            container : $(document.body),
            zIndex: -1,
            top : -1,
            left : -1
        }, config);

        this.config = config;


        return this;

    };

    /**
     * 判断是否为ie6
     * @type {boolean}
     * @static ISIE6
     * @private
     *
     */
    SelectLayer_.ISIE6 = huiyan.base.isIe6;

    /**
     * 生成一个iframe元素
     * @methon create 生成方法
     * @private
     */
    SelectLayer_.prototype.create = function(){
          if( SelectLayer_.ISIE6 ){
              this.oIframe = $('<iframe></iframe>');
              this.config.container.append( this.oIframe );
              this.oIframe.css({
                  position : 'absolute',
                  top : this.config.top,
                  left : this.config.left,
                  filter : 'alpha(opacity=0)',
                  'z-index' : this.config.zIndex,
                  border : 0
              });
          }

          return this;
    };

    /**
     * 设置iframe高度
     * @methon setHeight 设置高度方法
     * @private
     */
    SelectLayer_.prototype.setHeight = function(){
        if( SelectLayer_.ISIE6 ){
            this.oIframe.css({
                width : this.config.container.width(),
                height : this.config.container.height()
            });
        }
        return this;
    };

    huiyan.SelectLayer = function( config ){
           return new SelectLayer_( config ).create();
    };
})();




