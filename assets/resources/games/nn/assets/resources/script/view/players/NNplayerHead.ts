import NNgameControler from "../game/NNgameControler";
import { NNConstant } from "../../common/NNConstant";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/NNplayerHead")
export default class NNplayerHead extends cc.Component {
    gameView: any;
    id: any;
    time: any;

    @property(cc.Node)
    readyNode: cc.Node = null;   //准备结点

    @property(cc.Label)
    nickName: cc.Label = null;   //名字

    @property(cc.Sprite)
    head: cc.Sprite = null;     //头像

    @property(cc.Label)
    coinNum: cc.Label = null;        //金币数

    @property(cc.Node)
    bankerNode: cc.Node = null;      //庄家标志

    @property(cc.Sprite)
    outLine: cc.Sprite = null;       //进度外框

    @property(cc.Node)
    compareLose: cc.Node = null;     //比牌输标志

    @property(cc.Node) 
    giveUp: cc.Node = null;      //放弃标志

    @property(cc.Node) 
    lookState: cc.Node = null;   //已看牌标志

    @property(cc.Node)           
    pkLeft: cc.Node = null;      //左边的pk

    @property(cc.Node)           
    pkRight: cc.Node = null;      //右边的pk

    @property(cc.Node)
    offLine: cc.Node = null;     //离线标志

    onLoad() {
    }


   /**
    * 初始化一些状态
    * 
    * @memberof NNplayerHead
    */
    initInfo(gameView) {
        this.gameView = gameView;
        this.readyNode.active = false;
        this.bankerNode.active = false;
        this.outLine.node.active = false;
        this.compareLose.active = false;
        this.giveUp.active = false;
        this.lookState.active = false;
        this.pkLeft.active = false;
        this.pkRight.active = false;
    }


    /**
     * 
     * 刷新头像信息
     * @param {*} data 
     * @memberof NNplayerHead
     */
    updatePlayerInfo(data:any) {
        cc.log("updatePlayerInfo" + JSON.stringify(data));
        //头像
        let self = this;
        // cc.loader.load(data.headimgurl, function (err, texture) {
        //     var frame = new cc.SpriteFrame(texture);
        //     self.head.spriteFrame = frame;
        // });
        //名字
        this.nickName.string = data.nickname;
        if(data.ready) {
            this.readyNode.active = data.ready;
        }else{
            this.readyNode.active = false;
        }
        this.id = data.id;

        //分数
        //this.coinNum.string = data.integral;
    }

   /**
    * 显示或隐藏进度条
    * 
    * @param {boolean} isShow 
    * @memberof NNplayerHead
    */
    showPorgerss(isShow:boolean) {
        this.outLine.node.active = isShow;
        this.node.stopAllActions();
        if(this.outLine.node.activeInHierarchy) {
            this.outLine.fillRange = 1;
            this.time = 20;
            this.schedule(this.updateOutLine,0.05)
        }else{
            this.unschedule(this.updateOutLine);
        }
    }

   /**
    * 放弃标志的显示隐藏
    * @param isShow 
    */
   showGiveUpState(isShow:boolean) {
        this.giveUp.active = isShow;
   }

   /**
    * 比牌输标志的显示隐藏
    * @param isShow 
    */
   compaiLoseState(isShow:boolean) {
       this.compareLose.active = isShow;
   }

    /**
    * 是否看牌的标志
    * @param isShow 
    */
    lookCardState(isShow:boolean) {
        this.lookState.active = isShow;
    }

     /**
     * 清除所有的状态
     * 
     * @memberof NNplayerHead
     */
    clearAllStates() {
        this.lookCardState(false);
        this.compaiLoseState(false);
        this.showGiveUpState(false);
        this.showPorgerss(false);
        this.compareLose.active = false;
    }

    /**
     * 
     * 头像进度条
     * @memberof NNplayerHead
     */
    updateOutLine(dt) {
        this.outLine.fillRange = this.time/20;
        this.time -= dt;
        if(this.time <= 0) {
            this.unschedule(this.updateOutLine);
            this.outLine.node.active = false;
            this.shakeEffect();
        }
    }

    shakeEffect() {
        this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.4, 1.02, 1.02),
                    cc.scaleTo(0.3, 0.97, 0.97)
                )
            )
        )
    }

    /**
     * 摧毁头像时调用
     * 
     * @memberof NNplayerHead
     */
    onDestroy() {
       this.unschedule(this.updateOutLine);
    }

    /**
     * 显示或隐藏庄家标志
     * 
     * @param {boolean} isBanker 
     * @memberof NNplayerHead
     */
    showBankerState(isBanker:boolean) {
        this.bankerNode.active = isBanker;
    }

    /**
     * 
     * 刷新分数
     * @param {number} score 
     * @memberof NNplayerHead
     */
    updateScore(score:number) {
       this.coinNum.string = score + '';
    }

    /**
     * 
     * 准备的显示隐藏
     * @param {boolean} isReady 
     * @memberof NNplayerHead
     */
    showReadyState(isReady:boolean) {
       this.readyNode.active = isReady;
    }

    /**
     * 标记离线状态
     * 
     * @param {any} isShow 
     * @memberof NNplayerHead
     */
    showOffLineState(isShow) {
        this.offLine.active = isShow;
    }
}


