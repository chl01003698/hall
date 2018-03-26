var WaitingConnection = {
    _waitingView: null,           // prefab
    titleString: null,
    _titleLabel:    null,   // 标题
    _zhenZhao: null,//遮罩
    _loadImg: null,//除了遮罩之外的提示内容
};

/**
 * titleString :    标题
 * detailString :   内容 string 类型.
 * enterCallBack:   确定点击事件回调  function 类型.
 * neeCancel:       是否展示取消按钮 bool 类型 default YES.
 * duration:        动画速度 default = 0.3.
*/
WaitingConnection.show = function (titleString) {
    if(titleString == null || titleString == ''){
        titleString = "加载中,请稍后...";
    }
    // 引用
    var self = this;
    this.titleString = titleString;
    // 判断
    if (WaitingConnection._waitingView != undefined) return;
    // 
    // 加载 prefab 创建
    cc.loader.loadRes("prefab/common/WaitingConnection", cc.Prefab, function (error, prefab) {

        if (error) {
            cc.error(error);
            return;
        }

        // 实例 
        var waitingConnection = cc.instantiate(prefab);

        // Alert 持有
        WaitingConnection._waitingView = waitingConnection;

        WaitingConnection._titleLabel = cc.find("titleLabel", waitingConnection).getComponent(cc.Label);
        WaitingConnection._titleLabel.string = self.titleString;
        WaitingConnection._loadImg = cc.find('loading_image',waitingConnection);
        WaitingConnection._loadImg.runAction(cc.repeatForever(cc.rotateBy(0.1,10)));
        // 父视图
        WaitingConnection._waitingView.parent = cc.find("Canvas");
        //WaitingConnection._titleLabel.on(cc.,self.onButtonClicked, self);
        cc.find("btn", waitingConnection).on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log('click..colse');
            WaitingConnection.close();
        });
         
    });

     // 按钮点击事件
     self.onButtonClicked = function(event){
         cc.log('click..');
        WaitingConnection.close();
     }
};
//关闭
WaitingConnection.close = function(){
    // 引用
    WaitingConnection._loadImg.stopAllActions();
    //cc.eventManager.pauseTarget(WaitingConnection._waitingView, true);
   // WaitingConnection._waitingView.removeFromParent();

     // 
    //  self.onDestory = function () {
    //     WaitingConnection._waitingView.destroy();
    //     WaitingConnection._titleLabel = null;
    //     Alert._animSpeed = 0.1;
    // };

     // 销毁 alert (内存管理还没搞懂，暂且这样写吧~v~)
     //self.onDestory = function () {
        WaitingConnection._waitingView.destroy();
        //Alert._enterCallBack = null;
        WaitingConnection._waitingView = null;
        WaitingConnection._loadImg = null;
        WaitingConnection._titleLabel = null;
        WaitingConnection.titleString = null;
    //};
};
