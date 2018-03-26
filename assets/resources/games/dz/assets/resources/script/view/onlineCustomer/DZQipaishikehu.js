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

var h = require('H').h;
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        allListScrollView: cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         self = this;
     },

    initKeHuList:function (kehuList) {
        var prefab = h.resManager.getPrefabByName("res/prefab/onlineCustomer/kehu_node"); //cc.qp.util.getPrefabByName("prefab/sheji/kehu_node");
            var cell = cc.instantiate(prefab);
            var cellSize = cell.getContentSize();
            var fightList = kehuList;
            var handler = function(funcName, list, index){
                switch(funcName){
                    case "count":
                        return fightList.length;
                    case "cellSize":
                        return cellSize;
                    case "cell":
                        var data = fightList[index] ;
                        var item = self.getItem(prefab, data);
                        return item;
                }
            }
            self.allListScrollView.getComponent("MyList").setHandler(handler);
            self.allListScrollView.getComponent("MyList").reloadData();
    },

    getItem:function (prefab,data) {
                var node = cc.instantiate(prefab);
                var head = cc.find('head',node);

                var name = cc.find('name',node).getComponent(cc.Label);
                name.string = data.nameDes;

                var userId = cc.find('ID',node).getComponent(cc.Label);
                userId.string = data.id;


                var state = cc.find('zhuangtai', node).getComponent(cc.Label);
                switch (data.state){
                    case DZConstant.kehuState.kehu_game:
                        state.string = '游戏中';
                        state.node.color = cc.color(6,125,8);
                        break;
                    case DZConstant.kehuState.kehu_free:
                        state.string = '空闲';
                        state.node.color = cc.color(43,97,151);
                        break;
                    case DZConstant.kehuState.kehu_outline:
                        state.string = '离线';
                        state.node.color = cc.color(53,57,61);
                        break;
                }


                return node;
    },

    // updateList: function () {
    //     AppFacade.getInstance(cc.qp.MVC_HALL).sendNotification(Constants.qiPaiShiKeHuState.qipaishikehu_update, this);
    // },
    start () {
        // this.updateList();
    },

    // update (dt) {},
});
