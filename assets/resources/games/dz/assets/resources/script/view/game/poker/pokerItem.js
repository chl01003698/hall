import { DZPlaySound } from '../sound/DZPlaySound';


var statusConst = require('DZConstant').DZConstant;

var pokerType = cc.Enum({
    Normal: 0,          //普通牌
    BigJoker: 1,        //大王
    SmallJoker: 2,      //小王
    Lazarillo: 3,        //癞子
    PiziWang: 4,        //皮子王
});

var offectY = 20;

cc.Class({
    extends: cc.Component,

    properties: {
        pokerNum: cc.Sprite,    //扑克上面的数字
        colorBig:   cc.Sprite,  //大花色
        colorSmall: cc.Sprite,  //小花色
        Mask: cc.Node,  //黑板子
        normalPoker: cc.Node,    //普通牌
        bigJoker: cc.Node,  //大王结点
        smallJoker: cc.Node,    //小王结点
        Lazarillo: cc.Node, //皮子结点


        landlordNode: cc.Node,  //显示地主标志（手牌中的最后一张显示）

        backSide: cc.Node,  //牌背面
        piziWang: cc.Node,  //皮子王

        tdLz: cc.Node,//天地癞子标记
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    onEnable: function () {
        // 
    },

    onDisable: function () {
       
    },

    start() {

    },

    /**
     * 根据牌的字符串显示出正确的牌
     */
    initPaiMian: function (pokerString) {
        cc.log('initPaiMian' + pokerString);
        // if(pokerString == "PLX" || pokerString == "PLY"){
        //     pokerString = "PLP";
        // }
        //皮子打出去的牌不变，还显示皮子
        if(pokerString.indexOf("PL") == 0){
            pokerString = "PLP";
        }
        if(pokerString == '-1') {   //皮子闷抓
            this.backSide.active = true; 
            this._pokerPoint = pokerString; //牌上面的数字
            return;
        }
        this.backSide.active = false;   //不显示背面
        
        this._pokerPoint = pokerString; //牌上面的数字
        this._isoffset = false;     //牌的抬起状态
        this._black = false;
        this._isScorecard = false;  //底牌状态

        let paiPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/pai",cc.SpriteAtlas);

        var pokerColor = pokerString[0];
        var pokerNum = "";
        if(pokerString.length == 4) {
            pokerNum = pokerString[3];
        }else if(pokerString.length == 3){
            pokerNum = pokerString[2];
        }else {
            pokerNum = pokerString[1];
        }
        if(pokerNum == '0') {
            pokerNum = '10';
        }

        if(pokerString.length == 4) {
            this.colorBig.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_laizi');
            this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_laizi');
            this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('pukepai_huang_' + pokerNum);
            this.setPokerType(pokerType.Normal);
        }else if(pokerString.length == 3) {
            if(pokerNum == "P") {
                this.setPokerType(pokerType.Lazarillo);
            }else if(pokerNum == "X"||pokerNum == "Y"){
                this.setPokerType(pokerType.piziWang);
            }else {
                this.colorBig.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_laizi');
                this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_laizi');
                this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('pukepai_huang_' + pokerNum);
                this.setPokerType(pokerType.Normal);
            }
        }
        else {
            if (pokerColor == statusConst.pokerColor.spade) {   //黑桃
                this.colorBig.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_heitao');
                this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_heitao');
                this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('pukepai_hei_' + pokerNum);
                this.setPokerType(pokerType.Normal);            
            } else if (pokerColor == statusConst.pokerColor.hearts) {   //红桃
                this.colorBig.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_hongtao');
                this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_hongtao');
                this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('pukepai_hong_' + pokerNum);
                this.setPokerType(pokerType.Normal);
            } else if (pokerColor == statusConst.pokerColor.club) {   //梅花
                this.colorBig.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_meihua');
                this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_meihua');
                this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('pukepai_hei_' + pokerNum);
                this.setPokerType(pokerType.Normal);
            } else if (pokerColor == statusConst.pokerColor.diamond) {   //方块
                this.colorBig.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_fangpian');
                this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_fangpian');
                this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('pukepai_hong_' + pokerNum);
                this.setPokerType(pokerType.Normal);
            }else { //大小王
                if(pokerNum == statusConst.joker.bigJoker) {
                    this.setPokerType(pokerType.BigJoker);
                }else {
                    this.setPokerType(pokerType.SmallJoker);
                }
            }
        }
       
    },

    /**
     * 把一张正常牌变成癞子牌，等确定地主时变癞子使用
     */

     changeToLaizi: function (laizi) {
        let pokerString = this.getPokerNum();
        var pokerNum = pokerString.slice(1, 2);
        if(laizi.indexOf(pokerNum) >= 0) {
            if(pokerNum == '0') {
                pokerNum = '10';
            }
    
            let paiPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/pai",cc.SpriteAtlas);
            this.colorBig.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_laizi');
            this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('pukepai_huase_laizi');
            this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('pukepai_huang_' + pokerNum);
        }
     },


    /**
     * 设置扑克的大小
     */
    setPokerScale: function (scale) {
        this.node.setScale(scale);
    },

    

    /**
     * 设置扑克牌的类型
     */
    setPokerType: function (type) {
        this.Mask.active = false;
        this.normalPoker.active = (type == pokerType.Normal);
        this.bigJoker.active = (type == pokerType.BigJoker);
        this.smallJoker.active = (type == pokerType.SmallJoker);
        this.Lazarillo.active = (type == pokerType.Lazarillo);
        this.piziWang.active = (type == pokerType.PiziWang);
    },

    /**
     * 牌背面的显示隐藏
     */

     setBackSideActive: function (isShow) {
        this.backSide.active = isShow;
     },


    /**
     * 抬起或放下
     */
    updatePokerUplift: function (_isoffset) {
        this._isoffset = _isoffset;
        if(this._isoffset) {
            this.node.y = offectY;
        }else {
            this.node.y = 0;
        }
    },

    /**
     * 设置或取消蒙板
     * @param {*} isBlack 
     */
    setMaskActive (isBlack) {
        this._black = isBlack;
        this.Mask.active = isBlack;
    },

    /**
     * 扑克牌的蒙板状态
     */
    getBlackStatus: function () {
        return this._black;
    },

    /**
     * 扑克牌的数字
     */
    getPokerNum: function () {
        return this._pokerPoint;
    },

    /**
     * 扑克牌的升起状态
     */
    getIsOffect: function () {
        return this._isoffset;
    },

    // _touchCancel: function (event) {

    // }
    /**
     * 设置是否是底牌
     */

    setScorecard: function (isScorecard) {
        this._isScorecard = isScorecard;
    },

    getScorecard: function () {
        return this._isScorecard;
    },

    /**
     * 显示或隐藏地主的标志
     */

     showlandlordState(isShow) {
        this.landlordNode.active = isShow;
     },

    /**
     * 进行翻转动画，底牌显示
     */
    flipXPoker: function (scaleNum) {
        if(this.getPokerNum() == '-1') {
            this.setBackSideActive(true);
            return;
        }
        var self = this;
        this.setBackSideActive(true);
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.18,0.01,scaleNum),
            cc.callFunc(function(){
                self.setBackSideActive(false);
            }),
            cc.scaleTo(0.18,scaleNum,scaleNum)
        ))
    },

    /**
     * 显示天地癞子标记
     */
    showTDLzTip:function(blnTian){
        this.tdLz.active = true;
        let yxzPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/youxizhong", cc.SpriteAtlas);
        if(blnTian){
            this.tdLz.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("doudizhu_tian"); 
        }else{
            this.tdLz.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("doudizhu_di"); 
        }
    },

    /**
     * 播放癞子动画
     */
    showLaiziAni: function (callback) {
        var self = this;
        this.setBackSideActive(true);
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2,0.01,1),
            cc.scaleTo(0.2,1,1),
            cc.scaleTo(0.2,0.01,1),
            cc.scaleTo(0.2,1,1),
            cc.scaleTo(0.2,0.01,1),
            cc.scaleTo(0.2,1,1),
            cc.scaleTo(0.2,0.01,1),
            cc.scaleTo(0.2,1,1),
            cc.scaleTo(0.2,0.01,1),
            cc.callFunc(function(){
                self.setBackSideActive(false);
            }),
            cc.scaleTo(0.2,1,1),
            cc.callFunc(function(){
                DZPlaySound.getInstance().stopChooseLz();
            }),
            cc.delayTime(0.3),
            cc.callFunc(function(){
                DZPlaySound.getInstance().makeSureLz();
            }),
            cc.fadeOut(0.5),
            cc.callFunc(function(){
                callback();
            }),
        ))
    },

    // update (dt) {},
});
