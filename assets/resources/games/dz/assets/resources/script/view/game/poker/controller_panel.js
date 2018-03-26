

/**
 * 牌的管理层
 */
var statusConst = require('DZConstant').DZConstant;
var CardRule = require('CardRule');
var self = null;
var DZGameUtil = require('DZGameUtil').DZGameUtil;
var controlButton = require('control_button');
var h = require('H').h;
var HallUtil = require('HallUtil').HallUtil;

//var  DZPlaySound =  require( '../sound/DZPlaySound');
import { DZPlaySound } from '../sound/DZPlaySound';


cc.Class({
    extends: cc.Component,

    properties: {
        touchNode: cc.Node,     //触摸层
        BottompokersView: cc.Node,  //自已所有牌的View

        bottomDiscardPanel: cc.Node,        //自已的弃牌区
        leftDiscardPanel: cc.Node,      //左边的弃牌区
        rightDiscardPanel: cc.Node,     //右边的弃牌区
        upDiscardPanel: cc.Node,        //上边的弃牌区

        budgetBottomPanel: [cc.Node],         //结算下面
        budgetLeftPanel: [cc.Node],
        budgetRightPanel: [cc.Node],
        budgeUpPanel: [cc.Node],

        blockNode: cc.Node, //阻挡触摸层
        laiziNode: cc.Node,

        sendCardNode : cc.Node,//发牌动画起点
        tempCardNode : cc.Node,
        playersNode  : [cc.Node], //二人、三人人物头像
        playersNode4  : [cc.Node], //4结点

        animationPos: [cc.Node],    //播动画的点
        cardAnimationView: cc.Node, //动画区
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sendCardNode.active = false;
        console.log("###controller_panel--onLoad,DZGameUtil.playType=" + DZGameUtil.playType) ;
        if (DZGameUtil.playType == statusConst.playType.ddz4) {
            //打出的牌区域
            this.bottomDiscardPanel.x = 0;
            this.bottomDiscardPanel.y = -103;

            this.rightDiscardPanel.x = 459;
            this.rightDiscardPanel.y = 10;

            this.leftDiscardPanel.x = -461;
            this.leftDiscardPanel.y = 114;

            this.upDiscardPanel.x = 0;
            this.upDiscardPanel.y = 222;
            //单局结算时没打完的牌亮牌区，分3行
            this.budgetRightPanel[0].x = 300;
            this.budgetRightPanel[0].y = 44;
            this.budgetRightPanel[1].x = 300;
            this.budgetRightPanel[1].y = 7;
            this.budgetRightPanel[2].x = 300;
            this.budgetRightPanel[2].y = -29;

            this.budgetLeftPanel[0].x = -300;
            this.budgetLeftPanel[0].y = 47;
            this.budgetLeftPanel[1].x = -300;
            this.budgetLeftPanel[1].y = 15;
            this.budgetLeftPanel[2].x = -300;
            this.budgetLeftPanel[2].y = -16;
        }
    },

    start() {

    },

    initView: function (pokerArray, callback, gameView,isReconnect) {
        self = this;
        this.slotPosXArray = [];
        this.pokersArray = [];  //手中的牌
        this.useredPosX = [];     //上面放了牌的位置 
        this.pokerSort = statusConst.pokerSort;
        this.isLastCard = false;
        this.liftPokerArray = [];
        this.liftArray = [];
        this.gameView = gameView;
        this.isCardRunning  = false;
        this.callbcak = null;


        this._confirmSendCardTime(true);
        this._initByPlayerNum();
        //this.produceSlot(21);
        this.showDealAction(pokerArray, isReconnect, callback);

    },

    /**
     * 确定发牌时间 ,是否明牌，几人玩法了都会影响
     */

    _confirmSendCardTime: function (isMingCard) {
        if (isMingCard) {  //是否是明牌，现在还没有字段
            this.sendCardTime = 0.1;    //发牌的时间
        } else {
            this.sendCardTime = 0.07;    //发牌的时间
        }
    },

    _initByPlayerNum: function () {
        cc.log('_initByPlayerNum' + DZGameUtil.playType);
        if (DZGameUtil.playType == statusConst.playType.ddz4) {
            this.pokerOffeset = statusConst.pokerOffset.ddz4People;
        } else {
            this.pokerOffeset = statusConst.pokerOffset.ddz3People;
        }
    },

    onEnable: function () {
        this.touchNode.on('touchstart', this._touchStart, this);
        this.touchNode.on('touchmove', this._touchMove, this);
        this.touchNode.on('touchend', this._touchEnd, this);
        this.touchNode.on('touchcancel', this._touchCancel, this);
    },

    onDisable: function () {
        this.touchNode.off('touchstart', this._touchStart, this);
        this.touchNode.off('touchmove', this._touchMove, this);
        this.touchNode.off('touchend', this._touchEnd, this);
        this.touchNode.off('touchcancel', this._touchCancel, this);
    },


    setTouchNodeEnable: function (enable) {
        this.blockNode.active = enable;
        //this.blockNode.active = false;
    },

    /**
     * 清理弃牌区
     */

    cleaDiscard: function (seatId) {
        let discardPanelArray = [this.bottomDiscardPanel, this.rightDiscardPanel, this.leftDiscardPanel, this.upDiscardPanel];
        cc.log('cleaDiscard' + seatId);
        discardPanelArray[seatId].removeAllChildren();
    },

    /**
     * 清理所有的弃牌区
     */

    clearAllDiscard: function () {
        this.bottomDiscardPanel.removeAllChildren();
        this.leftDiscardPanel.removeAllChildren();
        this.rightDiscardPanel.removeAllChildren();
        this.upDiscardPanel.removeAllChildren();
    },

    clearMySelfDiscard: function(){
        this.bottomDiscardPanel.removeAllChildren();
    },

    clearAllDiscardExSelf: function () {
        //this.bottomDiscardPanel.removeAllChildren();
        this.leftDiscardPanel.removeAllChildren();
        this.rightDiscardPanel.removeAllChildren();
        this.upDiscardPanel.removeAllChildren();
    },

    getAnimationPostion: function (seatId) {
        return this.animationPos[seatId].getPosition();
    },


    /**
     * 结算时把手里剩下的牌显示出来
     */

    showRestPokers: function (seatId, pokers, isWinner) {
        switch (seatId) {
            case statusConst.seatId.bottomSeat:
                //自已时候啥也不用做，如果要做啥在这块处理
                if(isWinner) {
                    this._addPokerToBudget(this.budgetBottomPanel,pokers);
                }

                break;
            case statusConst.seatId.rightSeat:
                this._addPokerToBudget(this.budgetRightPanel, pokers);
                break;
            case statusConst.seatId.leftSeat:
                this._addPokerToBudget(this.budgetLeftPanel, pokers);
                break;
            case statusConst.seatId.upSeat:
                this._addPokerToBudget(this.budgeUpPanel, pokers);
                break;
        }
    },


    /**
     * 清空结算显示手中的牌
     */

    clearAllBudgetPanel: function () {
        for (let i = 0; i <= 2; i++) {
            this.budgetRightPanel[i].removeAllChildren();
            this.budgetLeftPanel[i].removeAllChildren();
            this.budgeUpPanel[i].removeAllChildren();
            if( this.budgetBottomPanel[i] ){
                this.budgetBottomPanel[i].removeAllChildren();
            }
        }
    },


     /**
      * 把扑克加上结算显示上
      */
     _addPokerToBudget: function (panel, pokers) {
        pokers = DZGameUtil.sortPoker(pokers);
        var perPokers = 11; //每行多少张牌
        for (let i = 0; i < pokers.length; i++) {
            let pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Item", cc.Prefab);
            let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
            poker.initPaiMian(pokers[i]);
            poker.setPokerScale(statusConst.scaleType.budgetScalePoker);
            cc.log('Math.floor(i/perPokers)' + Math.floor(i / perPokers));
            panel[Math.floor(i / perPokers)].addChild(poker.node);
        }
    },

    /**
     * 根据提示的数组能弹起相应的牌
     * 提示这块用到
     */
    liftPokers: function (tipPokers) {
        if (tipPokers.length == 0) {
            return;
        }
        for (let i = 0; i < this.pokersArray.length; i++) {
            let item = this.pokersArray[i];
            let index = tipPokers.indexOf(item.getPokerNum());
            if (index >= 0) {
                item.updatePokerUplift(true);
                tipPokers.splice(index, 1);
            } else {
                item.updatePokerUplift(false);
            }
        }
    },



    /**
      * 根据弹起的牌能导出要打的牌的数组(牌上的数)
      * 出牌时要能拿到抬起的牌的数组
      */
    getLiftPokers: function () {
        this.liftArray = [];
        this.liftPokerArray = [];

        for (let i = 0; i < this.pokersArray.length; i++) {
            let item = this.pokersArray[i];

            if (item.getIsOffect()) {
                this.liftArray.push(item.getPokerNum());

                this.liftPokerArray.push(item);
            }
        }

        if (this.liftArray.length == this.pokersArray.length) {
            this.isLastCard = true;
        } else {
            this.isLastCard = false;
        }
        return this.liftArray;
    },

    //判断是不是最后一手牌打完之后
    judgetLast: function () {
        return this.isLastCard;
    },

    /**
     * 所有扑克牌都下去并取消黑色
     * 很多时候要用到
     */
    setAllPokersDown: function () {
        var isHavePokerUp = false;
        for (let i = 0; i < this.pokersArray.length; i++) {
            let item = this.pokersArray[i];
            item.setMaskActive(false);

            if( !isHavePokerUp ){
                //避免精度问题
                isHavePokerUp = (item.node.y > 0.5);
            }

            item.updatePokerUplift(false);
        }

        if( isHavePokerUp ){
            DZPlaySound.getInstance().playChoosePoker();
        }

    },

    /**
     * 打出去牌之后手中的牌
     * @warn : 打出去什么牌，必须以服务器返回数据为准，不能根据自己手牌高度来区分 新的函数deletPutCards
     * will be deleted
     */
    reSortPokers: function () {
        var newArray = [];
        for (let i = 0; i < this.pokersArray.length; i++) {
            let item = this.pokersArray[i];
            if (!item.getIsOffect()) {
                newArray.push(item);
            } else {
                item.node.runAction(cc.sequence(
                    cc.moveBy(0.15, cc.p(0, 50)),
                    cc.callFunc(function () {
                        cc.removeSelf();
                    })
                ))
                item.node.runAction(cc.fadeOut(0.12));
            }
        }
        this.pokersArray = newArray;
        for (let i = 0; i < this.pokersArray.length; i++) {
            let item = this.pokersArray[i];
            cc.log('getDiscardPokers' + item.getPokerNum());
        }
    },

    /*
     * @param 清理打出去的手牌
     */
   deletPutCards : function( putCards ){

       for ( let i = 0; i < this.pokersArray.length; ) {
           var item = this.pokersArray[ i ];
           var num  = item.getPokerNum( );
            if( putCards.indexOf( num ) > -1 ){
                this.pokersArray.splice( i, 1 );
                item.node.runAction(cc.sequence(
                    cc.moveBy(0.15, cc.p(0, 50)),
                    cc.callFunc(function () {
                        cc.removeSelf();
                    })
                ))
                item.node.runAction(cc.fadeOut(0.12));
            }else{
                ++i;
            }


       }

   },

    /**
     * 把牌打到弃牌区
     */

    discaridPokers: function (seatId, pokersArray) {
        switch (seatId) {
            case statusConst.seatId.bottomSeat:
                //this.reSortPokers();
                this.deletPutCards( pokersArray );
                this.produceSlotAndSort(this.pokersArray.length);
                cc.log('produceSlotAndSort' + JSON.stringify(this.slotPosXArray));
                for (let i = 0; i < this.pokersArray.length; i++) {
                    let item = this.pokersArray[i];
                    item.node.runAction(cc.moveTo(0.1, cc.p(this.slotPosXArray[i], 0)));
                }
                break;
            case statusConst.seatId.rightSeat:

                break;
            case statusConst.seatId.leftSeat:

                break;
            case statusConst.seatId.upSeat:

                break;
        }
    },


    /**
  * 加三张牌到自己手牌中
  * 抢到地主
  * 这块其实加几张牌都行，函数名字起的不太好，但估计也只有加三张时能用到
  */

    addThreePokers: function (pokers, callback) {
        for (let i = 0; i < pokers.length; i++) {
            cc.log('addThreePokers' + pokers[i]);
            let pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Item", cc.Prefab);
            let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
            poker.initPaiMian(pokers[i]);
            this.pokersArray.push(poker);
            poker.setScorecard(true);
        }
        cc.log('addThreePokers...............' + this.pokersArray.length);
        this.produceSlotAndSort(this.pokersArray.length);
        this.sortPokers();
        //this.BottompokersView.removeAllChildren();
        for (var i = 0; i < this.pokersArray.length; i++) {
            let item = this.pokersArray[i];
            if (item.getScorecard()) {
                item.node.setPosition(this.slotPosXArray[i], 30);
                this.BottompokersView.addChild(item.node, this.slotPosXArray[i]);
                item.node.runAction(cc.moveTo(0.3, cc.p(this.slotPosXArray[i], 0)))
            } else {
                item.node.runAction(cc.moveTo(0.1, cc.p(this.slotPosXArray[i], 0)));
                item.node.zIndex = this.slotPosXArray[i];
            }
        }
        self = this;
        HallUtil.schedule(function () {
            callback();
        }.bind(this), this.node, 0.35);
    },

    /**
     * 在弃牌区显示相应打出去的牌
     */

    showDiscardPanel: function (willPlayPokers, seatId) {
        cc.log('seatId' + seatId);
        let isLandlord = (seatId == DZGameUtil.landlordSeatId);
        switch (seatId) {
            case statusConst.seatId.bottomSeat:
                this.bottomDiscardPanel.removeAllChildren();
                this.addPokerToDiscardPanel(this.bottomDiscardPanel, willPlayPokers, isLandlord);
                break;
            case statusConst.seatId.rightSeat:
                this.rightDiscardPanel.removeAllChildren();
                this.addPokerToDiscardPanel(this.rightDiscardPanel, willPlayPokers, isLandlord);
                //right
                break;
            case statusConst.seatId.leftSeat:
                this.leftDiscardPanel.removeAllChildren();
                this.addPokerToDiscardPanel(this.leftDiscardPanel, willPlayPokers, isLandlord);
                break;
            case statusConst.seatId.upSeat:
                this.upDiscardPanel.removeAllChildren();
                this.addPokerToDiscardPanel(this.upDiscardPanel, willPlayPokers, isLandlord);
                break;
        }
    },

    /**
     * 把牌加到弃牌区上
     * 如果是地主，最后一张牌显示地主标志
     */
    addPokerToDiscardPanel: function (panel, willPlayPokers, isLandlord) {
        cc.log('addPokerToDiscardPanel111');
        if (willPlayPokers.length == 0) {
            //不出 行牌提示图片
            let giveUpprefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/game/stateImage", cc.Prefab);
            let giveUp = cc.instantiate(giveUpprefab);
            if(panel == this.bottomDiscardPanel){
                giveUp.scale = 0.6;
            }else{
                giveUp.scale = 0.6;
            }
            panel.addChild(giveUp);
        } else {
            for (let i = 0; i < willPlayPokers.length; i++) {
                cc.log('addPokerToDiscardPanel');
                let pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Item", cc.Prefab);
                let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
                poker.initPaiMian(willPlayPokers[i]);
                if (DZGameUtil.playType == statusConst.playType.ddz4) {
                    poker.setPokerScale(statusConst.scaleType.four_discardPoker);
                }else{
                    poker.setPokerScale(statusConst.scaleType.discardPoker);
                }

                panel.addChild(poker.node);

                if (isLandlord && i == willPlayPokers.length - 1) {
                    poker.showlandlordState(true);
                }
            }
        }
    },

    /**
        * 
        * 显示行牌提示图片
        * @param {any} seatId 位置id
        * @param {any} type 类型
        */
    showImageByStates: function (seatId, type) {
        if(type == "lookCards"){
            return;
        }
        this.clearAllDiscard();
        let discardPanelArray = [this.bottomDiscardPanel, this.rightDiscardPanel, this.leftDiscardPanel, this.upDiscardPanel];
        let giveUpprefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/game/stateImage", cc.Prefab);
        let giveUp = cc.instantiate(giveUpprefab);
        if(seatId == 0){
            giveUp.scale = 0.6;
        }else{
            giveUp.scale = 0.6;
        }
        discardPanelArray[seatId].addChild(giveUp);
        let image = giveUp.getComponent(cc.Sprite);
        let paiPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/youxizhong", cc.SpriteAtlas);
        image.spriteFrame = paiPlist.getSpriteFrame(statusConst.image[type + ""]);
    },

    /*
     * 获得每次发牌数量
     */
    getSendNumArray : function(){
        var array = [ 6,6,5];
        if( DZGameUtil.playType == statusConst.playType.ddz4 ){
            array = [8,8,9];
        }

        if(DZGameUtil.sendCards == 2  ){
            array = [ 8,9 ];
            if( DZGameUtil.playType == statusConst.playType.ddz4 ){
                array = [ 12,13 ];
            }
        }

        //闪电玩法
        if( DZGameUtil.playType == statusConst.playType.lightning3 ){
            array = [ 4,4,5 ];
            if( DZGameUtil.sendCards == 2 ){
                array = [6,7];
            }
        }

        return array;

    },

    /*
     * 玩家数量
     */
    getPLayerCount : function(){
        var count = 3;
        if( DZGameUtil.playType == statusConst.playType.ddz4 ){
            count = 4
        }else if(DZGameUtil.playType == statusConst.playType.ddz2){
            count = 2;
        }
        return count ;
    },

    getPlayersArray : function(){
        if( DZGameUtil.playType == statusConst.playType.ddz4 ){
            return this.playersNode4;
        }
        return this.playersNode;
    },

    runPokerAction : function( node,times ){
        if( times >= DZGameUtil.sendCards[0] ) {
            this._updatePokers( );
            this.sendCardNode.removeAllChildren();
            this.tempCardNode.removeAllChildren();
            return;
        }

        this._changgeBeishu( times );

        var playersNum      = this.getPLayerCount();
        var sendNumArray    = this.getSendNumArray();
        for( var i = 0 ; i < playersNum; ++i ){
            var nodeArray = [];
            var posArray  = [];
            var callback  = null;
            var scale     = 1;
            for( var j = 0; j < sendNumArray[times]; ++j ){
                var tempNode    = cc.instantiate( this.sendCardNode );
                this.tempCardNode.addChild( tempNode ) ;
                tempNode.setPosition( this.sendCardNode.getPosition() );
                tempNode.active = true;
                nodeArray.push( tempNode );
                if( 0 == i ){
                    var fPos = this.getFirstCardPos( times );
                    var pos      = this.BottompokersView.convertToWorldSpaceAR( cc.p(this.useredPosX[ fPos + j],0) );
                    var transPos = this.tempCardNode.convertToNodeSpace( pos );
                    posArray.push( transPos );
                    callback = "showPoker";
                }else{
                    var players = this.getPlayersArray();
                    var a = players[i].getChildren();
                    var shoupai = cc.find("shoupai", a[0]);
                    var tuNode  = cc.find("shoupai/tu",a[0]);
                    var pos     = shoupai.convertToWorldSpace(tuNode.getPosition());
                    var transPos = this.tempCardNode.convertToNodeSpace( pos );
                    scale = tuNode.getContentSize().height / this.sendCardNode.getContentSize().height;

                    posArray.push( transPos );
                }
            }

            this.pokerAction( null,{nodeArray: nodeArray, index : 0, parent:this.tempCardNode, target : this, posArray : posArray,
                                times : times, callback : callback, scale : scale , playerIndex : i  } );

        }
    },

    showPoker : function( times,index ){
        cc.log( "showPoker  times = " + times + "; index = " + index );
        var pos = this.getFirstCardPos( times );
        if(this.pokersArray[index + pos]){
            this.pokersArray[index + pos].node.active = true;
        }
    },

    /*
     * 第一张牌的位置
     */
    getFirstCardPos : function( times ){
        var ret             = 0;
        var sendNumArray    = this.getSendNumArray();
        for( var i = 0 ; i < times; ++i ){
            ret += sendNumArray[i];
        }
        return ret ;
    },

    getCardNum : function( times ){
        var ret = 0;
        var sendNumArray    = this.getSendNumArray();
        for( var i = 0 ; i <= times; ++i ){
            ret += sendNumArray[i];
        }
        return ret ;
    },

    pokerAction: function( node, nodeData ){
        var nodeArray = nodeData.nodeArray;
        var index     = nodeData.index;
        var parent    = nodeData.parent;
        var target    = nodeData.target;
        var times     = nodeData.times;
        var posArray  = nodeData.posArray;
        var callBack  = nodeData.callback;
        var scale     = nodeData.scale;
        var playerIndex = nodeData.playerIndex;
        if( times >= DZGameUtil.sendCards[0] - 1 ){
            target.sendCardNode.active = false;
        }

        if( !posArray[index] ){
            return;
        }

        ++nodeData.index;

        var action = cc.sequence(
            cc.delayTime( 0.05 ),
            cc.callFunc(target.pokerAction, target, nodeData),
            cc.spawn(cc.moveTo(0.4, posArray[index]).easing(cc.easeIn(1.6)), cc.scaleTo( 0.35,scale ).easing(cc.easeIn(1.6))) ,
            //cc.spawn(cc.moveTo(0.4, posArray[index]), cc.scaleTo( 0.4,scale )) ,
           // cc.moveTo(0.4, posArray[index]),
            cc.delayTime( 0.04 ),
            cc.callFunc( function () {
                if( callBack ){
                    target[callBack]( times, index );
                }
                var num = target.getCardNum( times );
                target.gameView.playerPanel.updatePokersNum(playerIndex, parseInt(num));
                nodeArray[index].active = false;
                if( index >= nodeArray.length - 1 ){
                    ++times;
                    target.tempCardNode.removeAllChildren();
                    target.runPokerAction( null, times );
                }
            })
        ) ;
        if(nodeArray[index]){
            nodeArray[index].runAction( action );
        }

    },

    /*
     * 初始化手牌
     */
    initPoker : function( paiArray ){
        this.sendCardNode.active = true;
        this.produceSlot(paiArray.length);
        for (var i = 0; i < paiArray.length; i++) {
            var pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Item", cc.Prefab);
            let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
            poker.initPaiMian(paiArray[i]);
            poker.node.setPosition( cc.p( this.slotPosXArray[i], 0 ) );
            poker.node.active = false ;
            this.BottompokersView.addChild(poker.node, this.slotPosXArray[i]);
            this.pokersArray[i] = poker;
            this.useredPosX.push(this.slotPosXArray[i]);
        }

        this.useredPosX.sort(function (a, b) {
            return a - b;
        });
        this.pokersArray.sort(function (a, b) {
            return a.node.x - b.node.x;
        });

    },

    runDiffPokerAction : function( paiArray, callback ){
       var type    = DZGameUtil.sendCards;
       var funcArr = [ null,this.pokerAction_2, this.pokerAction_1, this.pokerAction_1 ];
        if( funcArr[type] ){
            funcArr[type].bind(this)( paiArray, callback );
        }

    },

    pokerAction_1 : function(paiArray, callback){
        var self = this;
        if(controlButton){
            controlButton.changeMingPaiBtnTitle( "明 牌x4" );
        }
        self.initPoker( paiArray );
        self.runPokerAction( null, 0 );
        self.callback = callback;
    },

    pokerAction_2 : function( paiArray, callback ){
        this.produceSlot(paiArray.length);
        for (var i = 0; i < paiArray.length; i++) {
            var pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Item", cc.Prefab);
            let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
            poker.initPaiMian(paiArray[i]);
            poker.node.setPosition(0, 0);
            this.BottompokersView.addChild(poker.node, this.slotPosXArray[i]);
            if (i == paiArray.length - 1) {
                poker.node.runAction(cc.sequence(
                    cc.moveTo(this.sendCardTime * (i + 1), cc.p(this.slotPosXArray[i], 0)),
                    cc.callFunc(this._dealPoker, this, { length: paiArray.length, index: i, callback: callback }),
                    cc.callFunc(this._updatePokers.bind(this))
                ));
            } else {
                poker.node.runAction(cc.sequence(
                    cc.moveTo(this.sendCardTime * (i + 1), cc.p(this.slotPosXArray[i], 0)),
                    cc.callFunc(this._dealPoker, this, { length: paiArray.length, index: i, callback: callback })
                ));
            }

            this.pokersArray[i] = poker;
            this.useredPosX.push(this.slotPosXArray[i]);
        }
    },

    /**
     * 把自己的牌移到对应的位置
     * 如果是断线重连，直接放好就行，如果是开始牌桌有发牌动画
     */
    showDealAction: function (paiArray, isReconnect, callback) {
        this.BottompokersView.removeAllChildren();

        if (isReconnect) {
            this.reloadPokers(paiArray);
        } else {
            this.runDiffPokerAction( paiArray, callback );
            /*
            if(controlButton){
                controlButton.changeMingPaiBtnTitle( "明 牌x4" );
            }

            this.initPoker( paiArray );
            this.runPokerAction( null, 0 );
            this.callback = callback;
            */

            /*
            this.produceSlot(paiArray.length);
            for (var i = 0; i < paiArray.length; i++) {
                var pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Item", cc.Prefab);
                let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
                poker.initPaiMian(paiArray[i]);
                poker.node.setPosition(0, 0);
                this.BottompokersView.addChild(poker.node, this.slotPosXArray[i]);
                if (i == paiArray.length - 1) {
                    poker.node.runAction(cc.sequence(
                        cc.moveTo(this.sendCardTime * (i + 1), cc.p(this.slotPosXArray[i], 0)),
                        cc.callFunc(this._dealPoker, this, { length: paiArray.length, index: i, callback: callback }),
                        cc.callFunc(this._updatePokers.bind(this))
                    ));
                } else {
                    poker.node.runAction(cc.sequence(
                        cc.moveTo(this.sendCardTime * (i + 1), cc.p(this.slotPosXArray[i], 0)),
                        cc.callFunc(this._dealPoker, this, { length: paiArray.length, index: i, callback: callback })
                    ));
                }

                this.pokersArray[i] = poker;
                this.useredPosX.push(this.slotPosXArray[i]);
            }
            */

            //this.runAction(cc.sequence(cc.delayTime(this.sendCardTime * paiArray.length + 0.2),cc.callback(this._updatePokers)));
            //this.scheduleOnce(this._updatePokers, this.sendCardTime * paiArray.length + 0.1);
            // HallUtil.schedule(this._updatePokers.bind(this), this.node, this.sendCardTime * paiArray.length + 0.1,false);    
        }
    },

    /**
     * 把牌重新生成一下
     * 传[]数组不生成牌，相当于清空手牌
     */

    reloadPokers: function (paiArray) {
        this.pokersArray = [];
        this.BottompokersView.removeAllChildren();
        for (let i = 0; i < paiArray.length; i++) {
            var pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Item", cc.Prefab);
            let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
            poker.initPaiMian(paiArray[i]);
            //this.BottompokersView.addChild(poker.node, this.slotPosXArray[i]);
            this.pokersArray[i] = poker;
        }
        this.produceSlotAndSort(paiArray.length);
        this.sortPokers();
        for (let i = 0; i < this.pokersArray.length; i++) {
            this.pokersArray[i].node.setPosition(this.slotPosXArray[i], 0);
            this.BottompokersView.addChild(this.pokersArray[i].node, this.slotPosXArray[i]);
        }
    },

    /**
     * 闷抓翻过来
     * 
     * @param {any} paiArray 要显示的牌
     */
    reloadPokersAndFlip: function (paiArray) {
        this.reloadPokers(paiArray);

        for (let i = 0; i < this.pokersArray.length; i++) {
            cc.log('reloadPokersAndFlip' + this.pokersArray[i].getPokerNum());
            this.pokersArray[i].setBackSideActive(true);
        }
        for (let i = 0; i < this.pokersArray.length; i++) {
            cc.log('reloadPokersAndFlip  fss' + this.pokersArray[i].getPokerNum());
            this.pokersArray[i].flipXPoker(1);
        }
    },


  /*
   * 更改倍数
   */
    _changgeBeishu: function( index ){
        var mingPaiPeishu = [
            {
                cardNumStart: 0,
                cardNumEnd: 4,
                multiple: 4,
            },
            {
                cardNumStart: 5,
                cardNumEnd: 9,
                multiple: 3,
            },
            {
                cardNumStart: 10,
                cardNumEnd: 16,
                multiple: 2,
            },
        ];
        if (DZGameUtil.playType == statusConst.playType.ddz4) {
            //4人 每人25张
            mingPaiPeishu = [
                {
                    cardNumStart: 0,
                    cardNumEnd: 7,
                    multiple: 4,
                },
                {
                    cardNumStart: 8,
                    cardNumEnd: 15,
                    multiple: 3,
                },
                {
                    cardNumStart: 16,
                    cardNumEnd: 24,
                    multiple: 2,
                },
            ];
        }

        if(DZGameUtil.mutilNum == mingPaiPeishu[index].multiple){
            return;
        }
        DZGameUtil.mutilNum = mingPaiPeishu[index].multiple;

        cc.log('_dealPoker' + DZGameUtil.mutilNum);
        if(controlButton){
            controlButton.changeMingPaiBtnTitle( "明 牌x" + DZGameUtil.mutilNum);
        }

    },

    _dealPoker: function (target, data) {
        if (data.length - 1 == data.index) {
            data.callback();
        }

        DZGameUtil.lookCardNum = data.index;
        
        var mingPaiPeishu = [
            {
                cardNumStart: 0,
                cardNumEnd: 4,
                multiple: 4,
            },
            {
                cardNumStart: 5,
                cardNumEnd: 9,
                multiple: 3,
            },
            {
                cardNumStart: 10,
                cardNumEnd: 16,
                multiple: 2,
            },
        ];
        if (DZGameUtil.playType == statusConst.playType.ddz4) {
            //4人 每人25张
            mingPaiPeishu = [
                {
                    cardNumStart: 0,
                    cardNumEnd: 7,
                    multiple: 4,
                },
                {
                    cardNumStart: 8,
                    cardNumEnd: 15,
                    multiple: 3,
                },
                {
                    cardNumStart: 16,
                    cardNumEnd: 24,
                    multiple: 2,
                },
            ];
        }
        if (data.length - 2 >= data.index) {
            for (let i = 0; i < mingPaiPeishu.length; i++) {
                if (DZGameUtil.lookCardNum >= mingPaiPeishu[i].cardNumStart &&
                    DZGameUtil.lookCardNum <= mingPaiPeishu[i].cardNumEnd) {
                    DZGameUtil.mutilNum = mingPaiPeishu[i].multiple;
                    cc.log('_dealPoker' + DZGameUtil.mutilNum);
                    //controlButton.changeBtnTitleByName("明 牌x5", "明 牌x" + DZGameUtil.mutilNum);
                    if(controlButton){
                        controlButton.changeMingPaiBtnTitle( "明 牌x" + DZGameUtil.mutilNum);
                    }
                    
                }
            }
        }

    },


    _updatePokers: function ( ) {
        if( this.isCardRunning ) return ;
        if(this.callback){
            this.callback();
        }

        this.useredPosX.sort(function (a, b) {
            return a - b;
        })
        this.sortPokers();
        this._sortPokerAnimation(this.pokersArray);
        //item.runAction(cc.moveTo(0.02,cc.p(0,0)))
    },


    /**
     * 整理手牌的动画
     */

    _sortPokerAnimation: function (pokersArray) {
        var self = this;
        self.isCardRunning = true;
        //console.log("%% 整理手牌的动画pokersArray.length=" + pokersArray.length);
        pokersArray.forEach(function (item, index) {
            //console.log("%% 整理手牌的动画index=" + index);
            if(index == (pokersArray.length - 1)){
                item.node.runAction(cc.sequence(
                    cc.moveTo(0.2, cc.p(0, 0)).easing(cc.easeBackIn() ),
                    //cc.easeBackIn( cc.moveTo(0.05, cc.p(0, 0)) ),
                    cc.callFunc(function () {
                        item.node.zIndex = index;
                        item.node.runAction(  cc.moveTo(0.4, cc.p(self.useredPosX[index], 0)).easing(cc.easeBackOut()) ) ;
                        self.isCardRunning = false;
                    }),
                    // cc.callFunc(function(){
                    //     self.showLandlordState();
                    // })
                ));
            }else{
                item.node.runAction(cc.sequence(
                    cc.moveTo(0.2, cc.p(0, 0)).easing(cc.easeBackIn() ),
                    cc.callFunc(function () {
                        item.node.zIndex = index;
                        item.node.runAction( cc.moveTo(0.4, cc.p(self.useredPosX[index], 0)).easing(cc.easeBackOut()) );
                    })
                ));
            }
        })
    },





    /**
     * 排列扑克的大小顺序
     */
    sortPokers: function () {
        let self = this;
        var pokerNormal = [];
        var pokerLaizi = [];
        for (let i = 0; i < this.pokersArray.length; i++) {
            if (this.pokersArray[i].getPokerNum().length == 4) {
                pokerLaizi.push(this.pokersArray[i]);
            } else {
                pokerNormal.push(this.pokersArray[i]);
            }
        }

        pokerNormal.sort(function (a, b) {
            let pokerAIndex = self.pokerSort.indexOf(a.getPokerNum());
            let pokerBIndex = self.pokerSort.indexOf(b.getPokerNum());
            return pokerAIndex - pokerBIndex;
        })

        pokerLaizi.sort(function (a, b) {
            return - (a.getPokerNum()[3] - b.getPokerNum()[3]);
        })

        pokerNormal.unshift.apply(pokerNormal, pokerLaizi);
        this.pokersArray = pokerNormal;

        for (let i = 0; i < pokerNormal.length; i++) {
            cc.log('pokerNormal ' + pokerNormal[i].getPokerNum());
        }
    },


    /**
     * 生成slot pos,以自己牌的view 的中间开始生成
     * 生成奇数个，先右后左（如果是偶数也没多大关系）
     */

    produceSlot: function (num) {
        this.slotPosXArray = [];
        this.slotPosXArray.push(0);
        var length = (num % 2 == 0) ? num / 2 : num / 2 - 1;
        for (var i = 0; i < length; i++) {
            this.slotPosXArray.push((i + 1) * this.pokerOffeset);
            this.slotPosXArray.push(-(i + 1) * this.pokerOffeset);
        }
    },

    /**
     * 生成slot pos,并牌序
     */

    produceSlotAndSort: function (num) {
        this.slotPosXArray = [];

        this.slotPosXArray.push(0);
        var length = (num % 2 == 0) ? num / 2 : num / 2 - 1;
        for (var i = 0; i < length; i++) {
            this.slotPosXArray.push((i + 1) * this.pokerOffeset);
            this.slotPosXArray.push(-(i + 1) * this.pokerOffeset);
        }

        this.slotPosXArray.sort(function (a, b) {
            return a - b;
        })
    },




    onDestroy: function () {
        //this.unschedule(this._updatePokers);

    },

    /**
     * 如果自己是地主，手里的牌的最后一张显示地主标志，
     * 1.确认地主
     * 2.打出去牌
     */

    showLandlordState: function () {
        if (DZGameUtil.landlordSeatId == 0) {
            if(this.pokersArray.length > 0){
                this.pokersArray[this.pokersArray.length - 1].showlandlordState(true);
            }
            
        }
    },



    _touchStart: function (event) {
        this.isMove = true;
        if (this.getLiftPokers().length == 0) {
            cc.log('_touchStart  11111111111111');
            this.allDownTouch = true;
        } else {
            cc.log('_touchStart  2222222222222');
            this.allDownTouch = false;
        }
        this.calculatePokesRect();
        //cc.log('_touchStart ' + JSON.stringify(event));
        var touches = event.getLocation();
        var pos = self.BottompokersView.convertToNodeSpaceAR(touches);
        this.startPos = pos;
        this.movePos = pos;

        cc.log('_touchStart ' + JSON.stringify(pos));

        this.checkTouch();
    },

    _touchMove: function (event) {
        var touches = event.getLocation();
        var pos = self.BottompokersView.convertToNodeSpaceAR(touches);
        this.movePos = pos;
        this.checkTouch();
        cc.log('_touchMove ' + JSON.stringify(pos));
    },

    _touchEnd: function (event) {
        this.isMove = false;
        var touches = event.getLocation();
        //this.checkTouch();
        //牌抬起或放下
        this.leftOrdownPokers();
    },

    _touchCancel: function (event) {
        this.leftOrdownPokers();
        this.isMove = false;
        this.startPos = cc.p(0, 0);
        this.movePos = cc.p(0, 0);

    },

    calculatePokesRect: function () {
        if (this.pokersArray.length >= 1) {
            for (var i = 0; i < this.pokersArray.length - 1; i++) {
                var item = this.pokersArray[i].node;
                var rect = new cc.Rect(item.x - item.width / 2, -this.touchNode.height / 2, this.pokerOffeset, this.touchNode.height);
                this.pokersArray[i].touchRect = rect;
            }
            //最后一个的触摸区域大
            var lastItem = this.pokersArray[this.pokersArray.length - 1].node;
            var lastRect = new cc.Rect(lastItem.x - lastItem.width / 2, -this.touchNode.height / 2, lastItem.width, this.touchNode.height);
            this.pokersArray[this.pokersArray.length - 1].touchRect = lastRect;

        }
        for (var i = 0; i < this.pokersArray.length; i++) {
            cc.log('rectrect' + JSON.stringify(this.pokersArray[i].touchRect) + '           ' + i);
        }
    },

    calculateTochMovedItem: function () {
        cc.log('calculateTochMovedItem');
        var touchPokerArray = [];
        cc.log('calculateTochMovedItem  222' + JSON.stringify(this.startPos) + 'end  ' + JSON.stringify(this.startPos));
        var bigTouchRect = new cc.Rect(
            Math.min(this.startPos.x, this.movePos.x),
            -this.touchNode.height / 2,
            Math.abs(this.startPos.x - this.movePos.x),
            this.touchNode.height
        );
        cc.log('calculateTochMovedItem  111' + bigTouchRect);

        for (var i = 0; i < this.pokersArray.length; i++) {
            if (this.pokersArray[i].touchRect.containsRect(bigTouchRect) || this.pokersArray[i].touchRect.intersects(bigTouchRect)) {
                touchPokerArray.push(i);
            }
        }
        cc.log('calculateTochMovedItem' + touchPokerArray);
        return touchPokerArray;
    },

    checkTouch: function () {
        var touchIndexArray = this.calculateTochMovedItem();
        if (this.isMove) {
            for (var i = 0; i < this.pokersArray.length; i++) {
                if (touchIndexArray.indexOf(i) >= 0) {
                    var item = this.pokersArray[i];
                    item.setMaskActive(true);
                } else {
                    var item = this.pokersArray[i];
                    item.setMaskActive(false);
                }
            }
        }
    },

    leftOrdownPokers: function () {
        for (var i = 0; i < this.pokersArray.length; i++) {
            if (this.pokersArray[i].getBlackStatus()) {
                this.pokersArray[i].updatePokerUplift(!this.pokersArray[i].getIsOffect());
                this.pokersArray[i].setMaskActive(false);
            }
        }

        //把顺子抬起来
        if (this.allDownTouch) {
            this._freshenUpPokers();
        }
        //这块写按钮变灰或变亮的相关操作
        cc.log('xxxxxxxxxxxxxxxx  ' + JSON.stringify(this.getLiftPokers()));
        this.gameView.update_sendBtn();
    },


    /**
     * 当抬起的手牌多于5张时，把顺子抬起来，其它的牌下去
     */
    _freshenUpPokers: function () {
        let willPlayPoker = this.getLiftPokers();
        cc.log('_freshenUpPokers' + JSON.stringify(willPlayPoker));
        if (willPlayPoker.length > 5) {
            cc.log('playType:::' + JSON.stringify(DZGameUtil.playType));
            let sortWillPlayPoker = CardRule.getStraightHards(willPlayPoker, DZGameUtil.playType);
            cc.log('_freshenUpPokers  343' + JSON.stringify(sortWillPlayPoker));
            for (let i = 0; i < willPlayPoker.length; i++) {
                let poker = willPlayPoker[i];
                let index = sortWillPlayPoker.indexOf(poker);
                if (index >= 0) {
                    sortWillPlayPoker.splice(index, 1);
                    this.liftPokerArray[i].updatePokerUplift(true);
                } else { //下去
                    this.liftPokerArray[i].updatePokerUplift(false);
                }
            }
        }
    },

    /**
     * 取所有的手牌数字
     */

    getAllPokers: function () {
        var pokerNums = [];
        for (let i = 0; i < this.pokersArray.length; i++) {
            pokerNums.push(this.pokersArray[i].getPokerNum());
        }
        return pokerNums;
    },

    /**
   * 生成一张牌出来
   */
    producePoker: function (num) {
        var pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Item", cc.Prefab);
        let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
        poker.initPaiMian(num);
        return poker;
    },


    /**
     * 播放癞子动画
     */
    showLaiziAni: function (pokers, callback) {
        this.laiziNode.removeAllChildren();
        for (let i = 0; i < pokers.length; i++) {
            let poker = this.producePoker(pokers[i]);
            this.laiziNode.addChild(poker.node);
            poker.showLaiziAni(callback);
        }
    },

  /**
   * 生成一张牌出来
   */
  producePokerHalf: function (num) {
    var pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/pai_Itemhalf", cc.Prefab);
    let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
    poker.initPaiMian(num);
    return poker;
},



    // update (dt) {},
});
