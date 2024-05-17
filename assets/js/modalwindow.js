;(function() {
    document.addEventListener("DOMContentLoaded", function() {
        var body = window.myLib.body;
    
        body.addEventListener("click", function(e) {
            var target = e.target;
            var modalwindowClass = window.myLib.closestAttr(target, "data-modalwindow");
    
            if (modalwindowClass === null) {
                return;
            }
    
            e.preventDefault();
            var modalwindow = document.querySelector("." + modalwindowClass);
    
            if(modalwindow) {
                window.myLib.showModalwindow(modalwindow);
                window.myLib.toggleScroll();
            }
        });
    
        body.addEventListener("click", function(e) {
            var target = e.target;
    
            if (target.classList.contains("modalwindow-close") ||
                target.classList.contains("modalwindow__inner")) {
                var modalwindow = window.myLib.closestItemByClass(target, "modalwindow");
    
                window.myLib.closeModalwindow(modalwindow);
                window.myLib.toggleScroll();
            }
        });
    
        body.addEventListener("keydown", function(e) {
            if (e.keyCode !== 27) {
                return;
            }
    
            var modalwindow = document.querySelector(".modalwindow.is-active");
    
            if (modalwindow) {
                window.myLib.closeModalwindow(modalwindow);
                window.myLib.toggleScroll();
            }
        });
    });
})();