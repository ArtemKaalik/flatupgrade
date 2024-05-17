;(function() {
    window.myLib = {};

    window.myLib.body = document.body;

    window.myLib.closestAttr = function(item, attr) {
        var node = item;

        while (node) {
            var attrValue = node.getAttribute(attr);
            if (attrValue) {
                return attrValue;
            }

            node = node.parentElement;
        }

        return null;
    };

    window.myLib.closestItemByClass = function(item, className) {
        var node = item;

        while (node) {
            if (node.classList.contains(className)) {
                return node;
            }

            node = node.parentElement;
        }

        return null;
    };

    window.myLib.toggleScroll = function() {
        window.myLib.body.classList.toggle('no-scroll');
    };

    window.myLib.showModalwindow = function(target) {
        target.classList.add('is-active');
    };

    window.myLib.closeModalwindow = function(target) {
        target.classList.remove('is-active');
    };

})();