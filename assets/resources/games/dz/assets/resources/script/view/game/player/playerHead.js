/**
 * 玩家头像类
 */
import { DZPlaySound } from "../sound/DZPlaySound";
import { DZConstant } from "../../../common/DZConstant";
import { DZHallModel } from "../../hall/DZHallModel";
import { HallUserModel } from "../../../../../../../../script/view/login/HallUserModel";
import { DZGameSelfInfoController } from "../../gameSelfInf/DZGameSelfInfoController";
import {DZFriendController} from "../../friend/DZFriendController";

var Constants = require('DZConstant').DZConstant;
var DZGameUtil = require('DZGameUtil').DZGameUtil;
var HallUtil = require('HallUtil').HallUtil;
var HallUIUtil = require('HallUIUtil').HallUIUtil;
cc.Class({
    extends: cc.Component,

    properties: {
        nickName: cc.Label,         //名字
        showNode: cc.Node,     //明牌状态显示
        playerHead: cc.Sprite,        //头像
        multipleNode: cc.Node, // 倍数 文字
        multipleNum: cc.Label,  //倍数
        scoreNum: cc.Label,     //分数
        groundScore: cc.Label,  //单局的输赢分数

        landlordNode: cc.Node,  //地主标志
        redLight: cc.Node,      //红灯
        roomOwner: cc.Node,     //房主标志
        pokersNode: cc.Node,       //剩余牌张数结点
        pokerNum: cc.Node,      //剩余牌张数
        readyNode: cc.Node,      //准备的结点
        lostConectNode: cc.Node,    //离线的标志
        animationNode: cc.Node,     //播动画的节点
        chatNode: cc.Node,  //聊天气炮
        timeNode: cc.Node,      //闹中
        timeLabel: cc.Label,    //闹钟上面的数字
        mingpaiPanel: cc.Node,   //明牌
        touchNode: cc.Node,
        alarm:sp.Skeleton,//警报
        clock:sp.Skeleton,//闹钟
    },

    // LIFE-CYCLE CALLBACKS:

    initData() {
        cc.log("$$$ ....头像。。。onload");
        this.landlordNode.active = false;
        //this.roomOwner.active = false;
        this.showNode.active = false;
        this.redLight.active = false;
        this.readyNode.active = false;
        this.lostConectNode.active = false;
        this.pokersNode.active = false;
        this.timeNode.active = false;
        this.alarm.node.active = false;
        this.clock.node.active = false;
        this.touchNode.on('touchend', function () {
            cc.log("$$$....点击头像,self.data.id=" + this.data.id + " getUserID()=" + HallUserModel.getInstance().getUserID());
            DZGameSelfInfoController.showGameSelfInfoView(this.data.shortId);
        }.bind(this));
        //this.node.
    },

    start() {
        cc.log("$$$ ....头像。。。start");

        this.node.on("deletePutCards", this.deletePutCards  );

    },

    initInfo: function () {
        this.initData();
    },

    /**
     * 离线标志
     */

    showLostConect: function (state) {
        this.lostConectNode.active = state;
    },

    /**
     * 播放emoji表情
     *
     */
    playEmoji(data) {
        var clip = this.animationNode.addComponent('MyCreateClip');
        var clipData = {
            path: data.atlas,
            name: data.lookName,
            frameRate: data.frameRate,
            loop: false,
        };
        clip.init(clipData);
        clip.play();
    },

    /**
     * 展示聊天气泡
     */
    showChat: function (data, seatId, uid) {
        cc.log('showchat' + JSON.stringify(data));
        //这块到时候把语音index对应上
        var sex = DZPlaySound.getInstance().getSexById(uid);
        DZPlaySound.getInstance().playChatCommon(data.index % 11, DZPlaySound.getInstance().getChatStr(sex));
        var prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/chatCommon/speekGroud', cc.Prefab);
        var chatNode = cc.instantiate(prefab);
        if (seatId == 0 || seatId == 2) {
            chatNode.setAnchorPoint(0, 0.5);
        } else if (seatId == 1) {
            chatNode.setAnchorPoint(1, 0.5);
        } else {
            chatNode.setAnchorPoint(0.5, 0.5);
        }
        var speekLabel = cc.find('speek', chatNode).getComponent(cc.Label);
        speekLabel.string = data.speek;
        chatNode.opacity = 0;
        var action = cc.sequence(

            cc.spawn(cc.fadeIn(1), cc.scaleTo(1, 1.2, 1.2)),
            cc.delayTime(4),
            cc.spawn(cc.fadeOut(1), cc.scaleTo(1, 1, 1)),
            cc.callFunc(function () {
                chatNode.destroy();
                DZConstant.playSpeekNode.speekNode = false;
            }),
        );
        chatNode.runAction(action);
        this.chatNode.addChild(chatNode);
    },

    /**
     * 刷新头像信息
     */

    updatePlayerInfo: function (data) {
        cc.log("updatePlayerInfo" + JSON.stringify(data));
        //头像
        if(this.data){
            //重连的时候把后来的数据和之前的合并
            this.data = Object.assign(this.data,data);
        }else{
            this.data = data;
        }
       
       
        if (data.headimgurl) {
            HallUIUtil.urlSprite(data.headimgurl, this.playerHead);
            // if (data.headimgurl.length > 0) {
            //     cc.loader.load(data.headimgurl, function (err, texture) {
            //         var frame = new cc.SpriteFrame(texture);
            //         this.playerHead.spriteFrame = frame;
            //     }.bind(this));
            // }
        }


        //名字
        if (data.nickname) {
            this.nickName.string = data.nickname;
        }

        cc.log(data.nickname + " $$$ ....准备状态:" + data.ready + " this.readyNode=" + this.readyNode);
        if (data.ready) {
            this.readyNode.active = true;//data.ready;
        } else {
            this.readyNode.active = false;
        }

        //分数
        if (data.integral) {
            this.scoreNum.string = data.integral;
        }
        //倍数
        if (data.multiple) {
            this.updateMultiple(data.multiple) ;
        }
        else{
            this.updateMultiple(String(123)) ;
        }
        //刚开始隐藏单局分数
        this.updateRoundScore("");
    },

    /**
     * 显示或隐藏 准备ok的手
     */
    hideOkStatus: function (isHide) {
        this.readyNode.active = !isHide;
    },

    /**
     * 显示地主的标志
     */

    showlandlordStatus: function (isShow) {
        cc.log('showlandlordStatus' + isShow);
        this.landlordNode.active = isShow;
    },

    /**
     * 显示房主标记
     */
    showOwnerStatus: function(isShow){
        //this.roomOwner.active = isShow;
    },

    /**
         * 刷新手牌数
         */
    updatePokersNum: function (num) {

        this.pokerNum.getComponent(cc.Label).string = num;

        //1显示 2不显示
        if(DZGameUtil.remaining == 2){
            this.pokerNum.active = false;
            this.pokerNum.getComponent(cc.Label).string = "";
        }
        //牌数小于3张都显示出来
        if(num <= 3){
            this.pokerNum.active = true;
            this.pokerNum.getComponent(cc.Label).string = num;
        }

    },

    /**
     * 显示或隐掉有多少张牌，等待界隐藏，牌桌内显示
     */
    showPokersNum: function (isHide) {
        this.pokersNode.active = true;
        if(DZGameUtil.remaining == 2){
            this.pokerNum.active = false;
        }
    },

    hidenPokersNum(){
        this.pokersNode.active = false;
        this.pokerNum.active = false;
    },

    updateTime: function () {
        //console.log("updateTime:"+this.timeLabel.string);
        if(this.timeLabel.string >= 1){
            this.timeLabel.string -= 1;
        }
        if (this.timeLabel.string <= 0) {
            this.node.stopAction(this.alarmTimer);
        }
        if(this.timeLabel.string == 5){
            this.playClock();
        }
    },


    /**
      * 显示或隐掉明牌
      */
    showMingStatus: function (isHide) {
        this.showNode.active = isHide;
    },

    /**
     * 明牌 牌是否显示
     */
    shwoMingpaiCards: function(is){
        this.mingpaiPanel.active = is
    },

    showMingPokers: function (pokers,seatId) {
        pokers = DZGameUtil.sortPoker(pokers);
        this.mingpaiPanel.removeAllChildren();
        var perPokers = 11; //每行多少张牌
        let mingpai_name = "pai_ItemMing";
        if(seatId == 1){
            mingpai_name = "pai_ItemMing_four";
        }
        for (let i = 0; i < pokers.length; i++) {
            
            let pokerPrefab = cc.loader.getRes("games/dz/assets/resources/res/prefab/poker/" + mingpai_name, cc.Prefab);
            let poker = cc.instantiate(pokerPrefab).getComponent('pokerItem');
            poker.initPaiMian(pokers[i]);
            this.mingpaiPanel.addChild(poker.node);
        }
    },


    /*
     * todo: 给对应座位号的玩家，删除明牌区的牌
     */
    deletePutCards : function( seadId, putCards ){

    },


    /**
       * 显示闹钟或隐藏闹钟
       */

    showAlarmClock: function (isShow) {
        console.log("showAlarmClock:" + isShow);
        this.timeNode.active = isShow;
        this.clock.node.active = isShow;
        //this.clock.clearTrack(0);
        this.clock.clearTracks();
        //if (this.timeNode.activeInHierarchy) {
        if(isShow){
            this.timeLabel.string = '20';

            this.alarmTimer = HallUtil.schedule(function () {
                this.updateTime();
            }.bind(this), this.node, 1.0, true);
        } 
        if(!isShow){
            console.log("停止计时器....");
            if(this.alarmTimer){
                this.node.stopAction(this.alarmTimer);
            }
            this.node.stopAllActions();
        }
    },

    updateMultiple: function (mutiple) {
        this.multipleNum.string = mutiple;

        // 倍数居中
        let numSize = this.multipleNum.node.getContentSize() ;
        this.multipleNode.setContentSize(cc.size(numSize.width + 20, numSize.height)) ;
        this.multipleNode.setPositionX((numSize.width + 20) / 2) ;
    },

    updateScore: function (score) {
        this.scoreNum.string = score;
    },

    //更新每局的输赢分数
    updateRoundScore: function(score) {
        this.groundScore.string = score;
    },
    

    //显示红灯警报
    showRedLight: function (isShow) {
        //this.redLight.active = isShow;
        if(isShow){
            this.playAlarm();
        }else{
            this.stopAlarm();
        }
    },
    
    hadShowRedLight: function(){
        return this.alarm.node.active;
    },
    //播放警报
    playAlarm:function () {
        if(!this.alarm.node.active){
            this.alarm.node.active = true;
        }
        this.alarm.setAnimation(0, 'animation', true);
        this.alarm.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === 'animation') {
                //this.alarm.node.active = false;
            }
        });
    },
    stopAlarm: function(){
        this.alarm.clearTracks();
        this.alarm.node.active = false;
    },
    //播放闹钟
    playClock:function () {
        if(!this.clock.node.active){
            this.clock.node.active = true;
        }
        this.clock.setAnimation(0, 'animation', true);
    },
    //set

    // update (dt) {},
});
