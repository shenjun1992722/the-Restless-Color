!function() {
        // 准备阶段
    var b = {
            index: $("#index"),     //初始界面
            room: $("#room"),       //游戏界面
            dialog: $("#dialog"),   //游戏对话框
            play: $(".btn-play"),   //play开始游戏按钮
        }, 

        ua = window.navigator.userAgent.toLowerCase(), 
        isAndroid = /android/i.test(ua), 
        isIOS = /iphone|ipad|ipod/i.test(ua), 

        // 初始化阶段
        app = {
            init: function() {
                this.initEvent();
                b.index.show();
            },
            initEvent: function() { 
                var clickEvent = "ontouchstart" in document.documentElement ? "touchstart" : "click", 
                myApp = this;
                b.play.on(clickEvent, function() {  
                    var type = $(this).data("type") ||"agile";
                    b.index.hide(),     //主页隐藏
                    Game.init(type, b.room);
                });
            }                       
        };

    app.init();
    window.API = {}
}();