(function ( $ ) {

    var DND = function( layer, args ) {

        this.init( layer, args );
        var _this = this;
        if ( this.range.nodeType ) {
            var _range = this.range;

            this.rangeSize = function ( _this ) {
                    var offset = $( _range ).offset(),
                        ml = parseInt($(_this.layer).css( 'margin-left')) || 0,
                        mr = parseInt($(_this.layer).css( 'margin-right')) || 0,
                        mt = parseInt($(_this.layer).css( 'margin-top')) || 0,
                        mb = parseInt($(_this.layer).css( 'margin-bottom')) || 0;
                    return {
                        minX: offset.left,
                        minY: offset.top,
                        maxX: offset.left + _range.clientWidth - _this.layer.offsetWidth - ml - mr,
                        maxY: offset.top + _range.clientHeight - _this.layer.offsetHeight - mt - mb
                    };
            };
        }else if( $.isPlainObject( this.range ) ){
            this.rangeSize = function( _this ){
                return _this.range;
            };
        }

        this.movingClassName = args.className;
        this.enable();

    };

    DND.prototype = {
        init: function ( layer, args ) {
            var self = this;
            this.layer = layer;
            this.originalArgs = args;
            if( args.handle ){
                if( !args.handle.jquery ){
                    args.handle = $( this.layer ).find( args.handle )[0];
                }
            }
            if( args.range ){
                if( !args.range.jquery ){
                    args.range = $( args.range )[0];
                }
            }

            args = $.extend(true, {
                handle : layer,
                range :  document.documentElement,
                isMove : true,
                direction :{
                    isTop : true,
                    isBottom : true,
                    isLeft : true,
                    isRight : true
                }
            }, args);

            $.each( args, function(i, val){
                self[i] = val;
            });


        },
        startDrag: function (evt) {//开始拖动

            var ret;
            if (this.onDragStart)
                ret = this.onDragStart(evt, this);

            if (ret === false) {
                return false;
            }
            evt.preventDefault();
            var layerOffset = $(this.layer).offset();

            this.layerOffset = layerOffset;

            this.offset = {//mousedown时鼠标与对象左上角的偏移
                left: evt.pageX - layerOffset.left,
                top: evt.pageY - layerOffset.top
            };


            //$(this.layer).addClass(this.movingClassName);

            var _this = this;
            this.mousemoveHandle = function (evt) {
                evt.preventDefault();
                _this.move(evt);
            };
            this.mouseupHandle = function (evt) {
                evt.preventDefault();
                _this.stopDrag();
            };
            $(document).on('mousemove', this.mousemoveHandle );
            $(document).on('mouseup', this.mouseupHandle );
            $(window).on('blur', this.mouseupHandle );

            //清除文本选中状态
            if (document.selection && document.selection.empty) {
                document.selection.empty();  //IE
            } else if (window.getSelection) {
                window.getSelection().removeAllRanges(); //火狐
            }


            if (this.layer.setCapture) {//IE 当鼠标移出窗口之后仍能捕获事件
                this.layer.setCapture(true);
            }
            $( this.layer ).on('dragstart', function( evt ){
                //阻止浏览器的默认拖动行为
                evt.preventDefault();
            });

        },
        move: function ( evt ) {//计算坐标

            var left = evt.pageX - this.offset.left - parseInt($(this.layer).css('margin-left')),
                top = evt.pageY - this.offset.top - parseInt($(this.layer).css('margin-top'));


            var de = document.documentElement;

            var range = this.rangeSize( this );

            left = Math.max(left, range.minX);
            left = Math.min(left, range.maxX);
            top = Math.max(top, range.minY);
            top = Math.min(top, range.maxY);


            var ret;
            if (this.onMove)
                ret = this.onMove({ left: left - this.layerOffset.left, top : top - this.layerOffset.top }, evt, this);

            if (ret === false)
                return false;

            if (this.layer.offsetParent != de) {
                var parentPos = $( this.layer.offsetParent ).offset();
            } else {
                var parentPos = {left: 0, top: 0};
            }

            if( this.isMove ){
                if (this.mode == 'H' || !this.mode){
                    var targetLeft = left - parentPos.left, prevLeft = parseInt( $(this.layer).css('left') );
                    if( ( this.direction.isLeft &&  targetLeft <= prevLeft ) ||
                        ( this.direction.isRight &&  targetLeft > prevLeft ) ){
                        this.layer.style.left = targetLeft + 'px';
                    }

                }

                if (this.mode == 'V' || !this.mode){
                    var targetTop = top - parentPos.top, prevTop = parseInt( $(this.layer).css('top') );
                    if( ( this.direction.isTop &&  targetTop <= prevTop ) ||
                        ( this.direction.isBottom &&  targetTop > prevTop ) ){
                        this.layer.style.top = targetTop + 'px';
                    }

                }
            }



        },
        stopDrag: function () {//停止拖动
            $(document).off('mousemove', this.mousemoveHandle );
            $(document).off('mouseup', this.mouseupHandle );
            $(window).off('blur', this.mouseupHandle );
            //$( this.layer ).removeClass( this.movingClassName );

            if (this.layer.releaseCapture) {//IE
                this.layer.releaseCapture(true);
            }
            if (this.onDrop)
                this.onDrop( this );
        },
        disable: function () {//禁用拖动
            this.stopDrag();
            $( this.handle ).off('mousedown', this.mousedownHandle );
        },
        enable: function () {//启用拖动
            var _this = this;
            this.mousedownHandle = function ( evt ) {
                _this.startDrag( evt );
            };
            $( this.handle ).on('mousedown', this.mousedownHandle );
        }
    };


    $.fn.DND = function( args ){
        this.each( function(){
            new DND( this, args);
        });
    };

})( jQuery );