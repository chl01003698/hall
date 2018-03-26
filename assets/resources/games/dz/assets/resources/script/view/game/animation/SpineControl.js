// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
import { DZPlaySound } from "../sound/DZPlaySound";

var self = null;
var DZConstant = require('DZConstant').DZConstant;
var DdzConst = require('DdzConst');
var HallUtil = require('HallUtil').HallUtil;
cc.Class({
    extends: cc.Component,

    properties: {
        spine_feiji: sp.Skeleton,
        spine_huojian: sp.Skeleton,
        spine_bomb: sp.Skeleton,
        spine_other: sp.Skeleton,
        spine_spring: sp.Skeleton,
        spine_mingpai: sp.Skeleton,
        spine_antiSpring: sp.Skeleton,
        spine_good: sp.Skeleton,
        spine_shoes: sp.Skeleton,
        spine_tomato: sp.Skeleton,
        spine_cup: sp.Skeleton,
        spine_flower: sp.Skeleton,
        root_node: cc.Node,
        spine_win: sp.Skeleton,
        spine_lose: sp.Skeleton,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        self = this;
        // this.spine_huojian.setStartListener((trackEntry, loopCount) => {
        //     // var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        //     cc.qp.playSound.playBomb();
        // });
    },

    start() {

    },

    showAnimaiton: function () {
        if(this.spine_feiji){
            this.spine_feiji.node.active = false;
        }
        if(this.spine_huojian){
            this.spine_huojian.node.active = false;
        }
        if(this.spine_bomb){
            this.spine_bomb.node.active = false;
        }
        if(this.spine_other){
            this.spine_other.node.active = false;
        }
        if(this.spine_spring){
            this.spine_spring.node.active = false;
        }
        if(this.spine_mingpai){
            this.spine_mingpai.node.active = false;
        }
        if(this.spine_antiSpring){
            this.spine_antiSpring.node.active = false;
        }
        if(this.spine_good){
            this.spine_good.node.active = false;
        }
        if(this.spine_shoes){
            this.spine_shoes.node.active = false;
        }
        if(this.spine_tomato){
            this.spine_tomato.node.active = false;
        }
        if(this.spine_cup){
            this.spine_cup.node.active = false;
        }
        if(this.spine_flower){
            this.spine_flower.node.active = false;
        }
        if(this.spine_win){
            this.spine_win.node.active = false;
        }
        if(this.spine_lose){
            this.spine_lose.node.active = false;
        }
        
    },

    //播放飞机动画
    playFeiji: function () {
        if (!this.spine_feiji.node.active) {
            this.spine_feiji.node.active = true;
        }
        this.spine_feiji.setAnimation(0, 'animation', false);
    },
    //播放炸弹动画
    playBomb: function (pos) {
        if (!this.spine_bomb.node.active) {
            this.spine_bomb.node.active = true;
        }
        switch (pos) {
            case 0:
                this.spine_bomb.setAnimation(0, 'Own', false);
                break;
            case 1:
                this.spine_bomb.setAnimation(0, 'Right', false);
                break;
            case 2:
                this.spine_bomb.setAnimation(0, 'Left', false);
                break;
            case 3:
                this.spine_bomb.setAnimation(0, 'Above', false);
                break;
        }
    },
    //播放火箭动画
    playHuojian: function (pos) {
        if (!this.spine_huojian.node.active) {
            this.spine_huojian.node.active = true;
        }
        switch (pos) {
            case 0:
                this.spine_huojian.setAnimation(0, 'Own', false);
                break;
            case 1:
                this.spine_huojian.setAnimation(0, 'Right', false);
                break;
            case 2:
                this.spine_huojian.setAnimation(0, 'Left', false);
                break;
            case 3:
                this.spine_huojian.setAnimation(0, 'Above', false);
                break;
        }
    },

    //播放连对牌型动画
    playLianDuiAnimation: function (seateId, pos) {
        if (!this.spine_other.node.active) {
            this.spine_other.node.active = true;
        }
        this.spine_other.node.position = pos;
        switch (seateId) {
            case 0:
            case 2:
                this.spine_other.setAnimation(0, 'liandui', false);
                break;
            case 1:
            case 3:
                this.spine_other.setAnimation(0, 'liandui2', false);
                break;
        }
    },
    //播放三代2牌型动画
    playSanDai2Animation: function (seateId, pos) {
        if (!this.spine_other.node.active) {
            this.spine_other.node.active = true;
        }
        this.spine_other.node.position = pos;
        switch (seateId) {
            case 0:
            case 2:
                this.spine_other.setAnimation(0, 'sandaiyidui', false);
                break;
            case 1:
            case 3:
                this.spine_other.setAnimation(0, 'sandaiyidui2', false);
                break;
        }
    },
    //播放三代1牌型动画
    playSanDai1Animation: function (seateId, pos) {
        if (!this.spine_other.node.active) {
            this.spine_other.node.active = true;
        }
        this.spine_other.node.position = pos;
        switch (seateId) {
            case 0:
            case 2:
                this.spine_other.setAnimation(0, 'sandaiyi', false);
                break;
            case 1:
            case 3:
                this.spine_other.setAnimation(0, 'sandaiyi2', false);
                break;
        }
    },
    //播放顺子牌型动画
    playShunZiAnimation: function (seateId, pos) {
        if (!this.spine_other.node.active) {
            this.spine_other.node.active = true;
        }
        this.spine_other.node.position = pos;
        switch (seateId) {
            case 0:
            case 2:
                this.spine_other.setAnimation(0, 'shunzi', false);
                break;
            case 1:
            case 3:
                this.spine_other.setAnimation(0, 'shunzi2', false);
                break;
        }
    },
    //播放四带二牌型动画
    playSiDai2Animation: function (seateId, pos) {
        if (!this.spine_other.node.active) {
            this.spine_other.node.active = true;
        }
        this.spine_other.node.position = pos;
        switch (seateId) {
            case 0:
            case 2:
                this.spine_other.setAnimation(0, 'sidaier', false);
                break;
            case 1:
            case 3:
                this.spine_other.setAnimation(0, 'sidaier2', false);
                break;
        }
    },
    //四带两对牌型动画
    playSiDailiangduiAnimation: function (seateId, pos) {
        if (!this.spine_other.node.active) {
            this.spine_other.node.active = true;
        }
        this.spine_other.node.position = pos;
        switch (seateId) {
            case 0:
            case 2:
                this.spine_other.setAnimation(0, 'sidaiyidui', false);
                break;
            case 1:
            case 3:
                this.spine_other.setAnimation(0, 'sidaiyidui2', false);
                break;
        }
    },
    //播放结算胜利失败动画
    playJieSuanAni: function (type, isWin) {
        if (isWin > 0) {
            if (!this.spine_win.node.active) {
                this.spine_win.node.active = true;
            }
            
        }else{
            if (!this.spine_lose.node.active) {
                this.spine_lose.node.active = true;
            }
        }
        if (type == 'landlord') {
            //地主
            if (isWin > 0) {
                this.spine_win.setAnimation(0, 'LordWin', false);
            }else{
                this.spine_lose.setAnimation(0, 'lordfail', false);
            }
        } else {
            //农民
            if (isWin > 0) {
                this.spine_win.setAnimation(0, 'peopleWin', false);
            }else{
                this.spine_lose.setAnimation(0, 'proplefail', false);
            }
        }
    },
    stop_JieSuanAnim: function(){
        this.spine_win.node.active = false;
        this.spine_lose.node.active = false;
    },
    //播放反春天动画
    playAntiSpring: function () {
        if (!this.spine_antiSpring.node.active) {
            this.spine_antiSpring.node.active = true;
        }
        this.spine_antiSpring.setAnimation(0, 'animation', false);
    },

    //播放春天动画
    playSpringAnimation: function () {
        if (!this.spine_spring.node.active) {
            this.spine_spring.node.active = true;
        }
        this.spine_spring.setAnimation(0, 'animation', false);
    },
    //播放明牌动画
    playMingPaiAnimation: function (seateId) {
        if (!this.spine_mingpai.node.active) {
            this.spine_mingpai.node.active = true;
        }
        switch (seateId) {
            case 0:
            case 2:
                this.spine_mingpai.setAnimation(0, 'sidaier', false);
                break;
            case 1:
            case 3:
                this.spine_mingpai.setAnimation(0, 'sidaier2', false);
                break;
        }
    },
    /**
     * 播放飞机，炸弹，火箭动画
     * */
    playCardAnimation: function (type, seateId, pos) {
        switch (type) {
            case DdzConst.HandType.KingBomb.value:
            case DdzConst.HandType.KingBombWithNoPZ.value://皮字王炸
            case DdzConst.HandType.TopKingBomb.value:
                //case consts.card.handTypes.ROCKET:	//火箭
                this.playHuojian(seateId);

                HallUtil.schedule(function () {
                    DZPlaySound.getInstance().playBomb();
                }.bind(this), this.node, 1.0);
                break;
            case DdzConst.HandType.Bomb.value:
            case DdzConst.HandType.SoftBomb.value:
            case DdzConst.HandType.LaiBomb.value:
            case DdzConst.HandType.ZhongBomb.value:
            case DdzConst.HandType.LianBomb.value:
            case DdzConst.HandType.ZhongBombNoPzKing.value:
                //case consts.card.handTypes.BOMB:    //炸弹
                this.playBomb(seateId);
                break;
            case DdzConst.HandType.Airplane.value:
            case DdzConst.HandType.AirplaneBeltSingle.value:
            case DdzConst.HandType.AirplaneBeltDouble.value:
                // case consts.card.handTypes.AIRPLANE:    //飞机
                // case consts.card.handTypes.AIRPLANE_SOLO:    //飞机带2单
                // case consts.card.handTypes.AIRPLANE_PAIR:    //飞机带2对
                this.playFeiji();
                break;
            case DdzConst.HandType.DoubleStraight.value:
                //case consts.card.handTypes.CONSECUTIVE_PAIRS:  //连对
                this.playLianDuiAnimation(seateId, pos);
                break;
            case DdzConst.HandType.TripletsBeltDouble.value:
                //case consts.card.handTypes.TRIO_PAIR: //三代2
                this.playSanDai2Animation(seateId, pos);
                break;
            case DdzConst.HandType.TripletsBeltSingle.value:
                //case consts.card.handTypes.TRIO_SOLO: //三带一
                this.playSanDai1Animation(seateId, pos);
                break;
            case DdzConst.HandType.Straight.value:
                //case consts.card.handTypes.STRAIGHT: //顺子
                this.playShunZiAnimation(seateId, pos);
                break;
            case DdzConst.HandType.FourCardsBeltTwoWithSingle.value:
            case DdzConst.HandType.FourCardsBeltTwoWithDouble.value:
                // case consts.card.handTypes.SPACE_SHUTTLE_PAIR: //四带二
                // case consts.card.handTypes.SPACE_SHUTTLE_SOLO: //四带二
                this.playSiDai2Animation(seateId, pos);
                break;
            case DdzConst.HandType.FourCardsBeltTwoDouble.value:
                this.playSiDailiangduiAnimation(seateId, pos);
                break;

        }
    },

    playMagicAnimation(type, startPos, endPos, startSid, endSid) {
        let spineNode = null;
        let spine = null;
        let completeStr = '';
        switch (type) {
            case DZConstant.magicType.good:
                spineNode = cc.instantiate(this.spine_good.node);
                this.root_node.addChild(spineNode);
                if (!spineNode.active) {
                    spineNode.active = true;
                }
                spine = spineNode.getComponent(sp.Skeleton);
                if (this.getLRBySid(startSid, endSid) == 'left') {
                    spine.setAnimation(0, 'LeftLoop', true);
                } else {
                    spine.setAnimation(0, 'RightLoop', true);
                }
                break;
            case DZConstant.magicType.shoes:
                spineNode = cc.instantiate(this.spine_shoes.node);
                this.root_node.addChild(spineNode);
                if (!spineNode.active) {
                    spineNode.active = true;
                }
                spine = spineNode.getComponent(sp.Skeleton);
                spine.setAnimation(0, 'ShoesLoop', true);
                break;
            case DZConstant.magicType.tomato:
                spineNode = cc.instantiate(this.spine_tomato.node);
                this.root_node.addChild(spineNode);
                if (!spineNode.active) {
                    spineNode.active = true;
                }
                spine = spineNode.getComponent(sp.Skeleton);
                spine.setAnimation(0, 'Left2', true);
                break;
            case DZConstant.magicType.cup:
                spineNode = cc.instantiate(this.spine_cup.node);
                this.root_node.addChild(spineNode);
                if (!spineNode.active) {
                    spineNode.active = true;
                }
                spine = spineNode.getComponent(sp.Skeleton);
                let splitSid = startSid + "" + endSid;
                if (this.getLRBySid(startSid, endSid) == 'left') {
                    spine.setAnimation(0, 'LeftLoop', true);
                } else {
                    if (splitSid == '02' || splitSid == '20') {
                        spine.setAnimation(0, 'LeftLoop', true);
                    } else {
                        spine.setAnimation(0, 'RightLoop', true);
                    }
                }
                if (splitSid == '03' || splitSid == '13' || splitSid == '23') {
                    endPos = cc.pAdd(endPos, cc.p(0, -80));
                }
                break;
            case DZConstant.magicType.flower:
                spineNode = cc.instantiate(this.spine_flower.node);
                this.root_node.addChild(spineNode);
                if (!spineNode.active) {
                    spineNode.active = true;
                }
                spine = spineNode.getComponent(sp.Skeleton);
                spine.setAnimation(0, 'RoseLoop', true);
                break;
        }
        spine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === completeStr) {
                spineNode.destroy();
            }
        });
        spineNode.setPosition(startPos);
        var action = cc.sequence(
            cc.moveTo(0.9, endPos),
            cc.callFunc(function () {
                switch (type) {
                    case DZConstant.magicType.good:
                        if (this.getLRBySid(startSid, endSid) == 'left') {
                            spine.setAnimation(0, 'Left', false);
                            completeStr = 'Left';
                        } else {
                            spine.setAnimation(0, 'Right', false);
                            completeStr = 'Right';
                        }
                        DZPlaySound.getInstance().playLaud();
                        break;
                    case DZConstant.magicType.shoes:
                        spine.setAnimation(0, 'Shoes', false);
                        completeStr = 'Shoes';
                        DZPlaySound.getInstance().playShoes();
                        break;
                    case DZConstant.magicType.tomato:
                        spine.setAnimation(0, 'Left1', false);
                        completeStr = 'Left1';
                        DZPlaySound.getInstance().playTomato();
                        break;
                    case DZConstant.magicType.cup:
                        if (this.getLRBySid(startSid, endSid) == 'left') {
                            spine.setAnimation(0, 'Left', false);
                            completeStr = 'Left';
                        } else {
                            let type = startSid + "" + endSid;
                            if (type == '02' || type == '20') {
                                spine.setAnimation(0, 'Left', false);
                                completeStr = 'Left';
                            } else {
                                spine.setAnimation(0, 'Right', false);
                                completeStr = 'Right';
                            }
                        }
                        DZPlaySound.getInstance().playCup();
                        break;
                    case DZConstant.magicType.flower:
                        spine.setAnimation(0, 'Rose', false);
                        completeStr = 'Rose';
                        DZPlaySound.getInstance().playFlower();
                        break;
                }
            }.bind(this))
        );
        spineNode.runAction(action);
    },

    getLRBySid: function (startSid, endSid) {
        let type = startSid + "" + endSid;
        switch (type) {
            case '01':
            case '02':
            case '03':
                return 'right';
            case '10':
            case '12':
            case '13':
                return 'left';
            case '20':
            case '21':
            case '23':
                return 'right';
            case '30':
            case '32':
                return 'left';
            case '31':
                return 'right';

        }

    }

    // update (dt) {},
});
