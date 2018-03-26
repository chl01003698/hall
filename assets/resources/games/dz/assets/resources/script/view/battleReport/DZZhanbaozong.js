// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {HallUIUtil} from "../../../../../../../script/util/HallUIUtil";

var h = require('H').h;
var DZGameModel = require('DZGameModel').DZGameModel;
var DZBattleReportModel = require('DZBattleReportModel').DZBattleReportModel;
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        allListScrollView: cc.ScrollView,
        nameListNode:cc.Node,
        iconListNode:cc.Node,
        nameNode:cc.Node,
        noData:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         self = this;
     },

    initNameList: function (nameList) {
        this.nameListNode.removeAllChildren(true);
        for (var i = 0; i < nameList.length; i++) {
            //名字
            var name = cc.instantiate(this.nameNode);
            name.active = true;
            var nameLabel =cc.find('name',name).getComponent(cc.Label);
            if(DZBattleReportModel.getInstance().FN_GetShowAll()){
                nameLabel.string =DZGameModel.getInstance().getUserNickName(nameList[i].uid);
            }else{
                if(DZBattleReportModel.getInstance().FN_GetIsGaming()){
                    nameLabel.string =DZGameModel.getInstance().getUserNickName(nameList[i].uid);
                }else{
                    nameLabel.string = nameList[i].user.nickname;
                }
            }
            this.nameListNode.addChild(name);
        }
    },

    initPlayerList:function (palyerList) {
        self = this;
        this.iconListNode.removeAllChildren(true);
        var _prefab = '';
        if(palyerList.length > 3){
            _prefab = 'res/prefab/battleReport/zhanbao_zong_node_duo';
        }else{
            _prefab = 'res/prefab/battleReport/zhanbao_zong_node_shao';
        }
        var score = [];
        for (var i = 0; i < palyerList.length; i++) {
            score.push(palyerList[i].score);
        }
        if(score.length > 0){
            score.sort(function(a,b){
                return b - a;
            }) ;
        }
        var prefab = h.resManager.getPrefabByName(_prefab);
            for (var i = 0; i < palyerList.length; i++) {
                var player = cc.instantiate(prefab);
                var dayingjia = cc.find('jiaobiao/dayingjia',player);
                var fuka = cc.find('jiaobiao/fuka',player);
                var fendi = cc.find('di/fendi',player);
                var landi = cc.find('di/landi',player);
                var name = cc.find('text/name',player).getComponent(cc.Label);
                var scroe = cc.find('text/zongfen/fen',player).getComponent(cc.Label);
                var win = cc.find('text/shengjv/sheng',player).getComponent(cc.Label);
                var m_head = cc.find('head',player);
                if(DZBattleReportModel.getInstance().FN_GetShowAll()){
                    name.string = DZGameModel.getInstance().getUserNickName(palyerList[i].uid);
                }else{
                    if(DZBattleReportModel.getInstance().FN_GetIsGaming()){
                        name.string =DZGameModel.getInstance().getUserNickName(palyerList[i].uid);
                    }else{
                        name.string = palyerList[i].user.nickname;
                        HallUIUtil.urlSprite(palyerList[i].user.headimgurl, m_head)
                    }
                }
                scroe.string = "" + palyerList[i].score;
                if(palyerList[i].score >= 0){
                    scroe.node.color = new cc.color(255, 246, 0);
                }else{
                    scroe.node.color = new cc.color(233, 9, 9);
                }
                win.string =  "" + palyerList[i].winCount;
                if(palyerList[i].score == score[0]){
                    dayingjia.active = true;
                    fendi.active = true;
                    landi.active = false;
                }else{
                    dayingjia.active = false;
                    fendi.active = false;
                    landi.active = true;
                }

                 if(self.isContainsKey(DZBattleReportModel.getInstance().FN_GetPayUid(),palyerList[i].uid || palyerList[i]._id)){
                        fuka.active = true;
                    }else{
                        fuka.active = false;
                    }
                self.iconListNode.addChild(player);
            }
    },

    isContainsKey:function (list,uid) {
        for(let j = 0; j < list.length;j++) {
            if (uid == list[j]) {
                return true;
            }
        }
        return false;
    },

    initZhanBaoList: function (zhanbaoList) {
        self = this;
        var prefab = h.resManager.getPrefabByName("res/prefab/battleReport/zhanbao_zong_node_neirong");
        var cell = cc.instantiate(prefab);
        var cellSize = cell.getContentSize();
        var fightList = zhanbaoList;
        var handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return fightList.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    var data = fightList[index];
                    var item = self.getItem(prefab, data,index);
                    return item;
            }
        }
        self.allListScrollView.getComponent("MyList").setHandler(handler);
        self.allListScrollView.getComponent("MyList").reloadData();
    },

    getItem: function (prefab, data,index) {
        var node = cc.instantiate(prefab);
        var prefabTemp = h.resManager.getPrefabByName("res/prefab/battleReport/zhanbao_zong_fen");
        var jv = cc.find('text/jv', node).getComponent(cc.Label);
        jv.string ='第'+ (index + 1) + "局";
        var scorelist = cc.find('text/scorelist',node);
        var curData = data.players;
        // if(DZBattleReportModel.getInstance().FN_GetShowAll()){
        //     curData = data;
        // }else{
        //     curData = data.players;
        // }
            for (let i = 0; i <curData.length; i++) {
                var scoreItem = cc.instantiate(prefabTemp);
                var fen = cc.find('fen', scoreItem).getComponent(cc.Label);
                var object = curData[i];
                fen.string = '' + object.win;
                if(object.win >= 0){
                    fen.node.color = new cc.color(23, 150, 2);
                }else{
                    fen.node.color = new cc.color(233, 9, 9);
                }
                var dizhu = cc.find('dizhu', scoreItem);
                var fengding = cc.find('fengding', scoreItem);
                if (object.type == 'landlord') {
                    dizhu.active = true;
                } else {
                    dizhu.active = false;
                }
                if (object.isFenDing) {
                    fengding.active = true;
                } else {
                    fengding.active = false;
                }
                scorelist.addChild(scoreItem);
            }
        node.on(cc.Node.EventType.TOUCH_END,function (event) {
            self.jumpReport((index + 1));
        });
        return node;
    },

    // updateList: function () {
    //     AppFacade.getInstance(cc.qp.MVC_HALL).sendNotification(Constants.zhanBaoZongState.zhanbaozong_update, this);
    // },
    start () {
        // this.updateList();
    },

    // update (dt) {},
});
