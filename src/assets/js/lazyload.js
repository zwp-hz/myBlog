'use strict'

/**
 * 懒加载
 */
var lazyload = function() {};

lazyload.prototype = {
    init: function() {
        var that = this;

        var forEach_envent = function() {
            var object = document.querySelectorAll('[data-url]'),
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop, // 滚动条距离顶部高度
                seeHeight = document.documentElement.clientHeight; // 可见区域高度

            // 解除绑定
            if (object.length <= 0) {
                window.removeEventListener("scroll", forEach_envent, false);
            }

            // 遍历需要懒加载的对象
            object.forEach(function(item) {
                var cur_offsetTop = item.offsetTop || item.offsetParent.offsetTop,
                    clientHeight = item.clientHeight || 0;

                if (cur_offsetTop < scrollTop + seeHeight + 30 && cur_offsetTop + clientHeight - 30 > scrollTop) {
                    var image_url = item.getAttribute('data-url');

                    item.removeAttribute('data-url');

                    that.imgLoad(image_url, function(e) {
                        if (e.type === 'error') {
                            item.style.cssText = '';
                            item.getElementsByTagName('i')[0].style.opacity = '1';
                        } else if (e.type === 'load') {
                            if (item.getAttribute('data_type') === 'img') {
                                item.getElementsByTagName('img')[0].src = image_url;
                            } else {
                                item.style.background = "url('" + image_url + "')";
                            }
                        }

                        item.className = "u_transition_300 progressive--is-loaded";
                    });
                }
            });
        }

        forEach_envent();
        window.addEventListener("scroll", forEach_envent, false);
    },
    imgLoad: function(url, callback) {
        var img = new Image();

        img.src = url
            // 加载成功
        img.onload = function(e) {
            callback(e);
        };

        // 加载失败
        img.onerror = function(e) {
            callback(e);
        }
    }
}