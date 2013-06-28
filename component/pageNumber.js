/**
 * @fileoverview 通用分页页码转换
 * @module PageNumber
 *
 */

goog.provide('huiyan.PageNumber');



(function () {


    /**
     * 通用分页页码转换
     * @class huiyan.pageChange
     * @param data 待处理页码
     * @param pageSize 一共有多少个页码
     * @constructor
     * @returns {object}
     *
     */

    huiyan.PageNumber = function (data, pageSize) {
        pageSize = pageSize || 7;
        var pages = {},
            pageLong = parseInt(pageSize / 2),
            pagesInRange = [],
            leftSize = pageLong,
            rightSize = pageLong, i = 1;
        if (!$.isEmptyObject(data)) {
            pages = {
                "total": data.pageCount,
                "itemCountPerPage": data.itemCountPerPage,
                "first": 1,
                "current": data.current,
                "last": data.pageCount,
                "previous": data.current - 1,
                "next": data.current + 1
            };
        }

        var pageNum = function (start, end, i) {
            for (i = start; i < end; i++) {
                pagesInRange.push(i);
            }
        };

        /**
         * 生成页码
         */
        if (pages.total > pageSize) {
            if (pages.current <= pageLong) {
                leftSize = pages.current - 1;
                rightSize = pageSize - leftSize - 1;
            } else if (pages.current + pageLong > pages.total) {
                rightSize = pages.total - pages.current;
                leftSize = pageSize - rightSize - 1;
            }
            pageNum(pages.current - leftSize, pages.current, i);
            pagesInRange.push(pages.current);
            pageNum(pages.current + 1, pages.current + rightSize + 1, i);

        } else {
            pageNum(1, pages.total + 1, i);
        }


        pages.pagesInRange = pagesInRange;

        return pages;

    };

})();