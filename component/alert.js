/**
 * @name alert
 * @class huiyan.alert
 * @fileoverview 通用alert提示框
 *
 * @copyright 2001-2013 adam
 * @author adam <pangyuanxing@baofeng.com>
 * @license {@link www.baofeng.com}
 *
 */

goog.provide('huiyan.alert');
goog.require('jQuery');
goog.require('huiyan.window');

huiyan.alert = function ( config, confirmFn, cancelFn ) {
    config = config || {};

    /**
     * 参数配置与合并
     * @type {Object}
     */
    config = $.extend({
        uid: 1000,
        width: 400,
        zIndex: 9999,
        ismask: true,
        alertMsg : ''
    }, config);

    var alert = new huiyan.window( config, confirmFn, cancelFn ).show();
    alert.container.find('.popup-title').html( config.title );
    alert.container.find('.alert-msg').html( config.alertMsg );
    return alert;

};
