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
import {DZAlert} from "../common/DZAlert";
var h = require('H').h;
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        allListScrollView: cc.ScrollView,
        lookScrollView:cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         self = this;
     },

    initChatCommonList: function (commonList) {
        self = this;
        var prefab = h.resManager.getPrefabByName("res/prefab/chatCommon/liaotian_node");
        var cell = cc.instantiate(prefab);
        var cellSize = cell.getContentSize();
        var fightList = commonList;
        var handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return fightList.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    var data = fightList[index];
                    var item = self.getItem(prefab, data);
                    return item;
            }
        }
        self.allListScrollView.getComponent("MyList").setHandler(handler);
        self.allListScrollView.getComponent("MyList").reloadData();
    },

    getItem: function (prefab, data) {
        var node = cc.instantiate(prefab);

        var speek = cc.find('text', node).getComponent(cc.Label);
        speek.string = data.speek;

        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!DZConstant.playSpeekNode.speekNode){
                DZConstant.playSpeekNode.speekNode = true;
                self.sendChatCommon(data);
            }else{
                // let btnString = ['确定'];
                // let callBack = [this.ok];
                // cc.qp.alert.show('提示',"请不要频繁发送",btnString,callBack);
                DZAlert.show('请不要频繁发送');
            }


        });
        return node;
    },
    initChatLookList:function (lookList) {
         this.lookContent = this.lookScrollView.content;
        this.lookContent.removeAllChildren();
        var prefab = h.resManager.getPrefabByName("res/prefab/chatCommon/ChatLook");
        for (var i = 0; i < lookList.length; i++) {
            var node = cc.instantiate(prefab);
            var sprite = node.getComponent(cc.Sprite)
            var atlas = h.resManager.getAtlasByName(lookList[i].atlas);// cc.loader.getRes(lookList[i].atlas, cc.SpriteAtlas);
            var frame = atlas.getSpriteFrame(lookList[i].lookName + '_00');
            sprite.spriteFrame = frame;
            self.lookContent.addChild(node);
            node.index =i;
            node.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.sendLookData(lookList[this.index]);
            });
        }
    },


    // updateList: function () {
    //     AppFacade.getInstance(cc.qp.MVC_HALL).sendNotification(Constants.chatCommonState.chatCommon_update, this);
    // },
    start () {
        // this.updateList();
    },

    // update (dt) {},
});
