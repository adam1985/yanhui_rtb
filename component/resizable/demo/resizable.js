(function ( $ ) {

    /**
     * @class resizable_ 可拖拽缩放文本框或文本域
     * @param textArea
     * @param config
     * @constructor
     * @private
     */
    var resizable_ = function( textArea, config ){
            this.init( textArea, config );
            return this;
    };

    /**
     * 初化始方法
     * @method init
     * @param textArea
     * @param config
     */
    resizable_.prototype.init = function( textArea, config ){
            config = config || {};
            config = $.extend({
                isRight : true,
                isBottom : true,
                maxWidth : 500,
                maxHeight : 500,
                cursor : 'se-resize'
            }, config );

            this.textArea = textArea;
            this.config = config;
            this.render();
            return this;
    };

    /**
     * 渲染文本框对象
     * @method render
     */
    resizable_.prototype.render = function(){
           this.width = this.textArea.width();
           this.height = this.textArea.height();
           var container = $('<div/>').css({
                 width : this.width,
                 height : this.height,
                 position : 'relative'
           }),
            handler = $('<div/>').addClass('text-handler');
            handler.addClass( this.config.cursor );
            this.textArea.wrap( container );
            this.textArea.after( handler );
            this.resize( container, handler );
    };

    /**
       文本框对象缩放
     * @method resize
     */
    resizable_.prototype.resize = function( container, handler ){
        var self = this, offset = handler.offset(), currentWidth = 0, currentHeight = 0;
        handler.mousedown( function(){
            currentWidth = self.textArea.width();
            currentHeight =  self.textArea.height();
        });

        handler.DND({
            isMove : false,
            onMove:function ( offset ) {
                var
                    targetWidth = currentWidth + offset.left,
                    targetHeight = currentHeight + offset.top;

                    self.textArea.addClass( self.config.cursor );

                if( self.width <= targetWidth  &&  self.height <= targetHeight &&
                    self.config.maxWidth >= targetWidth && self.config.maxHeight >= targetHeight){
                    var container = self.textArea.parent();
                    if( self.config.isRight ){
                        container.width( targetWidth );
                        self.textArea.width( targetWidth );
                    }
                    if( self.config.isBottom ){
                        container.height( targetHeight );
                        self.textArea.height( targetHeight );
                    }
                }

            },
            onDrop : function(){
                self.textArea.removeClass( self.config.cursor );
            }
        });
    };

    $.fn.resizable = function( config ){
        this.each( function(){
            new resizable_( $(this), config);
        });
    };

})( jQuery );