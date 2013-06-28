
goog.provide('huiyan.popup');
goog.require('jQuery');

(function ($) {

    $.fn.extend({

        overlay: function (ops, id) {
            var ops = $.extend({
                    position: 'fixed', top: 0, left: 0,
                    width: '100%', height: '100%',
                    opacity: 0.2, background: 'black', zIndex: 99
                }, ops),
                id = id || 'overlay';
            if ($.fn.ie6) ops = $.extend(ops, {
                position: 'absolute',
                width: Math.max($(window).width(), $(document.body).width()),
                height: Math.max($(window).height(), $(document.body).height()) });

            return $('<div class="overlay" id="' + id + '"/>').appendTo(document.body).css(ops);
        },

        position: function (ops) {
            var ops = $.extend({
                    fixx: 0,
                    fixy: 0
                }, ops),
                mod = (this.css("position") == "fixed") ? 0 : 1,
                t = $(document).scrollTop() * mod,
                l = $(document).scrollLeft() * mod,
                mt = t;

            l += ($(window).width() - this.width()) / 2;
            t += ($(window).height() - this.height()) / 2;

            l += ops.fixx;
            t = Math.max(t, mt) + ops.fixy;

            if (t < 0) t = 0;
            if (l < 0) l = 0;

            return this.css({top: t, left: l});
        },

        dragdrop: function (ops, callback) {
            if (typeof(ops) == 'function')callback = ops;
            this.css('position', 'absolute');
            var ops = $.extend({
                }, ops), handle = ops.handle ? $(ops.handle, this) : this,
                flag = false, _o = {left: 0, top: 0}, self = this;

            function pos(e) {
                if (flag) {
                    self.css({left: e.pageX - _o.left + 'px', top: e.pageY - _o.top + 'px'});
                }
            }

            handle.mousedown(function (e) {
                flag = true;
                self.css('z-index', parseInt(new Date().getTime() / 1000));
                var offset = self.offset();
                _o = { left: e.pageX - offset.left, top: e.pageY - offset.top };
                $(document).mousemove(pos);
            }).mouseup(function (e) {
                    pos(e);
                    flag = false;
                    $(document).unbind('mousemove');
                    if (callback)callback.apply(this, [self]);
                }).css('cursor', 'move');
            return self;
        },

        popup: function (ops, callback) {
            var ops = $.extend({
                    buttons: {}, esc: true, id: 'popup', iframe: false, scrolling: 'no',
                    overlay: { opacity: 0.2, background: 'black' },
                    text: '', title: 'Information', type: 1, width: 240, height: 0, zIndex: 1
                }, ops),
                self = this;

            function close() {
                $('#_overlay').add([document, window]).unbind('._overlay');
                $('#' + ops.id).add([document, window]).unbind('._darg');
                $('#_overlay').remove();
                if (select)select.ie6fix(false);
                $('#' + ops.id).fadeOut('fast', function () {
                    $(this).remove()
                });
            }

            var o = $('#' + ops.id);

            switch (ops.action) {
                case -1://resize
                    $('.content', o).animate(callback,function () {
                        o.ie6fix(false);
                    }).find('iframe').css(callback);
                    return;
                case 0://retitle
                    $('.title', o).text(ops.text);
                    return;
                case 1://first btn
                    $('.btnpane', o).children('a:nth-child(1)').trigger('click');
                    return;
                case 2://second btn
                    $('.btnpane', o).children('a:nth-child(2)').trigger('click');
                    return;
                case 9://close
                    $('.close', o).trigger('click', callback);
                    return;
                case 8:
                    callback.apply(this, arguments);
                    return;
                default:
                    (o.length == 1) && close();
            }

            var pHtm;
            if (ops.iframe) {
                pHtm = $('<iframe src="' + ops.url + '" marginwidth="0" id="popup_iframe" marginheight="0" frameborder="0" hspace="0" vspace="0" scrolling="' + ops.scrolling + '" />')
                    .css({ width: ops.width - 16, height: ops.height == 0 ? 'auto' : ops.height - 74 });
            } else {
                pHtm = $('<div>' + ops.text + '</div>');
            }

            var pContent = $('<div class="content content_' + ops.type + '"/>').append(pHtm)
                    .wrap('<div class="popup p' + ops.type + '"/>')
                    .wrap('<div class="container container_' + ops.type + '"/>'),

                pContainer = pContent.parent(),

                pClose = $('<div class="titleclose"/>')
                    .append('<span class="title">【' + ops.title + '】</span>')
                    .append('<a href="javascript:;" class="close"><span>X</span></a>')
                    .prependTo(pContainer),

                _p = ($.fn.ie6) ? 'absolute' : 'fixed';
            popup = pContainer.parent()
                .css({
                    position: _p, zIndex: 99 + ops.zIndex,
                    top: ops.iframe ? ($(window).height() - ops.height) / 2 - 60 : ($(window).height() - ops.height) / 2, left: ($(window).width() - ops.width) / 2, width: ops.width, height: ops.height == 0 ? 'auto' : ops.height, outline: 0
                })
                .attr({ id: ops.id, tabIndex: '-1' }).appendTo(document.body).hide()
                .keydown(function (ev) {
                    if (ops.esc) {
                        (ev.keyCode && ev.keyCode == 27 && close());
                    }
                })
                .dragdrop({handle: '.titleclose'}),

                btnPane = $('<div class="btnpane"/>').appendTo(pContainer);

            $('.close', pClose)
                .mousedown(function (ev) {
                    ev.stopPropagation();
                })
                .click(function (event, callback) {
                    if (callback) callback.apply(this, arguments);
                    close();
                    return false;
                });

            var hasBtns = false, genBtns = [];

            function newBtns(btns) {
                btnPane.empty().hide();
                $.each(btns, function () {
                    return !(hasBtns = true);
                });
                if (hasBtns) {
                    btnPane.show();
                    $.each(btns, function (name, fn) {
                        genBtns.push($('<a href="javascript:;"/>')
                            .text(name)
                            .appendTo(btnPane)
                            .bind('click', function () {
                                fn.apply(this, arguments);
                                return false;
                            }));
                    });
                }
            }

            newBtns(ops.buttons);

            if (ops.overlay) {
                var _overlay = $().overlay($.extend(ops.overlay, { position: _p }), '_overlay');
                if (ops.esc) {
                    $(document).bind('keydown._overlay', function (e) {
                        (e.keyCode && e.keyCode == 27 && close());
                    });
                }
            }
            popup.position(ops.iframe ? { fixy: -60 } : {}).show();
            var select = $('select').ie6fix(true);
            if (window.event) {
                event.returnValue = false;
            }
        },

        ie6fix: function (flag) {
            return ($.fn.ie6) ? this.css('visibility', flag ? 'hidden' : 'visible') : this;
        }
    });


})(jQuery);
