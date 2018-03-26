// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
import {DZConstant} from "../../common/DZConstant";

var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        allListScrollView: cc.ScrollView,
        nofriend:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         self = this;
         this.nofriend.active = false;
         this.yaoqingNode = [];
     },

    initOnlineFriendList:function (friendList) {
        this.yaoqingNode = [];
        var prefab = h.resManager.getPrefabByName("res/prefab/friend/zaixian_haoyou");
            var cell = cc.instantiate(prefab);
            var cellSize = cell.getContentSize();
            var fightList = friendList;
            var handler = function(funcName, list, index){
                switch(funcName){
                    case "count":
                        return fightList.length;
                    case "cellSize":
                        return cellSize;
                    case "cell":
                        var data = fightList[index] ;
                        var item = self.getItem(prefab, data,index);
                        return item;
                }
            }
            self.allListScrollView.getComponent("MyList").setHandler(handler);
            self.allListScrollView.getComponent("MyList").reloadData();
    },

    getItem:function (prefab,data,index) {
                var node = cc.instantiate(prefab);
                self.head = cc.find('head',node).getComponent(cc.Sprite);
               /* cc.loader.load(data.headUrl,function (err, texture) {
                    var frame=new cc.SpriteFrame(texture);
                    self.head.spriteFrame=frame;
                });*/
                var name = cc.find('head/name',node).getComponent(cc.Label);
                name.string = data.friend.nickname;

                var onlineState = cc.find('head/zhuangtai/zaixian',node);
                var outlineState = cc.find('head/zhuangtai/lixian',node);
                onlineState.active = false;
                outlineState.active = false;
                if(data.friend.status == 'online'){
                    onlineState.active = true;
                }else{
                    outlineState.active = true;
                }
                let yaoqing = cc.find('anniu/yaoqing',node);
                let yiyaoqing = cc.find('anniu/yiyaoqing',node);
                let yijieshou = cc.find('anniu/yijieshou',node);
                let youxizhong = cc.find('anniu/youxizhong',node);
                let timeDes = cc.find('anniu/yiyaoqing/text',node).getComponent(cc.Label);

                if(self.yaoqingNode[index] != null){
                    if(self.yaoqingNode[index].sendSucess){
                        self.yaoqingNode[index].yaoqing = yaoqing;
                        self.yaoqingNode[index].yiyaoqing = yiyaoqing;
                        self.yaoqingNode[index].yijieshou = yijieshou;
                        self.yaoqingNode[index].youxizhong = youxizhong;
                        self.yaoqingNode[index].yaoqing.active = false;
                        self.yaoqingNode[index].yiyaoqing.active = true;
                        self.yaoqingNode[index].yijieshou.active = false;
                        self.yaoqingNode[index].youxizhong.active = false;
                        self.yaoqingNode[index].label = timeDes;
                        self.yaoqingNode[index].label.string = self.yaoqingNode[index].time + 's';
                    }else{
                        self.yaoqingNode[index].yaoqing = yaoqing;
                        self.yaoqingNode[index].yiyaoqing = yiyaoqing;
                        self.yaoqingNode[index].yijieshou = yijieshou;
                        self.yaoqingNode[index].youxizhong = youxizhong;
                        self.yaoqingNode[index].yaoqing.active = true;
                        self.yaoqingNode[index].yiyaoqing.active = false;
                        self.yaoqingNode[index].yijieshou.active = false;
                        self.yaoqingNode[index].youxizhong.active = false;
                        self.yaoqingNode[index].label = timeDes;
                    }
                }else{
                    var yaoqingData = {};
                    yaoqingData.label = timeDes;
                    yaoqingData.yaoqing = yaoqing;
                    yaoqingData.yiyaoqing = yiyaoqing;
                    yaoqingData.yijieshou = yijieshou;
                    yaoqingData.youxizhong = youxizhong;
                    yaoqingData.yaoqing.active = false;
                    yaoqingData.yiyaoqing.active = false;
                    yaoqingData.yijieshou.active = false;
                    yaoqingData.youxizhong.active = false;
                    yaoqingData.index = index;
                    yaoqingData.time = 10;
                    yaoqingData.curTime = 0;
                    yaoqingData.sendSucess = false;
                    switch (data.hot){
                        case DZConstant.inviteFriendState.onRecive:
                            yaoqingData.yijieshou.active = true;
                            break;
                        case DZConstant.inviteFriendState.invite:
                            yaoqingData.yaoqing.active = true;
                            break;
                        case DZConstant.inviteFriendState.invited:
                            yaoqingData.yiyaoqing.active = true;
                            break;
                        case DZConstant.inviteFriendState.gaming:
                            yaoqingData.youxizhong.active = true;
                            break;
                    }
                    self.yaoqingNode.push(yaoqingData);
                }
        yaoqing.on(cc.Node.EventType.MOUSE_UP, function (event) {
            cc.log(' 邀请 ===================');
            self.yaoqingNode[index].yaoqing.active = false;
            self.yaoqingNode[index].yiyaoqing.active = true;
            self.yaoqingNode[index].sendSucess = true;
            self.updateTime(index);
        });

                return node;
    },
    start () {
    },

    update(dt) {
        for(let i = 0; i <self.yaoqingNode.length;i++ ){
            let yaonode = self.yaoqingNode[i];
            if (yaonode.sendSucess) {
                yaonode.curTime += dt;
                if (yaonode.curTime >= 1) {
                    yaonode.curTime = 0;
                    yaonode.time -= 1;
                    this.updateTime(i);
                    if (yaonode.time <= 0) {
                        yaonode.sendSucess = false;
                        yaonode.time = 10;
                        yaonode.yaoqing.active = true;
                        yaonode.yiyaoqing.active = false;
                        //yaonode.label.string = '已邀请';
                    }
                }
            }
        }

    },

    updateTime:function (index) {
        self.yaoqingNode[index].label.string = self.yaoqingNode[index].time + 's';
    },
});
