var Constants = require('DZConstant').DZConstant;
var DZGameController = require('DZGameController').DZGameController;
var HallUtil = require('HallUtil').HallUtil;
cc.Class({
    extends: cc.Component,

    properties: {
       timeNum: cc.Label,
       paiLayout: cc.Node,      //放牌型的layout
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.timeNum.string = 60;
    },

    start () {

    },

    /**
     * 刷新数据
     * 
     * @param {any} data 
     */
    refreshView: function (data,btn,sendCard_restart) {
        this._addPokerPattern(data);
        this._refreshTime();
        this.buttonControl = btn;
        this.sendCard_restart = sendCard_restart;
    },


    /**
     * 给layout上添加牌型
     * 
     * @param {any} data 牌型数据
     */
    _addPokerPattern: function (data) {
        let self = this;
        
        for(let j = 0;j<data.length;j++) {
            let itemData = data[j].arr;
            let handType = data[j].handType;
            let prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/game/cardTypeSelectItem', cc.Prefab);
            let selectItem = cc.instantiate(prefab);
            let selectItemLayout = cc.find('layout',selectItem);
            this.paiLayout.addChild(selectItem);
            cc.log('selectItemLayout ' + selectItemLayout);
    
            for(let i= 0;i< itemData.length;i++) {
                let pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Itemhalf", cc.Prefab);
                let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
                cc.log('_addPokerPattern ' + itemData[i]);
                poker.initPaiMian(itemData[i]);
                poker.setPokerScale(0.7);
                selectItemLayout.addChild(poker.node);
            }
    
            selectItem.on('touchend',function() {
                cc.log('itemData ' + JSON.stringify(itemData));
                DZGameController.getInstance().sendCardData(itemData, handType,this.sendCard_restart);
                cc.log("删除。。cardtype。按钮 self.buttonControl=" + self.buttonControl);
                self.buttonControl.deleteAllBtn();
                self.closePanel();
            })
        }
    },

    /**
     * 刷新时间
     * 
     */
    _refreshTime: function () {
        this.timeNum.string = '60';
        let self = this;
        self.freshTimer = HallUtil.schedule(function(){
            this.updateTime();
        }.bind(this), this.node, 1.0,true);
    },

    onDestroy: function () {
        //this.node.stopAction(self.freshTimer);
    },

    updateTime: function () {
        this.timeNum.string -= 1;
        let self = this;
        if(this.timeNum.string <= 0) {
            this.node.stopAction(self.freshTimer);
        }
    },

    closePanel: function () {
        console.log("@@@选择牌型。。。closePanel");
        this.node.stopAllActions();
        this.node.destroy();
    }

    // update (dt) {},
});
