/**
 * @name ajax
 * @class huiyan.ajax
 * @fileoverview 通用ajax发送请求
 *
 * @copyright 2001-2013 adam
 * @author adam <pangyuanxing@baofeng.com>
 * @license {@link www.baofeng.com}
 *
 */

goog.provide('huiyan.ajax');
goog.require('jQuery');
goog.require('huiyan.loading');


/**
 * 发起ajax请求
 * @param {string} config.url ajax请求地址
 * @param {string} config.type ajax请求方式，默认为get
 * @param {string} config.dataType ajax返回数据格式
 * @param {string} config.success ajax请求成功回调
 */

huiyan.ajax = function( config ){

    huiyan.ajax.loading.show();

    config = $.extend({
        type:'get',
        dataType:'json'
    }, config);

    var success = config.success;

    config.success = function(){
        huiyan.ajax.loading.hide();
    };

    return huiyan.ajax.xhrObj = $.ajax( config).done( success).fail( config.success );
};

/**
 * 初始化huiyan.loading对象
 * @type {huiyan.loading}
 */
huiyan.ajax.loading = huiyan.loading();
