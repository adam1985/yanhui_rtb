/**
 * @name base
 * @class huiyan.base
 * @fileoverview 通用接口方法
 *
 * @copyright 2001-2013 adam
 * @author adam <pangyuanxing@baofeng.com>
 * @license {@link www.baofeng.com}
 *
 */

goog.provide('huiyan.base');
goog.require('jQuery');


( function(){

    /**
     * 通用接口命名空间
     * @type {object}
     * @private
     */
    var staticBase_ = {};

    /**
     * 通用接口命名空间
     * @type {object}
     * @private
     */
    var dynamicBase_ = {};

    dynamicBase_.isIe6 = function(){
        return ( !!window.ActiveXObject && !window.XMLHttpRequest )
    }();

    /**
     * 文本输入框必须为数字
     */
    staticBase_.mustNumber = function () {
        var inputNumber = $('.is-number'), isNumber = /[^\d\.]|/g;
        inputNumber.blur(function() {
            if( isNumber.test( this.value )) {
                this.value = this.value.replace(isNumber, '' );
            }
        });
    };

    /**
     * 文本域输入框提示文本
     */
    staticBase_.textAeraTip = function ( config ) {
        config = config || {};
        var textaeras = $('.textaera-tip');
        textaeras.each( function(){
             var $this = $(this),
                 emptyStr = '',
                 defaultText = this.defaultValue,
                 container = $('<div/>').css({
                   'position' : 'relative',
                   'width' : $this.width()
                 }),
                 tipBox = $('<div/>').css({
                     'position' : 'absolute',
                     'left' : parseInt( $this.css('padding-left') ) + parseInt( $this.css('margin-left') ),
                     'top' :  parseInt( $this.css('padding-top') ) +  parseInt( $this.css('margin-top') ) ,
                     color : '#B3B3B3'
                 });


            if( config.isEdit ){
              if( config.tipText ){
                  tipBox.html( config.tipText );
                  this.value = defaultText
              }

              if( config.tipText == defaultText ){
                  this.value = emptyStr;
                  return;
              }

            }else{
                if( this.value == defaultText ){
                    tipBox.html( defaultText );
                    this.value = emptyStr;
                }
            }

            var content = $this.parent();
            container.append( $this );
            container.append( tipBox );
            content.append( container );

            if( config.isEdit && this.value != emptyStr ){
                tipBox.hide();
            }

            $this.focus( function(){
                tipBox.hide();
            }).blur( function(){
                if( $this.val() == emptyStr ){
                    tipBox.show();
                }
            });

            tipBox.click( function(){
                $this.focus();
            });

        });

    };

    /**
     * 控制文本框文字个数输入
     */

    dynamicBase_.controlInput = function( isEmpty ){

        var $formVaild = null;

        var validChart = function(form, size ){
             return form.Validform({
                tiptype : 3,
                label : '.label'
            }).addRule([
                    {
                        ele: 'textarea',
                        datatype: '*10-' + size,
                        nullmsg : '您可以输入' + size + '个字符，不能为空!'
                    }
            ]).check( false );
        };

        var validFlag = false;

        var validHandler = function( ele ){
            var self = $(ele), validForm = self.closest('form'), maxLength = parseInt( self.attr('size'));
            if( validForm.length ){
                validForm.addClass('beyond-chart');
            }else{

                validForm = $('<form class="beyond-chart"></form>');
                self.wrap( validForm );
            }
            if( ele.value.length > maxLength ){
                validFlag = true;
                return validChart( validForm, maxLength );
            }else if( validFlag || isEmpty ){
                return validChart( validForm, maxLength );
            }
        };

        var textAreas = $('.control-input');

        textAreas.keydown( function(){
            $formVaild = validHandler( this );
        });

        isEmpty && textAreas.focus( function(){
            $formVaild = validHandler( this );
        });

        return function(){
            isEmpty && textAreas.focus();
            return $formVaild;
        };
    };




    /**
     * 文本框默认提示处理
     */
    staticBase_.requireInput = function () {
        $('.require-text').focus( function(){
            var self = $(this), defaultText = this.defaultValue;
            if( self.attr('data-text') == defaultText ) {
                if( defaultText == this.value )this.value = '';
            }
        });
    };

    /**
     * 拦截查看历史记录鼠标滚轮事件
     */
    staticBase_.stopMousewheel = function () {
        var scrollStep = 30;
        $('.history-logview-box').each( function(){
            if($.browser.mozilla){
                this.addEventListener('DOMMouseScroll', function(e){
                    this.scrollTop += e.detail < 0 ? scrollStep : -scrollStep;
                    e.preventDefault();
                }, false);
            }else{
                this.onmousewheel = function( e ){
                    e = e || window.event;
                    this.scrollTop += e.wheelDelta < 0 ? scrollStep : -scrollStep;
                    e.returnValue = false;
                };
            }
        });
    };

    /**
     * 格式化小数
     * @methon
     * @param num
     * @returns {string}
     */

    dynamicBase_.keepDecimal = function( num ){
        if( typeof num != 'number' ){
            num = parseFloat( num.toString().replace(/[^\d\.]/g, '') );
        }

        return num;
    };

    /**
     * 格式化数字
     * @methon
     * @param num
     * @returns {string}
     */
    dynamicBase_.formatNumber = function( num, isInit ){
        if( typeof num != 'number' ){
            num = parseFloat( num.toString().replace(/,/g, '') );
        }

        if( !isInit ){
            num = num.toFixed(2).toString();
        }

        num = num.toString();

        num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        return num;
    };

    /**
     * 公开动态接口方法
     */

    for( var attr in dynamicBase_ ){
       if( dynamicBase_.hasOwnProperty( attr ) )huiyan.base[attr] = dynamicBase_[attr];
    }

    /**
     * 公开静态接口方法
     */

    for( var attr in staticBase_ ){
        if( goog.typeOf( staticBase_[attr] ) === 'function') {
            huiyan.base[attr] = staticBase_[attr];
        }
    }

    /**
     * 初始化静态接口方法
     */

    for( var attr in staticBase_ ){
        if( goog.typeOf( staticBase_[attr] ) === 'function') {
            staticBase_[attr]();
        }
    }


})();




