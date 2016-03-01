    _config = {
            agile: {    
                allTime: 50,
                addTime: 0
            }
    };

// Game对象
!function() { 
    var box = $("#room #box"),
        dotted2 = $("#box .lv2 .dotted"),
        board2 = $("#box .lv2 .board"),
        stop = $("#box .stop"),
        
        lv1 = $("#room #box .lv1"),
        lv2 = $("#room #box .lv2"),
        lv3 = $("#room #box .lv3"),
        lv4 = $("#room #box .lv4"),
        tips = $("#box .tips"),

        b = {
                lv: $("#room .lv em"),              //当前分数(每过一关加一分)/关卡数
                time: $("#room .time"),             //当前剩余时间
                start: $("#dialog .btn-restart"),   //重新开始
                room: $("#room"),                   //游戏界面
                dialog: $("#dialog"),               //游戏对话框(结束)  
                d_gameover: $("#dialog .gameover"),  //游戏对话框结束界面
        }, 

        //游戏对象
        c = {   
            score: 0,
            count: 0, //记录连续perfect的个数
            lvx:0 ,  //关卡数

            //游戏初始化
            init: function(type, room) {  
                this.type = type;
                this.api = API[type];
                this.config = _config[type];
                this.reset();
                this.room = room; 
                this.renderUI();
                this.inited || this.initEvent();
                this.inited = true;
                this.start();
            },

            // 重置游戏
            reset: function() {
                this.time = this.config.allTime;
                this.lvx = 0;
                this.score = 0;
                b.lv.text(0);
                b.time.html(0);
            },

            //渲染游戏的主界面框架(舞台)
            renderUI: function() {
                var isLandscape = (90 == window.orientation) || (-90 == window.orientation);
                var width = isLandscape ? window.innerHeight : window.innerWidth;
                var height = isLandscape ? window.innerWidth : window.innerHeight;

                width = Math.min(width, 500);
                box.width(width);
                box.height(height);
                this.room.show();
            },

            //绑定事件
            initEvent: function() {
                var eventName = "ontouchstart" in document.documentElement ? "touchend" : "click", 
                    myGame = this;
                $(window).resize(function() {
                    myGame.renderUI();
                });

                b.start.on(eventName, function() {
                    location.reload();
                });
            },

            //开始游戏
            start: function() {
                this.time > 5 && b.time.removeClass("danger");
                tips.html("");
                b.dialog.hide();

                this.lvx++;
                this.timer ||
                    (this.timer = setInterval(_.bind(this.tick, this), 1000));
                this.renderMap();
            },

            //实现一个游戏主循环
            tick: function() {
                this.time--;   
                this.time < 6 && b.time.addClass("danger");   
                if(this.time < 0){
                    this.gameOver();
                }
                else{
                    b.time.text(parseInt(this.time));
                }
            },

            // 渲染游戏关卡地图
            renderMap: function() {
                this.api.render(this.lvx);                  
            },

            //绘制游戏相关信息(分数)
            renderInfo: function(e) {
                var p = 5,
                    g = 3;

                if (e == 3){
                    this.count = 0;
                    this.score  += g ;
                } 
                else if (e == 5){
                    this.count ++;
                    this.score += p +(this.count - 1) * 2;
                }      
                else if ((e != 3)  && (e != 5)){
                    this.score += e;
                }    
                b.lv.text(this.score);
            },

            //游戏结束界面
            gameOver: function() {

                var d = this.api.getGameOverText(this.score);//获取游戏结束时的语句对象
                this.lastScore = this.score; //游戏得分
                this.lastGameTxt = d.txtscoreShow;    //游戏提示语
                this.lastComment = d.txtcomment;/*yy将得分与评语分开*/
                this.room.hide();
                b.d_gameover.show().find("#scoreShow").html(this.lastGameTxt);/*yy显示分数*/
                b.d_gameover.show().find("#comment").html(this.lastComment);/*yy显示评语*/

                box.find(".hide").fadeOut(1500, function() {
                    b.dialog.show();
                });
            },
            //进入下一关
            nextLv: function() {
                this.start();
            }
        };
        window.Game = c;
}();