import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { NNConstant } from "../../common/NNConstant";
import { NNGameUtil } from "../../common/NNGameUtil";
import NNgameModel from "./NNgameModel";
import readyBtn from "../gameUI/NNreadyBtn";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import NNgameControler from "./NNgameControler";
import NNplayerControl from "../players/NNplayerControl";
import NNLootZhuangBtns from "../gameUI/NNLootZhuangBtns";
import NNBottomPourBtns from "../gameUI/NNBottomPourBtns";
import NNpokersControl from "./NNpokersControl";
import NNPeiPaiLogic from "../gameUI/NNPeiPaiLogic";
import NNStatisticLayer from "../result/NNStatisticLayer";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import { h } from "../../../../../../../script/common/H";
import { NNHallController } from "../hall/NNHallController";
import { DZDismissController } from "../../../../../../dz/assets/resources/script/view/game/dismiss/DZDismissController";
/**
 * @export
 * @class NNgameView
 * @extends {HallBaseView}
 */
export default class NNgameView extends HallBaseView {
    timeLabel: cc.Label;
    readyBtnControl: readyBtn;
    playersControl: NNplayerControl;    //所有头像控制脚本
    lootZhuangBtns: NNLootZhuangBtns;
    bottomPourBtns: NNBottomPourBtns;
    peiPaiLogic: NNPeiPaiLogic;
    UIControl: any;     //游戏中按钮控制
    pokerControl:NNpokersControl;   //扑克控制脚本

    players_contol: cc.Node;
    readyBtnNode: cc.Node;
    lootZhuangBtnLayer: cc.Node;
    bottomPourBtnLayer: cc.Node;
    peiPaiBtnLayer: cc.Node;
    tableId: cc.Node;
    inningNum: cc.Node;
    uiNode_btn: cc.Node;
    bj: cc.Node;
    jettonArea: cc.Node;
    pai_control: cc.Node;
    effect_layer: cc.Node;
    bipaiEffect: cc.Node;
    budgetEffect: cc.Node;
    startAnimation: cc.Node;
    time_tip: cc.Node;
    uiNode_hotFight: cc.Node;

    // 倒计时时钟相关
    clock:cc.Node;
    clockNum:cc.Node;
    clockTip:cc.Node;
    labClockTip:cc.Label;
    labClockNum:cc.Label;
    clockTick:number;

    constructor(){
        super();
        this.setBindDatas({
            uiNode_touxing:{varName:"players_contol"},
            uiNode_zhunbei:{varName:"readyBtnNode"},    //准备界面的按钮
            uiNode_qiangzhuang:{varName:"lootZhuangBtnLayer"},    //抢庄的按钮
            uiNode_xiazhu:{varName:"bottomPourBtnLayer"},    //下注的按钮
            uiNode_peipai:{varName:"peiPaiBtnLayer"},    //有牛无牛的按钮
            zhuohao:{varName:"tableId"},    //房间id
            jushu:{varName:"inningNum"},    //局数
            uiNode_btn:{varName:"uiNode_btn"},       //ui上面所有的按钮
            bj:{varName:"bj"},
            jettonArea:{varName:'jettonArea'},
            effect_layer:{varName:'effect_layer'},
            pai_control:{varName: 'pai_control'},
            bipaiEffect:{varName: 'bipaiEffect'},
            budgetEffect:{varName:'budgetEffect'},
            startAnimation: {varName: 'startAnimation'},
            time_tip: {varName: 'time_tip'},
            uiNode_hotFight: {varName:'uiNode_hotFight'},       //火拼动画

            clock:{varName:'clock'},
            clockNum:{varName:'clockNum'},
            clockTip:{varName:'clockTip'},
            zhanji:{callback:this.fightReportCallback.bind(this)},
        });
        this.setPrefab("res/prefab/game/game")
        this.labClockTip = this.clockTip.getComponent(cc.Label)
        this.labClockNum = this.clockNum.getComponent(cc.Label)
    }

    onPrefabLoaded() {
        let data = NNgameModel.getInstance().getRestoreGameInfo();
        if(data) {
            NNgameModel.getInstance().setTableData(data);
            this.storeUpdateViewInfo(data);
        }else {
            data = NNgameModel.getInstance().getTableData();
            this.updateViewInfo(data);
        }
        this.showTimeClock();
    }

     /**
      * 刷新时间
      * 
      * @memberof NNgameView
      */
     showTimeClock() {
        this.timeLabel = this.time_tip.getComponent(cc.Label);
        this.timeLabel.string = NNGameUtil.getHourAndMinites();
        HallUtil.schedule(function () {
            this.timeLabel.string = NNGameUtil.getHourAndMinites();
        }.bind(this), this, 10, true);
    }

    /**
     * 
     * 设置火拼的显示隐藏
     * @param {any} isshow 
     * @memberof NNgameView
     */
    sethotFightActive(isshow) {
        this.uiNode_hotFight.active = isshow;
    }

    /**
     * 断线重连走这块
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    storeUpdateViewInfo(data: any) {
        if(data) {
            this.initGameComponent();
            this.changeCloth(NNConstant.clothColor.red);
            this.changeReadyOrGame(NNConstant.gameState.ready);

            NNGameUtil.tableId = data.roomId;
            NNGameUtil.playerNum = data.playerCount;
            NNGameUtil.serverSeatId = data.index;

            this.updateRoundNum(data.currentRound + 1,data.roomConfig.roundCount);
            this.tableId.getComponent(cc.Label).string = '桌号: ' + data.roomId;

            let readyNum = 0;
            //已有头像显示
            if(data.gamePlayers) {
                for(let i = 0; i < data.gamePlayers.length;i++) {
                    let playerInfo = data.gamePlayers[i];
                    let seatId = NNGameUtil.toLocalSeatId(playerInfo.index);
                    this.playersControl.updatePlayerInfo(seatId, playerInfo);
                    let localSeatId = NNGameUtil.toLocalSeatId(data.gamePlayers[i].index);
                    if(localSeatId == 0) {
                        if(data.gamePlayers[i].ready) {
                            this.readyBtnControl.setreadyState(false);
                        }else {
                            readyNum = -10;     //如果自己没有准备，不让开始变亮
                        }
                    }
                    if(data.gamePlayers[i].ready) {
                        readyNum ++;
                    }
                }
            }

            cc.log('updateViewInfo' + readyNum);
        }
    }


    /**
     * 从无到有刷新一些界面
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    updateViewInfo(data: any) {
        if(data) {
            this.initGameComponent();
            this.changeCloth(NNConstant.clothColor.red);
            this.changeReadyOrGame(NNConstant.gameState.ready);

            NNGameUtil.tableId = data.roomId;
            NNGameUtil.playerNum = data.playerCount;
            NNGameUtil.serverSeatId = data.index;

            this.updateRoundNum(data.currentRound + 1,data.roomConfig.roundCount);
            this.tableId.getComponent(cc.Label).string = '桌号: ' + data.roomId;

            if (data.roomId) {
                NNGameUtil.ownerId = data.ownerId;
                //已有头像显示
                if(data.gamePlayers) {
                    for(let i = 0; i < data.gamePlayers.length;i++) {
                        let playerInfo = data.gamePlayers[i];
                        let seatId = NNGameUtil.toLocalSeatId(playerInfo.index);
                        this.playersControl.updatePlayerInfo(seatId, playerInfo);
                        h.log.debug("%%%..playerInfo.id=" + playerInfo.id + " playerInfo=" + playerInfo);
                        NNgameModel.getInstance().setPlayerData(playerInfo.id, playerInfo);
                        h.log.debug("playerInfo=====================end,seatId=" + seatId);
                    }
                }
            }
        }
    }

    /**
     * 更新局数
     * 
     * @param {any} currentRound 
     * @param {any} roundCount 
     * @memberof NNgameView
     */
    updateRoundNum(currentRound,roundCount) {
        this.inningNum.getComponent(cc.Label).string = '局数: ' + currentRound +'/' + roundCount;
    }


    otherJoin(data: any) {
        let seatId = NNGameUtil.toLocalSeatId(data.gamePlayer.index);
        if (this.playersControl) {
            this.playersControl.updatePlayerInfo(seatId, data.gamePlayer);
        }
    }

    /**
     * 初始化一些组件
     * 
     * @memberof NNgameView
     */
    initGameComponent() {
        this.UIControl = this.uiNode_btn.getComponent('NNUIBtn');
        this.UIControl.initView(this);

        this.lootZhuangBtns = this.lootZhuangBtnLayer.getComponent('NNLootZhuangBtns');
        this.bottomPourBtns = this.bottomPourBtnLayer.getComponent('NNBottomPourBtns');
        this.playersControl = this.players_contol.getComponent('NNplayerControl');
        this.pokerControl = this.pai_control.getComponent('NNpokersControl');
        this.readyBtnControl = this.readyBtnNode.getComponent('NNreadyBtn');
        this.peiPaiLogic = this.peiPaiBtnLayer.getComponent('NNPeiPaiLogic');

        this.lootZhuangBtns.initView(this.lootZhuangBtnLayer);
        this.bottomPourBtns.initView(this.bottomPourBtnLayer);
        this.playersControl.initPlayers(this);
        this.pokerControl.initPlayersPoker(this);
        this.readyBtnControl.initView();
        this.peiPaiLogic.initView(this.peiPaiBtnLayer, this.pokerControl);
    }

    /**
     * 
     * 切换桌布
     * @memberof NNgameView
     */
    changeCloth(type) {
        if(type == NNConstant.clothColor.red) {
            this.bj.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("games/nn/assets/resources/res/images/nopack/desk_bj",cc.SpriteFrame);
            this.tableId.color = cc.color(255,65,33);
            this.inningNum.color = cc.color(255,65,33);
        }else {
            this.bj.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("games/nn/assets/resources/res/images/nopack/desk_bj2",cc.SpriteFrame);
            this.tableId.color = cc.color(28,58,194);
            this.inningNum.color = cc.color(28,58,194);
        }
    }

    /**
     * 切换游戏和准备界面
     * 
     * @param {any} type 
     * @memberof NNgameView
     */
    changeReadyOrGame(type) {
        if(type == NNConstant.gameState.game) {
            this.readyBtnNode.active = false;
            this.playersControl.resetMyPosition(true);
            this.pokerControl.node.active = true;
            this.playersControl.showReadyState(0,false,true);
        }else {
            this.readyBtnNode.active = true;
            this.playersControl.resetMyPosition(false);
            this.pokerControl.node.active = false;
        }
    }

    /**
     * 战报
     */
    fightReportCallback(){
        NNgameControler.getResult();
    }

    /**
     * 随机一个筹码扔到牌桌的位置
     * 
     * @returns 
     * @memberof NNgameView
     */
    produceRandomPos() {
        let rWidth =  NNGameUtil.randomFromZero(this.jettonArea.width);
        let rHeight = NNGameUtil.randomFromZero(this.jettonArea.height);

        return cc.p(this.jettonArea.x + rWidth,this.jettonArea.y + rHeight);
    }

    /**
     * 准备状态的显示与隐藏
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    setReadyState(data:any) {
        let seatId = NNGameUtil.toLocalSeatId(data.index);
        this.playersControl.showReadyState(seatId,true,false);
    }

    /**
     * 准备状态的显示与隐藏
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    setUnreadyState(data:any) {
        let seatId = NNGameUtil.toLocalSeatId(data.index);
        this.playersControl.showReadyState(seatId,false,false);
    }

    /**
     * 游戏倒计时
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onCountDown(data:any) {
        this.clock.active = true
        this.clockTick = data.sec
        this.clockTip.active = true
        this.labClockTip.string = '123123123'

        this.stopActionByTag(NNConstant.actionTag.ClockCountDown)
        this.stopActionByTag(NNConstant.actionTag.ClockCountDownOver)

        HallUtil.schedule(function () {
            this.labClockNum.string = --this.clockTick
        }.bind(this), this, 1, true, NNConstant.actionTag.ClockCountDown)

        HallUtil.schedule(function () {
            this.clockTick = 0
            this.clock.active = false
        }.bind(this), this, this.clockTick, false, NNConstant.actionTag.ClockCountDownOver)
    }

    /**
     * 发牌
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onOutput(data:any) {
        this.changeReadyOrGame(NNConstant.gameState.game);
        this.pokerControl.updatePokerView(data)
    }

    /**
     * 看牌
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onScanCard(data:any) {
        let idx = NNGameUtil.toLocalSeatId(data.index)
        this.pokerControl.flipPokers(idx, data.cards)
    }

    /**
     * 配牌
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onMatchCard(data:any) {
        this.bottomPourBtnLayer.active = false
        this.peiPaiBtnLayer.active = true
        this.pokerControl.canClick = true
    }

    /**
     * 展示牌
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onShowCard(data:any) {
        this.peiPaiBtnLayer.active = false
        this.pokerControl.showResult(data)
    }

    /**
     * 开始抢庄
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onLootZhuang(data:any) {
        this.lootZhuangBtnLayer.active = true
    }

    /**
     * 确定庄家
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onSetZhuang(data:any) {
        this.lootZhuangBtnLayer.active = false
        // data.zhuangIdx
        let bankerLocalSeatId = NNGameUtil.toLocalSeatId(data.zhuangIdx);
        NNgameModel.getInstance().zhuangSeatId = bankerLocalSeatId
        this.playersControl.showBankerState(bankerLocalSeatId);
    }

    /**
     * 开始下注
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onBottomPour(data:any) {
        if (NNgameModel.getInstance().zhuangSeatId != 0) {
            this.bottomPourBtnLayer.active = true
        }
    }

    /**
     * 一局结束
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onRoundOver(data:any) {
        this.pokerControl.showScore(data)
        this.resetStates()
    }

    /**
     * 游戏结束
     * 
     * @param {*} data 
     * @memberof NNgameView
     */
    onGameOver(data:any) {
        let prefab = cc.loader.getRes("games/nn/assets/resources/res/prefab/jiesuan/jiesuan", cc.Prefab)
        let layer : NNStatisticLayer = cc.instantiate(prefab).getComponent('NNStatisticLayer')
        HallUIUtil.adaptive(layer.node)
        layer.setData(data)
        this.addChild(layer.node, 100)
    }
    
    /**
     * 重直状态
     * 
     * @memberof NNgameView
     */
    resetStates() {
        this.effect_layer.removeAllChildren();
        this.changeReadyOrGame(NNConstant.gameState.ready);
        this.readyBtnControl.setreadyState(true);
        this.playersControl.clearAllStates();
        this.pokerControl.clearAllStates();
        this.peiPaiLogic.reset();

        this.lootZhuangBtnLayer.active = false;
        this.bottomPourBtnLayer.active = false;
        this.peiPaiBtnLayer.active = false;
    }

    /**
     * 收到退出广播
     */
    receive_quitGame_data(data) {
        h.log.debug("receive_quitGame_data收到退出广播-->" + JSON.stringify(data));
        if (data.uid) {
            let serverSeatId: number = NNgameModel.getInstance().getSeverSeatId(data.uid);
            if (serverSeatId >= 0) {
                let leaveSeatId = NNGameUtil.toLocalSeatId(serverSeatId);
                //隐藏这个用户
                this.players_contol
                this.playersControl.hidePlayer(leaveSeatId);
                //自己收到退出消息后 返回到大厅
                if (leaveSeatId == 0) {
                    h.log.debug("自己收到退出消息后 返回到大厅")
                    h.viewManager.removeView(this)
                    NNHallController.showHallView()
                }
            }
        }
    }

    //收到解散房间推送，开始显示解散界面
    receive_dismiss_notify_data(data) {
        h.log.debug("收到解散房间推送，开始显示解散界面-->" + JSON.stringify(data));
        DZDismissController.showDismissView();
    }

    //收到别人投票，刷新显示界面
    receive_dismiss_refresh_data(data) {
        h.log.debug("收到别人投票，刷新显示界面-->" + JSON.stringify(data));
        DZDismissController.refreshDismissView();
    }

    //收到解散结果，做下一步处理
    receive_dismiss_result_data(data) {
        h.log.debug("收到解散结果，做下一步处理-->" + JSON.stringify(data));
        DZDismissController.dealDismissResult();
    }
}
