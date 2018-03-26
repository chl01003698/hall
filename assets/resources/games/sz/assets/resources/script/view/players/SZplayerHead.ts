import SZgameControler from "../game/SZgameControler";
import { SZConstant } from "../../common/SZConstant";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZplayerHead")
export default class SZplayerHead extends cc.Component {
    alarmTimer: cc.Action;
    gameView: any;
    id: any;
   time:any;

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

   @property(cc.Node) 
   coinNode: cc.Node = null;    //金币节点

   @property(cc.Node)           
   guanzhanNode: cc.Node = null;    //观战中
   
   @property(cc.Node)
   headMask: cc.Node = null;        //头像蒙板

   onLoad() {
   }


   /**
    * 初始化一些状态
    * 
    * @memberof SZplayerHead
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
     * @memberof SZplayerHead
     */
    updatePlayerInfo(data:any) {
        cc.log("updatePlayerInfo" + JSON.stringify(data));
        //头像
        let self = this;
        if (data.headimgurl) {
            HallUIUtil.urlSprite(data.headimgurl, this.head.node);
        }
        //名字
        this.nickName.string = data.nickname;
        if(data.ready) {
            this.readyNode.active = data.ready;
        }else{
            this.readyNode.active = false;
        }
        this.id = data.id;

        if(data.watcher) {
            this.showGuanzhan(true);
        }else {
            this.showGuanzhan(false);
        }
        
    }



   /**
    * 显示或隐藏进度条
    * 
    * @param {boolean} isShow 
    * @memberof SZplayerHead
    */
   showPorgerss(isShow:boolean) {
        this.outLine.node.active = isShow;

        if(this.outLine.node.activeInHierarchy) {
            this.outLine.fillRange = 1;
            this.time = 25;
            this.alarmTimer = HallUtil.schedule(function () {
                this.updateOutLine();
            }.bind(this), this.node, 0.05, true);
        }else{
            if(this.alarmTimer) {
                this.node.stopAction(this.alarmTimer);
                this.node.stopAllActions();
            }
        }


   }

   /**
    * 放弃标志的显示隐藏
    * @param isShow 
    */
   showGiveUpState(isShow:boolean) {
        this.giveUp.active = isShow;
        if(isShow) {
            this.lookCardState(false);
        }
   }

   /**
    * 比牌输标志的显示隐藏
    * @param isShow 
    */
   compaiLoseState(isShow:boolean) {
       this.compareLose.active = isShow;

       if(isShow) {
        this.lookCardState(false);
    }
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
     * @memberof SZplayerHead
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
     * @memberof SZplayerHead
     */
    updateOutLine() {
        this.outLine.fillRange = this.time/25;
        this.time -= 0.1;
        if(this.time <= 0) {
            this.node.stopAction(this.alarmTimer);
            //this.unschedule(this.updateOutLine); 
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
     * @memberof SZplayerHead
     */
    onDestroy() {
        if(this.alarmTimer) {
            this.node.stopAction(this.alarmTimer);
            this.node.stopAllActions();
        }
        //this.unschedule(this.updateOutLine); 
   }

    /**
     * 显示或隐藏庄家标志
     * 
     * @param {boolean} isBanker 
     * @memberof SZplayerHead
     */
    showBankerState(isBanker:boolean) {
        this.bankerNode.active = isBanker;
   }

    /**
     * 
     * 刷新分数
     * @param {number} score 
     * @memberof SZplayerHead
     */
    updateScore(score:number) {
       this.coinNum.string = score + '';
   }

    /**
     * 
     * 准备的显示隐藏
     * @param {boolean} isReady 
     * @memberof SZplayerHead
     */
    showReadyState(isReady:boolean) {
       this.readyNode.active = isReady;
   }

    /**
     * 显示pk按钮
     * 
     * @param {*} index 
     * @memberof SZplayerHead
     */
    showPkBtn(index:any,isShow:boolean) {
       if(index == 1 || index == 2) {
            this.pkRight.active = isShow;
       }else{
            this.pkLeft.active = isShow;
       }
   }

    /**
     * 隐藏所有的pk按钮
     * 
     * @memberof SZplayerHead
     */
    hidePKBtn() {
        this.pkLeft.active = false;
        this.pkRight.active = false;
   }

    /**
     * 把pk按钮隐藏掉
     * 
     * @memberof SZplayerHead
     */
    showPkBtnHide() {
       this.pkLeft.active = false;
       this.pkRight.active = false;
   }

    /**
     * 点击pk
     * 
     * @memberof SZplayerHead
     */
    onPkclick() {
        SZgameControler.input(SZConstant.inputState.compare,this.id);
        this.gameView.playersControl.hideAllPkBtn();
        this.gameView.uiNode_slectPkPlayer.getComponent('SZSelectPlayers').over();
   }
    /**
     * 标记离线状态
     * 
     * @param {any} isShow 
     * @memberof SZplayerHead
     */
    showOffLineState(isShow) {
        this.offLine.active = isShow;
   }


   //设置观战中还是游戏中
   showGuanzhan(isGuanzhan) {
       this.guanzhanNode.active = isGuanzhan;
       this.headMask.active = isGuanzhan;
       this.coinNode.active = ! isGuanzhan;
   }
}


