import { HallDismissController } from './../../../../../../../script/view/dismiss/HallDismissController';
import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { DZGameUtil } from "../../common/DZGameUtil";
import MyButton from "../../../../../../../script/component/MyButton";
import { DZConstant } from "../../common/DZConstant";
import { DZGameController } from "./DZGameController";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { HallModel } from "../../../../../../../script/view/hall/HallModel";
import { DZGameModel } from "./DZGameModel";
import { CreateModel } from "../../createTable/DZCreateModel";
import { HallToast } from "../../../../../../../script/common/HallToast";
import { DZSingleBattleReportController } from "../singleBattleReport/DZSingleBattleReportController";
import { DZBattleReportModel } from "../battleReport/DZBattleReportModel";
import { DZPlaySound } from "./sound/DZPlaySound";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { DZjiesuanController } from "../../jiesuan/DZjiesuanController";
import { DZDismissController } from "./dismiss/DZDismissController";
import { DZjiesuanModel } from "../../jiesuan/DZjiesuanModel";
import { DZChatCommonController } from "../chatCommon/DZChatCommonController";
import { DZChatCommonModel } from "../chatCommon/DZChatCommonModel";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { DZSetController } from "../set/DZSetController";
import { DZBattleReportController } from "../battleReport/DZBattleReportController";
import { DZGameRuleController } from "../gameRule/DZGameRuleController";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import { DzShowRuleView } from "./rule/DzShowRuleView";
import { DzShowRuleController } from "./rule/DzShowRuleController";
import { DZHallController } from "../hall/DZHallController";
import { HallGameView } from '../../../../../../../script/view/game/HallGameView';
import { HallAlert } from '../../../../../../../script/common/HallAlert';
import { HallViewConfig } from '../../../../../../../script/config/HallViewConfig';
var CardRule = require('CardRule');
/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-17 13:47:10 
 * @Desc: 大厅界面
 */

export class DZGameView extends HallGameView {
    jipai_control: any;
    jipaiHide: boolean;
    jipaiqiNode: any;
    jipaiqi: any;
    jipaiqiState: boolean;
    cardTypeSelect: any;
    xingpai: cc.Node;
    tipIndex: number;
    players_Panel: any;
    effect_layer: any;
    //spine动画控制器
    spineControl: cc.Component = null;
    //用户信息控制器
    playerPanel: cc.Component = null;
    //按钮控制器
    control_button: cc.Component = null;
    //打牌控制器
    player_control: cc.Component = null;
    //上一家打的牌
    topPokers: any = [];
    //
    cardType: string = "";
    //
    playType: string = "";

    constructor() {
        super();
        this.addBindDatas({
            //冒号之前的是预制体中的名字（必须一致），varName是在当前类中的变量名称
            "playControl": { varName: "playControl" },//打牌控制器
            "xingpai": { varName: "xingpai" },//按钮
            "dismiss_table": { varName: "dismiss_table" },//解散房间
            "table_num": { varName: "table_num" },//桌号
            "round_num": { varName: "round_num" },//局数
            "uiNode_effect_layer": { varName: "effect_layer" },//
            "uiNode_playersPanel": { varName: "players_Panel" },//
            "di_zuo": { varName: "dipai_kuang" },//底牌框 
            "wanfa": { varName: "wanfa" },//玩法
            "beiLayout": { varName: "beiLayout" },//
            "dipai_beishu": { varName: "dipai_beishu" },//底牌倍数整体
            "bei_num": { varName: "bei_num" },//底牌加倍倍数
            "jiabei_tip": { varName: "jiabei_tip" },//加倍提示整体
            "jiabei_number": { varName: "jiabei_number" },//加倍提示
            "pokerslayout": { varName: "pokerslayout" },//
            "siRendipai": { varName: "siRendipai" },//
            "layoutsiren": { varName: "layoutsiren" },//
            "pai_3": { varName: "pai_3" },//
            "cardTypeSelect": { varName: "cardTypeSelect" },
            "uiNode_ready_layer": { varName: "ready_layer" },//
            "uiNode_game_layer": { varName: "game_layer" },// 
            "laiziNode_card": { varName: "laiziNode_card" },//底牌上的癞子
            "laizhi_tip": { varName: "laizhi_tip" },//癞子确定中的提示
            "td_laizhi_tip": { varName: "td_laizhi_tip" },//天地癞子图片提示
            "waiting_multiple": { varName: "waiting_multiple" },//显示加倍不加倍按钮时 的提示其它玩家加倍中
            "jipaiqiNode": { varName: "jipaiqiNode" },
            "back": { varName: "back", callback: this.quitGame.bind(this) },//退出
            "zhanji": { varName: "zhanji", callback: this.gameZhanJi.bind(this) },//游戏内战绩
            "guize": { varName: "guize", callback: this.gameGuiZe.bind(this) },//规则
            "shezhi": { varName: "shezhi", callback: this.gameSheZhi.bind(this) },//设置
            "liaotian": { varName: "liaotian", callback: this.gameLiaoTian.bind(this) },//聊天
            "jipaiqi/qi": { varName: "jipaiqi", callback: this.onClickJIpaiqi.bind(this) },//记牌器
            //"whole_bg_button": { varName: "whole_bg_button", callback: this.blank_click.bind(this) },//底部统一放的，点击空白后牌都下来
            "player0": { varName: "player0" },
            "player1": { varName: "player1" },
            "player2": { varName: "player2" },
            "player3": { varName: "player3" },
            //"yuyin": { varName: "yuyin" },
            "pokersView": { varName: "pokersView" },//手牌区 

        });
        this.setPrefab("res/prefab/game/ddz_game");
        var whole_bg_button = cc.find("ddz_game/uiNode/whole_bg_button", this);
        whole_bg_button.on(cc.Node.EventType.TOUCH_END, this.blank_click.bind(this));

    }

    //加载view完成
    onPrefabLoaded() {
        super.onPrefabLoaded();
        //从游戏model中取数据初始化界面
        h.log.debug("DZGameView-->onPrefabLoaded");
        DZGameUtil.UIBgScale = HallViewConfig.getUIBgScale();
        //this.onGameEnter();
        //添加本地
        this.addAllEventListen();
        DZGameUtil.game_status = DZConstant.gameProgress.table;
        let data = DZGameModel.getInstance().getRestoreGameInfo();
        if (data) {
            h.log.debug("取断线重连的数据" + JSON.stringify(data));
            //把断线重连的数据保存到model中
            DZGameModel.getInstance().setTableData(data);
        } else {
            h.log.debug("取正常创建和加入的数据" + JSON.stringify(data));
            data = DZGameModel.getInstance().getTableData();
        }
        this.onGameEnter(data);
    }

    private addAllEventListen() {
        //添加按钮显示变亮的监听
        //h.eventManager.addListener(DZConstant.EventName.BtnStateChange, this.update_sendBtn, this);
        //h.eventManager.addListener(DZConstant.dataType.otherJoin, this.otherJoin, this);
    }

    private removeAllEventListion() {
        cc.log('removeAllEventListion');
        //h.eventManager.removeListener(DZConstant.EventName.BtnStateChange, this.update_sendBtn, this);
        //h.eventManager.removeListener(DZConstant.dataType.otherJoin, this.otherJoin, this);
    }

    dismissDeal() {
        //this.removeAllEventListion();
    }

    //添加行牌按钮
    private addXingPaiBtn(type, action = {}) {
        if (type == DZConstant.buttonType.sendCard || type == DZConstant.buttonType.play || type == DZConstant.buttonType.notSendCard) {
            DZGameUtil.buttonType = type;
        }
        this.control_button.initButton(this.control_button.getButtonByType(type));
        cc.log('addXingPaiBtn  ' + type + "ction  " + JSON.stringify(action));
        if (type == "callPoints") {
            this.control_button.setButtonActive(action.landOwer);
        }
    }

    /**
    * 显示gameLayer
    */
    public showGameLayer(blnShow: boolean) {
        this.game_layer.active = blnShow;
        this.ready_layer.active = !blnShow;
        if (blnShow) {
            this.updateDiPaiPanelPos();
        }
    }

    private onGameEnter(data: any) {
        h.log.debug("DZGameModel-->onGameEnter=" + JSON.stringify(data));
        //保存用户数据,重连的时候不走gamePlayerJoin_，所以这里保存一下
        if (data.gamePlayers) {
            for (let i = 0; i < data.gamePlayers.length; i++) {
                let playerInfo = data.gamePlayers[i];
                DZGameModel.getInstance().setPlayerData(playerInfo.id, playerInfo);
            }
        }
        //初始化组件控制器
        this.initGameComponent();
        //根据游戏状态显示和隐藏
        this.showGameLayer(false);

        //显示准备按钮
        if (!data.isReplay) {
            let data = DZGameModel.getInstance().getRestoreGameInfo();
            if (!data) {
                this.addXingPaiBtn(DZConstant.buttonType.ready);
            }
        }
        this.updateViewInfo(data);
        h.audioManager.stopBGM();
        h.audioManager.playMGBByName('youxizhong');
    }
    //有人加入房间
    private otherJoin(data: any) {
        h.log.debug("DZGameModel-->otherJoin=" + JSON.stringify(data));
        let seatId = DZGameUtil.toLocalSeatId(data.gamePlayer.index);
        if (this.playerPanel) {
            this.playerPanel.updatePlayerInfo(seatId, data.gamePlayer);
        }
    }

    private initGameComponent() {
        h.log.debug("DZGameView-->initGameComponent初始化空间");
        h.log.debug("xingpai=");
        //h.log.logObj(this.xingpai);
        this.spineControl = this.effect_layer.getComponent('SpineControl');
        this.playerPanel = this.players_Panel.getComponent('DZPlayersPanel');
        this.control_button = this.xingpai.getComponent('control_button');
        this.player_control = this.playControl.getComponent("controller_panel");
        this.jipai_control = this.jipaiqiNode.getComponent("jipaiqi");
        h.log.debug("spineControl=", this.spineControl);
        h.log.debug("playerPanel=", this.playerPanel);
        h.log.debug("control_button=", this.control_button);
        h.log.debug("player_control=", this.player_control);


        this.playerPanel.initPlayers();
        this.spineControl.showAnimaiton();

        this.topPokers = [];
        this.cardType = "";

    }


    /**
     * 返回头像控制层
     */
    getPlayerPanel() {
        return this.playerPanel;
    }


    //返回扑克控制层
    getPokerControl() {
        return this.player_control;
    }

    //更新界面信息
    private updateViewInfo(data: any) {
        //刷新头像信息，显示按钮
        //上面显示底牌的框的位置
        //显示规则
        //显示玩法名字
        //调用示例
        //显示时间
        //更新游戏中牌的信息
        //游戏和结算中，隐藏已准备图片,
        //显示牌数
        //显示当前该谁打牌
        //显示地主牌
        //上一家打的牌
        //显示自己的牌和打出去的牌，
        cc.log('updateViewInfo' + JSON.stringify(data));
        if (data) {
            this.cleanAllPoker();
            this.player_control.clearAllDiscard();
            DZGameUtil.playType = data.roomConfig.type;
            DZGameUtil.tableId = data.roomId;
            DZGameUtil.remaining = data.roomConfig.remaining;
            DZGameUtil.playerNum = data.playerCount;
            DZGameUtil.sendCards = data.roomConfig.sendCards;
            DZGameUtil.showCard = data.roomConfig.showCard;
            if (data.index) {
                //正常打牌传回的自己在服务器上的桌位号
                //这个index服务器返回的不准，循环遍历取
                DZGameUtil.serverSeatId = data.index;
                if (data.gamePlayers) {
                    for (let i = 0; i < data.gamePlayers.length; i++) {
                        if (data.gamePlayers[i].id == HallUserModel.getInstance().getUserID()) {
                            DZGameUtil.serverSeatId = data.gamePlayers[i].index;
                            break;
                        }
                    }
                }
            } else {
                //回放的时候用的，服务器返回的数据没有桌位号，只能循环去取
                if (data.gamePlayers) {
                    for (let i = 0; i < data.gamePlayers.length; i++) {
                        if (data.gamePlayers[i].id == HallUserModel.getInstance().getUserID()) {
                            DZGameUtil.serverSeatId = data.gamePlayers[i].index;
                            break;
                        }
                    }
                }

            }
            //4人，调整头像布局和打牌区位置
            //h.log.logObj(this.player0);
            if (DZGameUtil.playType == DZConstant.playType.ddz4) {
                // this.yuyin.x = 509;
                // this.yuyin.y = -114;
                //.right = 93
                // this.liaotian.x = 600;
                // this.liaotian.y = -114;
                //.right = 2
                this.dipai_beishu.x = 0;
                this.pokersView.x = 0;
            }
            // h.log.logObj(this.player0);
            let currentRound: string = String(data.currentRound + 1);
            let roundCount: string = String(data.roomConfig.roundCount);
            this.updateRoundNum(currentRound, roundCount);
            //向牌算法发送数据
            CardRule.setPlayConfig(data.roomConfig, data.roomConfig.type);

            //记牌器状态
            let paiPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/youxizhong", cc.SpriteAtlas);
            this.jipaiqiState = DZGameModel.getInstance().getJipaiqiStates();
            this.jipaiHide = false;
            this.jipaiqiNode.active = false;
            if (this.jipaiqiState) {
                this.jipaiqi.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame("zhuomian_icon_jipaiqi");
            } else {
                this.jipaiqi.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame("zhuomian_icon_jipaiqi02");
            }
            //this.jipaiqi.active = false;
            if (data.JiPaiQi || data.JiPaiQI) {
                this.jipaiqi.active = true;
                this.jipaiqiNode.active = true;
                this.jipai_control.updateView(data.JiPaiQi);
            }

            this.showGameWanfa();
            this.updateDiPaiPanelPos();

            if (data.roomId) {
                DZGameUtil.ownerId = data.ownerId;
                if (data.roomId) {
                    this.updateZhuoHao(data.roomId);
                }
                if (data.gamePlayers) {
                    for (let i = 0; i < data.gamePlayers.length; i++) {
                        let playerInfo = data.gamePlayers[i];
                        let seatId = DZGameUtil.toLocalSeatId(playerInfo.index);
                        this.playerPanel.updatePlayerInfo(seatId, playerInfo);
                        //房主标记
                        // if (data.ownerId) {
                        //     if (data.ownerId == playerInfo.id) {
                        //         let ownerSeatId = DZGameUtil.toLocalSeatId(playerInfo.index);
                        //         this.playerPanel.showOwnerStatus(ownerSeatId);
                        //     }
                        // }
                        h.log.debug("%%%..playerInfo.id=" + playerInfo.id + " playerInfo=" + playerInfo);
                        DZGameModel.getInstance().setPlayerData(playerInfo.id, playerInfo);
                        h.log.debug("playerInfo=====================end,seatId=" + seatId);
                    }
                }
            }
            this.recovery_game_status(data);
        }
    }

    //恢复游戏状态
    recovery_game_status(data: any) {
        this.show_dipai_beishu(data);
        this.cleanAllPoker();
        this.tipIndex = 0;
        if (data.action && data.action.state && data.action.state == 'sendCard') {
            this.topPokers = [];
        } else {
            if (data.lastCards) {
                this.topPokers = data.lastCards;
            }
        }

        if (data.type) {
            this.cardType = data.type;
        }
        if (data.state == "ready" || data.state == "init" || data.state == "showCards") {
            if (data.currentRound > 0) {
                this.showGameLayer(true);
            } else {
                this.showGameLayer(false);
            }

        } else {
            this.showGameLayer(true);
        }
        //显示自己的手牌
        if (data.cards) {

            //收到发牌通知 断线重连进来不播放发牌动画
            this.player_control.initView(data.cards, function () {

            }, this, true);
        }
        //明牌
        if (data.showCards && data.zhuangId) {
            for (let i = 0; i < data.showCards.length; i++) {
                let seateId = DZGameUtil.toLocalSeatId(data.showCards[i].sid);
                this.playerPanel.showMingPokers(seateId, data.showCards[i].cards);
            }
        }
        //所有玩家的牌
        if (data.playerInfos) {
            this.playerPanel.initAllPokersNum(17);
            for (let i = 0; i < data.playerInfos.length; i++) {
                let singerPlayerInfo = data.playerInfos[i];
                //自己座位号
                let myServerSeatId = singerPlayerInfo.sid;
                let myLocalSeatId = DZGameUtil.toLocalSeatId(myServerSeatId);
                //更新倍数等个人信息
                this.playerPanel.updatePlayerInfo(myLocalSeatId, singerPlayerInfo);

                //地主
                let lordSeverSeatId = singerPlayerInfo.landlordSid
                let lordLocalSeatId = DZGameUtil.toLocalSeatId(lordSeverSeatId);
                this.playerPanel.showlandlordStatus(lordLocalSeatId);
                //显示地主牌标志
                DZGameUtil.landlordSeatId = lordLocalSeatId;
                this.player_control.showLandlordState();
                //手牌数
                if (singerPlayerInfo.cardsCount) {
                    this.playerPanel.showPokersNum(true);
                } else {
                    this.playerPanel.showPokersNum(false);
                }
                this.playerPanel.updatePokersNum(myLocalSeatId, parseInt(singerPlayerInfo.cardsCount));
                //小于3张显示报警灯
                if (singerPlayerInfo.cardsCount <= (3 + DZGameUtil.letBrandNum)) {
                    //剩余3张加上让牌数 显示红灯警报动画，收到结算协议停止动画，隐藏红灯
                    if (singerPlayerInfo.cardsCount <= (3 + DZGameUtil.letBrandNum)) {
                        if (!this.playerPanel.isShowRedLight(myLocalSeatId)) {
                            this.playerPanel.showRedLight(myLocalSeatId, true);
                        }
                    }
                }
                //上一家打的牌
                //singerPlayerInfo.lastCards
                //自己上一把打的牌
                if (singerPlayerInfo.cardsStack && singerPlayerInfo.cardsStack.length > 0) {
                    //不是自己出牌的时候才显示上一把打的牌
                    if (data.saySid != myServerSeatId) {
                        //singerPlayerInfo.cardsStack  这里数组如果为空，则会显示不出图片
                        this.player_control.showDiscardPanel(singerPlayerInfo.cardsStack, myLocalSeatId);
                    }
                    //清空打牌区
                    if (data.state != "input") {
                        this.player_control.clearAllDiscard();
                    }
                    //删除重连后的不出图片提示
                    if (singerPlayerInfo.cardsStack.length == 0) {
                        this.player_control.clearAllDiscard();
                    }
                } else {
                    h.log.debug("bu chu");
                    this.player_control.showDiscardPanel([], myLocalSeatId);
                }
            }
        }
        //清理说话人的出牌区(不出提示图片)
        if (data.saySid == DZGameUtil.serverSeatId) {
            this.player_control.clearMySelfDiscard();
        }
        //说话人桌位号，根据这个显示按钮
        if (data.saySid >= 0) {
            let sayServerSeatId = data.saySid;
            let sayLocalSeatId = DZGameUtil.toLocalSeatId(sayServerSeatId);
            //根据状态显示时钟
            //this.playerPanel.hideAllAlarmClock();
            this.playerPanel.showAlarmClock(sayLocalSeatId);
            //说话人显示按钮
            h.log.debug("%%%....data.sayUid=" + data.sayUid + " getUserId=" + HallUserModel.getInstance().getUserID());
            if (data.sayUid == HallUserModel.getInstance().getUserID()) {
                if (data.action) {
                    if (data.action.state) {
                        h.log.debug("%%%....添加按钮state=" + data.action.state, " gamestate=" + data.action.gameStart);
                        if (data.action.state == 'showCard') {
                            if (data.action.gameStart != undefined) {
                                this.addXingPaiBtn(DZConstant.buttonType.gameStart);
                            } else {
                                if (DZGameUtil.showCard == 1) {
                                    this.addXingPaiBtn(DZConstant.buttonType.showCard);
                                }

                            }
                        } else {
                            h.log.debug("%%%..生成按钮..." + data.action);

                            if (data.action.state == 'notSendCard') {
                                //判断要起，要不起
                                this.topPokers = data.lastCards;
                                this.cardType = data.cardsType;
                                var pokerNums = this.player_control.getAllPokers();
                                cc.log('pokerNums:::' + JSON.stringify(pokerNums));
                                cc.log('toppokers:::' + JSON.stringify(this.topPokers));
                                cc.log('cardType:::' + JSON.stringify(this.cardType));
                                cc.log('playType:::' + JSON.stringify(DZGameUtil.playType));
                                var tipArray = CardRule.getTargetCards(pokerNums, this.topPokers, this.cardType, DZGameUtil.playType);
                                cc.log('lastpokers' + JSON.stringify(this.topPokers));
                                cc.log('tipArray' + JSON.stringify(tipArray));
                                if (tipArray.length == 0) {
                                    if (!data.isReplay) {
                                        this.player_control.setTouchNodeEnable(true);
                                        this.addXingPaiBtn(DZConstant.buttonType.yaobuqi);
                                    }
                                } else {
                                    if (!data.isReplay) {
                                        this.addXingPaiBtn(DZConstant.buttonType.play);
                                    }
                                }
                            } else {
                                this.addXingPaiBtn(data.action.state, data.action);
                            }
                        }


                    }
                }
            }
        }

        //底牌  如果没开始不显示底牌，显示背面
        if (data.zhuangCards) {
            this.siRendipai.removeAllChildren();
            this.pokerslayout.removeAllChildren();
            if (data.state == "ready" || data.state == "callZhuang") {
                this.showLordCards(false, []);
            } else {
                //kickPull 
                this.showLordCards(true, data.zhuangCards);
            }

        }
        h.log.debug("&&&&...data.state=" + data.state);
        //出牌按钮显示，牌就可以点击
        if (data.state == "ready" || data.state == "init") {
            this.addXingPaiBtn(DZConstant.buttonType.ready);
            DZGameUtil.game_status = DZConstant.gameProgress.table;
        } else {
            DZGameUtil.game_status = DZConstant.gameProgress.game;
        }
        if (data.state == "input" || data.state == "output") {
            //手牌区可以点击
            this.player_control.setTouchNodeEnable(false);
        } else {
            this.player_control.setTouchNodeEnable(true);
        }

        //癞子相关的操作
        if (data.LzCards) {
            for (let i = 0; i < data.LzCards.length; i++) {
                DZGameUtil.laiziArray.push(data.LzCards[i]);
            }
            if (data.cards && data.cards.length > 0) {
                this.player_control.reloadPokers(data.cards);
            }
            this.laiziNode_card.removeAllChildren();
            this.laiziNode_card.active = true;
            for (let i = 0; i < DZGameUtil.laiziArray.length; i++) {
                let poker = this.player_control.producePokerHalf(DZGameUtil.laiziArray[i]);
                poker.setPokerScale(0.6);
                poker.setBackSideActive(true);
                this.laiziNode_card.addChild(poker.node);
                poker.flipXPoker(0.6);
                if (DZGameUtil.playType == DZConstant.playType.TDLZ3) {
                    if (i == 0) {
                        poker.showTDLzTip(true);
                    } else {
                        poker.showTDLzTip(false);
                    }
                }
            }
        } else {
            this.laiziNode_card.active = false;
        }

        if (data.JiPaiQi) {
            this.jipai_control.updateView(data.JiPaiQi);
        }
        if (data.JiPaiQI) {
            this.jipai_control.updateView(data.JiPaiQI);
        }

        //有结算，显示结算界面
        if (data.results) {
            //只存数据，等游戏界面push进来再显示结算界面
            //DZjiesuanModel.getInstance().setData(data.results);
        }
        //有解散房间，显示解散房间提示面板
        if (data.dissolveInfo) {
            //   DZDismissModel.getInstance().setDismissData(data);
            //     //剩余秒数
            //    let remaindSeconds = data.dissolveInfo.seconds;
            //    //申请人id
            //    let invokeId = data.dissolveInfo.dissolveId;

        }
        this.player_control.showLandlordState();
        if (data.isDouble) {
            this.waiting_multiple.active = true;
            this.addXingPaiBtn(DZConstant.buttonType.addTimes);
        }
        //重连后恢复底牌倍数
        if (data.statistical && data.zhuangId && data.statistical.lowCard > 1 && DZGameUtil.playType != DZConstant.playType.PZ3) {
            //显示底牌倍数
            this.dipai_beishu.active = true;
            let yxzPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/youxizhong", cc.SpriteAtlas);
            if (data.statistical.lowCard == 2) {
                this.bei_num.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("zhuomian_yinzhang_x2");
            } else if (data.statistical.lowCard == 3) {
                this.bei_num.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("zhuomian_yinzhang_x3");
            }
        }
    }

    clickReadyBtn() {
        h.log.debug("继续准备 callback");
    }

    //更新底牌框的位置
    updateDiPaiPanelPos() {
        h.log.debug("更新底牌框的位置...DZGameUtil.playerNum=" + DZGameUtil.playerNum);
        this.dipai_kuang.active = true;
        if (DZGameUtil.playerNum == 4) {
            h.log.debug("更新底牌框的位置 this.dipai_kuang.x");
            this.dipai_kuang.x = -261;
            this.dipai_kuang.y = 10;
        } else {
            this.dipai_kuang.x = 0;
            this.dipai_kuang.y = 0;
        }

    }


    //显示玩法名字
    private showGameWanfa() {
        let wanfa_label = this.wanfa.getComponent(cc.Label);
        let wanfa = CreateModel.getInstance().getWanfaConfig(DZGameUtil.playType)[0].name;
        wanfa_label.string = wanfa;
    }

    //退出之前清理
    private cleanGame() {
        //this.stopAllScheduler();
    }

    //停止所有的schedule
    private stopAllScheduler() {
        if (this.timeLabel) {
            this.timeLabel.unscheduleAllCallbacks();
        }

    }


    //更新房间号
    private updateZhuoHao(tableId: string) {
        h.log.debug("this.table_num", this.table_num);
        let zuoHaoLabel = this.table_num.getComponent(cc.Label);
        h.log.debug("zuoHaoLabel=", zuoHaoLabel);
        h.log.debug("zuoHaoLabel.string=" + zuoHaoLabel.string);
        zuoHaoLabel.string = tableId;
    }
    //更新局数
    private updateRoundNum(round: string, totalRound: string) {
        let roundLabel = this.round_num.getComponent(cc.Label);
        roundLabel.string = round + '/' + totalRound;
    }
    //退回到上一个界面
    private gameCallback() {
        this.cleanGame();
        h.viewManager.removeView(this);
    }
    //退出，解散房间
    private quitGame() {
        h.log.debug("DZGameView-->退出 quitGame DZGameUtil.game_status=" + DZGameUtil.game_status);
        //按游戏状态退出
        // if(table){
        //     this.gameCallback();
        // }else{
        //     //show vote
        // }
        // HallController.destroy(function () {
        //     h.log.debug("DZGameView-->退出 HallController.destroy");
        //     this.cleanGame();
        //     h.viewManager.popView();
        // }.bind(this));
        if (DZGameUtil.game_status == DZConstant.gameProgress.table) {
            //游戏未开始前  房主直接调销毁房间  非房主直接调用离开房间
            if (HallUserModel.getInstance().getUserID() == DZGameUtil.ownerId) {
                h.log.debug("房主销毁房间..");
                HallController.destroy(function () {
                    //房主销毁房间
                    h.log.debug("房主销毁房间...接口返回");
                }.bind(this));
            } else {
                h.log.debug("非房主离开房间..");
                HallController.leave(function () {
                    h.log.debug("非房主离开房间...接口返回");
                }.bind(this));
            }
        } else {
            //投票解散房间
            h.log.debug("投票解散房间...");
            HallController.dissolve(function () {
                h.log.debug("投票解散房间...接口返回");
            }.bind(this));
        }

    }

    //游戏内战绩
    private gameZhanJi() {
        h.log.debug("DZGameView-->gameZhanJi");
        HallController.getResults(function () {

        }.bind(this));
        // DZBattleReportController.showBattleReportView();
    }
    //规则
    private gameGuiZe() {
        h.log.debug("DZGameView-->gameGuiZe");
        let ruleView = h.viewManager.getViewBySign(DZConstant.ruleName);
        if (!ruleView) {
            DzShowRuleController.showRuleView();
        }

    }
    //设置
    private gameSheZhi() {
        DZSetController.showSetView();
    }

    /** 
    * 清除明牌状态
    */
    clearLookCard() {
        DZGameUtil.click_mingpai = false;
        this.playerPanel.clearLookCard();
        //头像下面的倍数初始化为1倍
        this.playerPanel.resetAllMultiple();
        //记牌器重置
        this.jipai_control.resetView();
    }

    showMingPaiCards(is) {
        this.playerPanel.showMingpaiCards(is);
    }

    cleanAllPoker() {
        this.player_control.clearAllDiscard();
        this.player_control.clearAllBudgetPanel();
        this.player_control.reloadPokers([]);
        //
        this.playerPanel.hideOkStatus(-1, true, true);
    }
    //lzType 0天癞子 1地癞子 普通癞子不用管
    showLaiZhiTip(blnShow: boolean, lzType: number) {
        if (blnShow) {
            h.log.debug("this.laizhi_tip.y=" + this.laizhi_tip.y);

            let yxzPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/youxizhong", cc.SpriteAtlas);
            if (DZGameUtil.playType == DZConstant.playType.ordinaryLz3) {
                //癞子玩法
                this.laizhi_tip.active = true;
                h.log.debug("this.laizhi_tip.y=" + this.laizhi_tip.y);
                this.laizhi_tip.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("doudizhu_paizhuo_lzqdz");
            } else if (DZGameUtil.playType == DZConstant.playType.TDLZ3) {
                //天地癞子
                this.td_laizhi_tip.active = true;
                if (lzType == 0) {
                    this.td_laizhi_tip.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("doudizhu_tianlaizi");
                } else {
                    this.td_laizhi_tip.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("doudizhu_dilaizi");
                }
            }

        } else {
            this.td_laizhi_tip.active = false;
            this.laizhi_tip.active = false;
        }
    }
    //发牌
    sendCard(data: any) {
        //
        if (data.isReplay) {
            //回放的话，需要把其它家的牌按明牌显示出来
            if (data.cards) {
                h.log.debug("&&..回放显示其它家的牌,DZGameUtil.serverSeatId=" + DZGameUtil.serverSeatId + " data.sid=" + data.sid);
                if (DZGameUtil.serverSeatId != data.sid) {
                    h.log.debug("DZGameUtil.playerNum=" + DZGameUtil.playerNum);
                    let localSeat = DZGameUtil.toLocalSeatId(data.sid);
                    h.log.debug("localSeat=" + localSeat);
                    this.playerPanel.showMingPokers(localSeat, data.cards);
                }

            }
        }

        if (DZGameUtil.serverSeatId != data.sid) {
            return;
        }
        //隐藏所有的单局结算分数
        this.playerPanel.hidenAllRoundScore();
        this.xingpai.removeAllChildren();
        this.cleanAllPoker();
        this.laiziNode_card.removeAllChildren();
        //收到发牌通知
        this.player_control.setTouchNodeEnable(true);

        this.showGameLayer(true);


        DZGameUtil.laiziArray = [];
        let LzCards = data.LzCards || [];
        if (LzCards.length != 0) {
            cc.log(' have laizi');
            DZPlaySound.getInstance().playChooseLz(true);
            for (let i = 0; i < LzCards.length; i++) {
                DZGameUtil.laiziArray.push(LzCards[i]);
            }
            //显示癞子确定提示
            this.showLaiZhiTip(true, 0);
            //癞子翻牌动画，播完之后添加到底牌上去
            this.player_control.showLaiziAni(data.LzCards, function () {
                this.laiziNode_card.active = true;

                this.showLaiZhiTip(false, 1);
                for (let i = 0; i < DZGameUtil.laiziArray.length; i++) {
                    let poker = this.player_control.producePokerHalf(DZGameUtil.laiziArray[i]);
                    poker.setPokerScale(0.6);
                    poker.setBackSideActive(true);
                    this.laiziNode_card.addChild(poker.node);
                    poker.flipXPoker(0.6);
                    if (DZGameUtil.playType == DZConstant.playType.TDLZ3) {
                        if (i == 0) {
                            poker.showTDLzTip(true);
                        } else {
                            poker.showTDLzTip(false);
                        }
                    }
                }
                //播放完天癞子动画后再发牌
                //先放明牌*5按钮
                if (!DZGameUtil.click_mingpai && DZGameUtil.showCard == 1) {
                    this.addXingPaiBtn(DZConstant.buttonType.showCard);
                }
                this._sendPoker(data);
                //this.player_control.showLandlordState();
            }.bind(this))

        } else {
            cc.log(' no have laizi');
            //没点明牌，且有明牌规则
            if (!DZGameUtil.click_mingpai && DZGameUtil.showCard == 1) {
                this.addXingPaiBtn(DZConstant.buttonType.showCard);
            }
            this._sendPoker(data);
        }

        //this._sendPoker(data);

        this.playerPanel.hideOkStatus(-1, true, true);


        this.player_control.clearAllBudgetPanel();
        //显示底牌背面
        this.showLordCards(false, []);
        //隐藏地主标记和灯
        this.playerPanel.hideAllAlarmClock();
        this.playerPanel.hideAlllandlordStatus();
        //如果选了可以看，则显示数字，否则不显示
        if (data.cardsCount) {
            //this.playerPanel.initAllPokersNum(data.cardsCount);
            this.playerPanel.initAllPokersNum("0");
            this.playerPanel.showPokersNum(true);
        } else {
            this.playerPanel.showPokersNum(false);
        }


        //显示现在的局数
        DZjiesuanModel.getInstance().setCurrentRound(data.currentRound);
        let currentRound: string = String(data.currentRound + 1);
        let roundCount: string = String(data.roundCount);
        this.updateRoundNum(currentRound, roundCount);
        this.jipaiqi.active = true; //记牌器按钮等发了牌再显示

        if (data.JiPaiQI) {
            this.jipai_control.updateView(data.JiPaiQI);
        }

        // if(data.isReplay){
        //     //回放的话，需要把其它家的牌按明牌显示出来
        //     if(data.cards){
        //         h.log.debug("&&..回放显示其它家的牌,DZGameUtil.serverSeatId=" + DZGameUtil.serverSeatId + " data.sid="+data.sid);
        //         if(DZGameUtil.serverSeatId != data.sid){
        //             h.log.debug("DZGameUtil.playerNum=" + DZGameUtil.playerNum);
        //             let localSeat = DZGameUtil.toLocalSeatId(data.sid);
        //             h.log.debug("localSeat=" + localSeat);
        //             this.playerPanel.showMingPokers(localSeat,data.cards);
        //         }

        //     }
        // }

    }

    //每局开始收到准备消息初始化一些状态
    receive_ready_data() {
        this.stop_JieSuanAnim();
        DZGameUtil.resetSoundMap();
        //底牌倍数提示隐藏
        this.dipai_beishu.active = false;
        //加倍提示隐藏
        this.jiabei_tip.active = false;
        //记牌器重置
        this.jipai_control.resetView();
        //头像下面的倍数初始化为1倍
        this.playerPanel.resetAllMultiple();
        //隐藏所有的单局结算分数
        this.playerPanel.hidenAllRoundScore();
        //显示底牌背面
        this.showLordCards(false, []);
        //癞子牌
        this.laiziNode_card.removeAllChildren();
        this.laiziNode_card.active = false;
        //清理弃牌
        this.player_control.clearAllDiscard();
        //清理手牌
        this.player_control.reloadPokers([]);
        //清理结算时没打出去的牌
        this.player_control.clearAllBudgetPanel();
        //隐藏所有地主标志
        this.playerPanel.hideAlllandlordStatus();
        //隐藏手型标记
        this.playerPanel.hideOkStatus(-1, true, true);
    }


    /**
     * 发牌
     */
    _sendPoker(data) {
        //this._sendPokersByAction();
        cc.log('_sendPoker  game_send_card');
        //开始音效
        DZPlaySound.getInstance().playFapai(true);
        this.player_control.initView(data.cards, function () {
            h.log.debug("删除按钮。。。showCard_2");
            //this.control_button.deleteAllBtn();
            let data = DZGameModel.getInstance().getCallZhongData();
            h.log.debug("发牌。。。showCard_2");
            this.control_button.deteAllBtnByState('showCard_2');
            if (data && data.state) {
                this.addXingPaiBtn(data.state, data.action);
            }
            DZGameModel.getInstance().setCallZhongData({});
            DZPlaySound.getInstance().stopFapai();
        }.bind(this), this, false);
    }

    showLordCards(isShow, cards) {
        cards = cards || [];
        if (!isShow) {
            this.dipai_beishu.active = false;
        }
        this.beiLayout.active = false;
        this.layoutsiren.active = false;
        if (DZGameUtil.playType == DZConstant.playType.ddz4) {
            this.layoutsiren.active = !isShow;
        } else {
            this.beiLayout.active = !isShow;
        }

        if (DZGameUtil.playType == DZConstant.playType.PZ3) {
            this.pai_3.active = true;
        } else {
            this.pai_3.active = false;
        }

        this.siRendipai.removeAllChildren();
        this.pokerslayout.removeAllChildren();
        for (let i = 0; i < cards.length; i++) {
            let poker = this.player_control.producePokerHalf(cards[i]);
            poker.setPokerScale(0.6);
            poker.setBackSideActive(true);
            if (DZGameUtil.playType == DZConstant.playType.ddz4) {
                this.siRendipai.addChild(poker.node);
            } else {
                this.pokerslayout.addChild(poker.node);
            }
            if (isShow) {
                poker.flipXPoker(0.6);
            }
            //poker.flipXPoker(0.3);
        }
    }
    /**
            * 根据抬起的牌要实时判断出牌按钮是否可以点击
            */
    update_sendBtn() {
        cc.log('xxxxxxxxxxxxxxxx 1111 ');

        if (this._canSendPoker()) {
            h.log.debug("改变出牌按钮为正常");
            this.player_control.setTouchNodeEnable(false);
            this.control_button.changeBtnStatus('出 牌', 'normal');
        } else {
            h.log.debug("改变出牌按钮为  灰色。。。")
            this.control_button.changeBtnStatus('出 牌', 'gray');
        }
    }

    /**
         * 过按钮点击
         */
    click_pass(data: any) {
        this.player_control.setAllPokersDown();
        DZGameController.getInstance().sendCardData([], 'pass', false);
        this.deteleBtnByState(data.state);
    }

    /**
         * 提示
         */
    click_tip() {
        cc.log('tipBtn btn click');
        var pokerNums = this.player_control.getAllPokers();
        cc.log('pokerNums:::' + JSON.stringify(pokerNums));
        cc.log('toppokers:::' + JSON.stringify(this.topPokers));
        cc.log('cardType:::' + JSON.stringify(this.cardType));
        cc.log('playType:::' + JSON.stringify(DZGameUtil.playType));
        var tipArray = CardRule.getTargetCards(pokerNums, this.topPokers, this.cardType, DZGameUtil.playType);
        cc.log('tipArray::::' + JSON.stringify(tipArray));

        if (this.tipIndex != 0) {
            if (this.tipIndex == tipArray.length) {
                this.tipIndex = 0;
            }
        }

        cc.log('xxxxxxxxxxxxxxxxxxxxx' + this.tipIndex);
        this.player_control.liftPokers(tipArray[this.tipIndex].arr);
        this.control_button.changeBtnStatus('出 牌', 'normal');
        cc.log('xxxxxxxxxxxxxxxxxxxxx 1111' + this.tipIndex);
        this.tipIndex++;
    }


    /**
         * 是否可以出牌的判断
         */

    _canSendPoker() {
        var willPlayPokers = this.player_control.getLiftPokers();
        let isLastCard = this.player_control.judgetLast();
        h.log.debug('willPlayPokers:::' + JSON.stringify(willPlayPokers));
        h.log.debug('topPokers::::' + JSON.stringify(this.topPokers));
        h.log.debug('cardType::::' + JSON.stringify(this.cardType));
        h.log.debug('playType::::' + JSON.stringify(DZGameUtil.playType));
        cc.log('isLastCard:::' + JSON.stringify(isLastCard));
        let willPlayObj = CardRule.getHandTypesEx(willPlayPokers, this.topPokers, this.cardType, DZGameUtil.playType, isLastCard);
        if (willPlayObj.length == 0) {
            return false;
        }
        return true;
    }

    /*
     * 皮子玩法，三带皮子直接当成炸弹
     */
    filerPLWillPlayData( willPlayData ){
        if (DZGameUtil.playType != DZConstant.playType.PZ3 || willPlayData.length < 2){
            return willPlayData;
        }
        for( var i = 0; i < willPlayData.length; ){
            var temp    = willPlayData[i];
            var pokers  = temp.arr;
            if( pokers.indexOf( "PLP" ) == -1 || pokers.length != 4 ){
                ++i;
                continue;
            }

            if( pokers[0].slice(1) == pokers[1].slice(1) && pokers[1].slice(1) == pokers[2].slice(1) && temp.handType == "TripletsBeltSingle" ){
                willPlayData.splice(i,1);
            }else{
                ++i;
            }
        }
        return willPlayData;
    }

    /**
         * 出牌
         * 
         */
    click_discard(data, is_restart) {
        if (this._canSendPoker()) {
            this.control_button.changeBtnStatus('出 牌', 'gray');
            //点了出牌按钮 有牌出，就不能再点牌了
            DZGameUtil.click_send_card = true;
            //手牌区不能点击了
            this.player_control.setTouchNodeEnable(true);
            let tableId = DZGameUtil.tableId;
            let willPlayPokers = this.player_control.getLiftPokers();
            let isLastCard = this.player_control.judgetLast();
            cc.log('willPlayPokers:::' + JSON.stringify(willPlayPokers));
            cc.log('cardType:::' + JSON.stringify(this.cardType));
            cc.log('playType:::' + JSON.stringify(DZGameUtil.playType));
            cc.log('topPokers:::' + JSON.stringify(this.topPokers));
            cc.log('isLastCard:::' + JSON.stringify(isLastCard));
            let willPlayObj = CardRule.getHandTypesEx(willPlayPokers, this.topPokers, this.cardType, DZGameUtil.playType, isLastCard);
            willPlayObj     = this.filerPLWillPlayData( willPlayObj );
            cc.log('willPlayObj' + JSON.stringify(willPlayObj));
            if (willPlayObj.length == 1) {
                DZGameController.getInstance().sendCardData(willPlayObj[0].arr, willPlayObj[0].handType, is_restart);
                this.control_button.deleteAllBtn();
            } else {
                //弹选择的界面
                h.log.debug('弹选择的界面');
                this.control_button.changeBtnStatus('出 牌', 'normal');
                this.player_control.setTouchNodeEnable(false);
                let prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/game/cardTypeSelect', cc.Prefab);
                let selectTypeNode = cc.instantiate(prefab).getComponent('cardTypeSelect');
                this.cardTypeSelect.addChild(selectTypeNode.node);
                selectTypeNode.refreshView(willPlayObj, this.control_button, is_restart);
            }
        } else {
            HallToast.show('您出的牌不符合');
        }
    }

    //删除指定状态的按钮
    deteleBtnByState(state) {
        if (state) {
            this.control_button.deteAllBtnByState(state);
        }
    }

    //点击聊天按钮
    private gameLiaoTian() {
        h.log.debug("DZGameView-->gameLiaoTian");
        DZChatCommonController.showChatCommonView();
    }

    //记牌器
    private onClickJIpaiqi() {
        if (this.jipaiqiState) {
            this.jipaiHide = !this.jipaiHide;
            this.jipaiqiNode.active = this.jipaiHide;
        }
    }

    //点击空白牌下来
    blank_click() {
        //牌全下来
        h.log.debug("blank_click...牌全下来");
        this.player_control.setAllPokersDown();
        this.control_button.changeBtnStatus('出 牌', 'gray');
    }


    //接收广播聊天
    public onChat(data: any) {
        h.log.debug("DZGameView-->onChat", data);
        switch (data.type) {
            case 0:
                var commonData = DZChatCommonModel.getInstance().getCommonById(data.index);
                this.playerPanel.showChat(commonData, DZGameModel.getInstance().getSeverSeatId(data.uid), data.uid);
                break;
            case 1:
                var lookData = DZChatCommonModel.getInstance().getLookById(data.index);
                this.playerPanel.playEmoji(lookData, DZGameModel.getInstance().getSeverSeatId(data.uid));
                break;
            case 2:
                var seatId = DZGameUtil.toLocalSeatId(DZGameModel.getInstance().getSeverSeatId(data.targetId));
                var endPos = this.playerPanel.getPlayrePostion(seatId);
                var selfSeatId = DZGameUtil.toLocalSeatId(DZGameModel.getInstance().getSeverSeatId(data.uid));
                var startPos = this.playerPanel.getPlayrePostion(selfSeatId);
                this.spineControl.playMagicAnimation(data.index, startPos, endPos, selfSeatId, seatId);
                break;
        }
    }

    //接收自定义聊天
    public onChatText(data: any) {
        h.log.debug("DZGameView-->onChatText", data);
        // added by baizhanxiao 语音
        // data.uid
        let textData = JSON.parse(data.text);
        switch (textData.type) {
            case HallConstant.ChatType.voice:
                gvoice.GetVoiceEngine().DownloadRecordedFile(textData.fileID, jsb.fileUtils.getWritablePath() + "voicetemp.bat")
                break;
        }
    }

    //收到解散房间推送，开始显示解散界面
    receive_dismiss_notify_data(data) {
        h.log.debug("收到解散房间推送，开始显示解散界面-->" + JSON.stringify(data));
        //发起和被发起
        //DZDismissController.showDZDismissView();
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


    /**
         * 收到退出广播
         */
    receive_quitGame_data(data) {
        h.log.debug("receive_quitGame_data收到退出广播-->" + JSON.stringify(data));
        if (data.uid) {
            let serverSeatId: number = DZGameModel.getInstance().getSeverSeatId(data.uid);
            if (serverSeatId >= 0) {
                let leaveSeatId = DZGameUtil.toLocalSeatId(serverSeatId);
                //隐藏这个用户
                this.playerPanel.hidePlayer(leaveSeatId);
                DZPlaySound.getInstance().playExitRoom();
                DZPlaySound.getInstance().removePlayerSex(data.uid);
                DZPlaySound.getInstance().removePlayerIp(data.uid);
                //自己收到退出消息后 返回到大厅
                if (leaveSeatId == 0) {
                    h.log.debug("自己收到退出消息后 返回到大厅");
                    h.viewManager.removeView(this);
                    DZHallController.showDZHallView();
                }
            }
        }
    }

    //online
    receive_online_data(data) {
        if (data) {
            if (data.uid) {
                let serverSeatId = DZGameModel.getInstance().getSeverSeatId(data.uid);
                let localSeatId = DZGameUtil.toLocalSeatId(serverSeatId);
                this.playerPanel.showLostConect(localSeatId, false);
            }
        }
    }
    //offline
    receive_offline_data(data) {
        if (data) {
            if (data.uid) {
                let serverSeatId = DZGameModel.getInstance().getSeverSeatId(data.uid);
                let localSeatId = DZGameUtil.toLocalSeatId(serverSeatId);
                this.playerPanel.showLostConect(localSeatId, true);
            }
        }
    }

    //显示单局结算
    receive_result_data(data) {
        h.log.debug("单局结算--->" + JSON.stringify(data));
        if (data && data.results) {

            //Add ： 最后一手牌
            /*
            if (data.successPlayer) {
                var successPlayerId = data.successPlayer.uid;
                for (var i = 0; i < data.results.length; ++i) {
                    var tempPlayer = data.results[i];
                    if (successPlayerId == tempPlayer.playerId) {
                        tempPlayer.cards = data.successPlayer.lastCards;
                        break;
                    }
                }
            }
            */

            let isSpring = false;
            //农民还是地主
            let type = '';
            //保存局数和总局数
            DZjiesuanModel.getInstance().setCurrentRound(data.currentRound);
            DZjiesuanModel.getInstance().setRoundCount(data.roundCount);
            //h.log.debug("data.results.length=" + data.results.length);
            for (let i = 0; i < data.results.length; i++) {
                let resultData = data.results[i];
                //h.log.debug("单局结算--->resultData.playerId=" + resultData.playerId + " getUserID=" + HallUserModel.getInstance().getUserID());
                if (resultData.playerId == HallUserModel.getInstance().getUserID()) {
                    //自己的数据
                    //h.log.debug("保存自己的单局结算");
                    DZjiesuanModel.getInstance().setData(resultData);
                    break;
                }
            }
            for (let i = 0; i < data.results.length; i++) {
                let resultData = data.results[i];
                if (resultData.type == 'landlord' && resultData.victory == 1 && resultData.isSpring) { //春天
                    var sex = DZPlaySound.getInstance().getSexById(resultData.playerId);
                    DZPlaySound.getInstance().playSpring(DZPlaySound.getInstance().getChatStr(sex));
                    this.spineControl.playSpringAnimation();
                    isSpring = true;
                    break;
                } else if (resultData.type == 'farmers' && resultData.victory == 1 && resultData.isSpring) { //反春天
                    isSpring = true;
                    this.spineControl.playAntiSpring();
                }
            }
            if (isSpring) {
                HallUtil.schedule(function () {
                    this.resetStateWhenAccount();
                }.bind(this), this, 2.0);
            } else {
                this.resetStateWhenAccount();
            }

        }

        //把剩下的牌显示出来
        for (let i = 0; i < data.results.length; i++) {
            let seatId = DZGameUtil.toLocalSeatId(data.results[i].sid);
            //只有出完牌的玩家（即赢家）显示
            var isWinner = this.isSelfWin(data.successPlayer, data.results[i]);
            this.player_control.showRestPokers(seatId, data.results[i].cards, isWinner);


            //更新用户分数
            this.playerPanel.updateScore(seatId, data.results[i].score);
            //更新单局显示分数
            if (data.results[i].win > 0) {
                this.playerPanel.updateRoundScore(seatId, "+" + data.results[i].win);
            } else {
                this.playerPanel.updateRoundScore(seatId, data.results[i].win);
            }

        }
    }

    /*
     * 是否是胜利者
     */
    isSelfWin(successPlayer, self) {
        if (!successPlayer) {
            return false;
        }

        return successPlayer.uid == self.playerId;
    }

    /**
    * 结算时清空一些状态及重置一些属性
    * 
    */
    resetStateWhenAccount() {
        this.topPokers = [];
        this.cardType = "";
        //清除行牌和打牌的图片提示
        this.xingpai.removeAllChildren();
        //this.player_control.clearAllDiscardExSelf();
        //this.playerPanel.clearLookCard();
        this.playerPanel.clearAllRedLight();
        this.playerPanel.hideAllAlarmClock();
        HallUtil.schedule(function () {
            DZjiesuanController.showJiesuanView();
            DZGameModel.getInstance().setCallZhongData({});
        }.bind(this), this, 1.5);

    }


    /**
     * 收到下一家显示提拉按钮
     * kick|sendCard|follow|pull", "desc": "kick 踢 | sendCard 出牌|follow 跟|pull 拉"
     */
    receive_kickPull_data(data: any) {
        h.log.debug("收到下一家显示提拉按钮=" + JSON.stringify(data));
        if (data.state) {
            if (data.sid == DZGameUtil.serverSeatId) {
                this.addXingPaiBtn(data.state);
            }
        }
        if (data.sid >= 0) {
            this.playerPanel.hideAllAlarmClock();
            let seatId = DZGameUtil.toLocalSeatId(data.sid);
            this.playerPanel.showAlarmClock(seatId);
        }
    }

    /**
         * 总结算
         */
    receive_totalResult_data(data) {
        h.log.debug(" ..总结算" + JSON.stringify(data));
        // self._zhanbaoProxy.setTotalData(data.data);
        // self._zhanbaoProxy.setGameList(data.data.playerResult);
        // self._zhanbaoProxy.setPlayerList(data.data.totalResultPlayer);
        // self._zhanbaoProxy.setAreaInfo(data.data.areaId, data.data.payment.nowInnings, data.data.payment.innings, data.data.ruleId);
        DZBattleReportModel.getInstance().FN_SetShowAll(true);
        DZBattleReportModel.getInstance().FN_SetIsGaming(false);
        DZBattleReportModel.getInstance().FN_SetTotalData(data);
        if(DZGameUtil.dismiss_suc){
            DZBattleReportController.showBattleReportView();
        }
        
        // DZBattleReportModel.getInstance().FN_SetPlayInfoList(data.gamePlayers);
        // DZBattleReportModel.getInstance().FN_SetGameInfoList(data.results);

    }
    //显示底牌倍数
    show_dipai_beishu(data) {
        // grabLandlord: 1,   //抢地主倍数
        // bomb: 1,          //炸弹
        // spring: 1,        //春天
        // brandCard: 1,     //明牌
        // lowCard: 1,       //抓底
        // friedBomb: 1,  //连炸
        if (data.type == 'lowCard') {
            //显示底牌倍数
            this.dipai_beishu.active = true;
            let yxzPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/youxizhong", cc.SpriteAtlas);
            if (data.multiple == 2) {
                this.bei_num.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("zhuomian_yinzhang_x2");
            } else if (data.multiple == 3) {
                this.bei_num.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("zhuomian_yinzhang_x3");
            }
        } else {
            //this.dipai_beishu.active = false;
        }
    }
    /**
        *  推送桌子上的总倍数
        */
    receive_totalMultiple_data(data) {
        h.log.debug(" ..推送桌子上的总倍数" + JSON.stringify(data));
        var playerInfo = data.playerInfo;
        let blnShowMult: boolean = false;
        for (let i = 0; i < playerInfo.length; i++) {
            let seateId = DZGameUtil.toLocalSeatId(playerInfo[i].sid);
            this.playerPanel.updateMultiple(seateId, playerInfo[i].multiple);
            if (DZGameModel.getInstance().getUserMultiple(playerInfo[i].uid) != playerInfo[i].multiple) {
                //前后倍数不一致的时候提示加几倍
                blnShowMult = true;
            }
            DZGameModel.getInstance().setUserMultiple(playerInfo[i].uid, playerInfo[i].multiple);
        }
        this.show_dipai_beishu(data);
        if (blnShowMult && data.multiple) {
            //显示倍数提示
            this.jiabei_tip.scale = 0.1;
            this.jiabei_tip.active = true;
            this.jiabei_tip.stopAllActions();
            let yxzPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/youxizhong", cc.SpriteAtlas);
            this.jiabei_number.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame("doudizhu_shuzi_jia" + String(data.multiple));
            this.jiabei_tip.runAction(cc.sequence(cc.scaleTo(0.1, 1.0, 1.0), cc.delayTime(1.5), cc.scaleTo(0.1, 0.1, 0.1), cc.callFunc(function () {
                this.jiabei_tip.active = false;
            }.bind(this))));
        } else {
            this.jiabei_tip.active = false;
        }
    }
    //显示明牌
    receive_brightCard_data(data) {
        if(data.showCards){
            this.showMingPaiCards(true);
        }
        for (let i = 0; i < data.showCards.length; i++) {
            cc.log("receive_brightCard_data" + data.showCards[i].sid);
            let seateId = DZGameUtil.toLocalSeatId(data.showCards[i].sid);
            if (data.showCards[i].sid == DZGameUtil.serverSeatId) {
                var sex = DZPlaySound.getInstance().getSexById(data.showCards[i].uid);
                DZPlaySound.getInstance().playShowCard(DZPlaySound.getInstance().getChatStr(sex));
            }
            this.spineControl.playMingPaiAnimation(seateId);
            this.playerPanel.showMingPokers(seateId, data.showCards[i].cards);
            this.playerPanel.showMingStatus(seateId);
        }

    }

    //广播玩家选择地主情况 叫地主|踢拉|出牌 广播
    receive_lord_choosed_data(data: any) {
        var sex = DZPlaySound.getInstance().getSexById(data.playerId);
        switch (data.choosed) {
            case DZConstant.buttonType.landGrab:// 玩家抢地主
                DZPlaySound.getInstance().playLandGrab(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.notCall://玩家不叫 不抢
                if (data.state == 1) {
                    DZPlaySound.getInstance().playNotCall(DZPlaySound.getInstance().getChatStr(sex));
                } else {
                    DZPlaySound.getInstance().playNotLandGrab(DZPlaySound.getInstance().getChatStr(sex));
                }
                break;
            case DZConstant.buttonType.landOwner://玩家叫地主
                DZPlaySound.getInstance().playLandOwner(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.threePoint:
                DZPlaySound.getInstance().playThreeScore(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.twoPoint:
                DZPlaySound.getInstance().playTwoScore(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.onePoint:
                DZPlaySound.getInstance().playOneScore(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.addTimes:
                DZPlaySound.getInstance().playDouble(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.notAddTimes:
                DZPlaySound.getInstance().playNoDouble(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.kick:
                //踢
                DZPlaySound.getInstance().playKick(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.notKick:
                DZPlaySound.getInstance().playNoKick(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.follow:
                //跟
                DZPlaySound.getInstance().playFollow(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.notFollow:
                //不跟
                //DZPlaySound.getInstance().playNoFollow(DZPlaySound.getInstance().getChatStr(sex));
                DZPlaySound.getInstance().playNoKick(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.pull:
                //拉
                DZPlaySound.getInstance().playPull(DZPlaySound.getInstance().getChatStr(sex));
                break;
            case DZConstant.buttonType.notPull:
                //不拉
                DZPlaySound.getInstance().playNoPull(DZPlaySound.getInstance().getChatStr(sex));
                break;

        }
        if (data.choosed) {
            let chooseSeatId = DZGameUtil.toLocalSeatId(data.sid);
            h.log.debug(chooseSeatId + " 选择了 " + data.choosed);
            //state  1  叫地主 2  抢地主
            if (data.choosed == DZConstant.buttonType.notCall && data.state == 1) {
                data.choosed = 'notCall';
            }
            if (data.choosed == DZConstant.buttonType.notCall && data.state == 2) {
                data.choosed = 'notGrab';
            }
            this.player_control.showImageByStates(chooseSeatId, data.choosed);
        }
        if (data.roundOver) {
            //一圈是否结束
            this.player_control.clearAllDiscard();
        }
    }

    //推拉之后推送出牌按钮
    receive_startInput_data(data) {
        //隐藏等待其它玩家加倍中提示
        this.waiting_multiple.active = false;
        if (data) {
            // 清理弃牌区
            this.player_control.clearAllDiscard();
            //当前用户显示出牌
            if (data.sid == DZGameUtil.serverSeatId) {
                this.addXingPaiBtn(DZConstant.buttonType.sendCard);
                this.update_sendBtn();
                //手牌区可点击 
                this.player_control.setTouchNodeEnable(false);
            }
            this.playerPanel.hideAllAlarmClock();
            let seatId = DZGameUtil.toLocalSeatId(data.sid);
            this.playerPanel.showAlarmClock(seatId);
        }
    }

    hideAllPlayerAlarmClock() {
        this.playerPanel.hideAllAlarmClock();
    }

    //叫庄
    receive_call_zhuang_data(data) {
        this.playerPanel.hideAllAlarmClock();
        let seatId = DZGameUtil.toLocalSeatId(data.sid);
        this.playerPanel.showAlarmClock(seatId);
    }

    //确定地主
    receive_identity_Lord_data(data) {
        //清除行牌提示图片
        this.player_control.clearAllDiscard();
        //只有2人的时候才有让牌数,农民算让牌数，地主不算
        if (data.letBrandNum) {
            if (data.identity == "farmers") {
                DZGameUtil.letBrandNum = 0;
            } else {
                DZGameUtil.letBrandNum = data.letBrandNum;
            }
        } else {
            //默认0
            DZGameUtil.letBrandNum = 0;
        }
        DZPlaySound.getInstance().playSureLandOwner();
        if (data.landlordSid == DZGameUtil.serverSeatId) {
            this.player_control.addThreePokers(data.zhuangCards, function () {
                this.player_control.setTouchNodeEnable(false);
                this.player_control.setAllPokersDown();
            }.bind(this));
        } else {
            this.player_control.setAllPokersDown();
            this.player_control.setTouchNodeEnable(false);
        }

        //服务器桌位转成客户端桌号
        let seatId = DZGameUtil.toLocalSeatId(data.landlordSid);
        //地主
        this.playerPanel.showlandlordStatus(seatId);
        //显示地主牌标志
        DZGameUtil.landlordSeatId = DZGameUtil.toLocalSeatId(data.landlordSid);
        this.player_control.showLandlordState();
        //更新手牌数 牌数20要服务器返回 读取
        if (data.cardsCount) {
            //自己手牌数
            this.playerPanel.updatePokersNum(0, parseInt(data.cardsCount));
        }
        //更新地主手牌数
        if (data.landlordCount) {
            this.playerPanel.updatePokersNum(seatId, parseInt(data.landlordCount));
        }

        this.playerPanel.showAlarmClock(seatId);

        //说话人桌位号
        if (data.speakSid >= 0 && data.speakSid != "") {
            this.playerPanel.hideAllAlarmClock();
            let seatSpeakId = DZGameUtil.toLocalSeatId(data.speakSid);
            this.playerPanel.showAlarmClock(seatSpeakId);
        }
        //同时显示加倍不加倍按钮时 地主位置不显示闹钟，都是自己的位置显示闹钟
        // if (DZGameUtil.isDouble) {
        //     this.playerPanel.hideAllAlarmClock();
        //     this.playerPanel.showAlarmClock(0);
        //     DZGameUtil.isDouble = false;
        // }

        //底牌
        h.log.debug("%%%确定地主...showLordCards");
        if (data.zhuangCards) {
            this.showLordCards(true, data.zhuangCards);
        }

        //癞子相关的操作
        if (data.LzCards) {

            // HallUtil.schedule(function () {
            //     DZPlaySound.getInstance().playBornLz();
            // }.bind(this), this, 1.0);

            for (let i = 0; i < data.LzCards.length; i++) {
                DZGameUtil.laiziArray.push(data.LzCards[i]);
            }
            //确认地主是 地癞子传1
            this.showLaiZhiTip(true, 1);
            DZPlaySound.getInstance().playChooseLz(true);
            //癞子翻牌动画，播完之后添加到底牌上去
            this.player_control.showLaiziAni(data.LzCards, function () {
                this.showLaiZhiTip(false, 1);
                if (data.cards && data.cards.length > 0) {
                    this.player_control.reloadPokers(data.cards);
                }
                this.laiziNode_card.removeAllChildren();
                this.laiziNode_card.active = true;
                for (let i = 0; i < DZGameUtil.laiziArray.length; i++) {
                    let poker = this.player_control.producePokerHalf(DZGameUtil.laiziArray[i]);
                    poker.setPokerScale(0.6);
                    poker.setBackSideActive(true);
                    this.laiziNode_card.addChild(poker.node);
                    poker.flipXPoker(0.6);
                    if (DZGameUtil.playType == DZConstant.playType.TDLZ3) {
                        if (i == 0) {
                            poker.showTDLzTip(true);
                        } else {
                            poker.showTDLzTip(false);
                        }
                    }
                }
                this.player_control.showLandlordState();
            }.bind(this))
        } else {
            this.laiziNode_card.active = false;
        }
        if (data.action) {
            if (DZGameUtil.toLocalSeatId(data.speakSid) == 0) {
                this.addXingPaiBtn(data.action.state);
            }
        }
        if (data.cards && data.isFlip && data.cards.length > 0) {
            this.player_control.reloadPokersAndFlip(data.cards);
        }

        if (data.JiPaiQI) {
            this.jipai_control.updateView(data.JiPaiQI);
        }
    }

    /**
     * 显示翻转后的底牌
     * @param data 
     */
    showTurnCards(data: any) {
        if (data.cards && data.isFlip && data.cards.length > 0) {
            this.player_control.reloadPokersAndFlip(data.cards);
        }
    }

    removeAllXingPaiBtn() {
        this.xingpai.removeAllChildren();
    //    this.player_control.clearAllDiscard();
        this.xingpai.removeAllChildren();
    }

    clearAllDiscard(){
        this.player_control.clearAllDiscard();
    }

    //手牌区变成能点
    recoveryTouchPoker() {
        this.player_control.setTouchNodeEnable(false);
    }

    //所有玩家同时显示加倍，不加倍按钮
    receive_onDouble_data(data: any) {
        this.waiting_multiple.active = true;
        this.addXingPaiBtn(DZConstant.buttonType.addTimes);
        //同时显示加倍不加倍按钮时 地主位置不显示闹钟，都是自己的位置显示闹钟
        if (DZGameUtil.isDouble) {
            this.playerPanel.hideAllAlarmClock();
            this.playerPanel.showAlarmClock(0);
            DZGameUtil.isDouble = false;
        }
    }

    //显示邀请按钮
    show_invite_btn() {
        //this.addXingPaiBtn(DZConstant.buttonType.ready_invite);
    }
    //播放结算动画
    play_jiesuanAnim(type, isWin) {
        this.spineControl.playJieSuanAni(type, isWin);
    }
    //停止结算动画
    stop_JieSuanAnim(){
        this.spineControl.stop_JieSuanAnim();
    }

    //打牌
    receive_play_data(data: any) {
        //self.player_control.showDiscardPanel(["03", "13", "23", "33", "04", "14", "24", "34"]);
        //收到服务器响应，手牌区恢复可点
        this.player_control.setTouchNodeEnable(false);
        if (data.code) {
            if (data.code == DZConstant.respCode.not_accord_rule) {
                if (DZGameUtil.buttonType == DZConstant.buttonType.sendCard_restart) {
                    DZGameUtil.buttonType = DZConstant.buttonType.sendCard;
                }
                if (DZGameUtil.buttonType == DZConstant.buttonType.sendCard || DZGameUtil.buttonType == DZConstant.buttonType.play || DZGameUtil.buttonType == DZConstant.buttonType.notSendCard) {
                    this.addXingPaiBtn(DZGameUtil.buttonType);
                }else{
                    this.addXingPaiBtn(DZConstant.buttonType.play);
                }
                //this.player_control.setAllPokersDown();
            }
            HallAlert.show(data.msg);
            return;
        }
        var sex = DZPlaySound.getInstance().getSexById(data.top.playerId);
        var cardResult = CardRule.getHandTypes(data.top.cards, [], "", DZGameUtil.playType);

        let seatId = DZGameUtil.toLocalSeatId(data.top.sid);
        this.player_control.showDiscardPanel(data.top.cards, seatId);
        this.player_control.discaridPokers(seatId, data.top.cards);
        //self.removeXingPaiBtn();
        this.playerPanel.updatePokersNum(seatId, data.top.cardsCount);
        //这里的数加上让牌张数
        h.log.debug("让牌张数 letBrandNum=" + DZGameUtil.letBrandNum);
        if (data.top.cardsCount <= (3 + DZGameUtil.letBrandNum)) {
            //剩余3张加上让牌数 显示红灯警报动画，收到结算协议停止动画，隐藏红灯
            if (data.top.cardsCount <= (3 + DZGameUtil.letBrandNum)) {
                if (!this.playerPanel.isShowRedLight(seatId)) {
                    this.playerPanel.showRedLight(seatId, true);
                }
            }
            //声音只播放一次
            if (data.top.cardsCount == (3 + DZGameUtil.letBrandNum)) {
                DZPlaySound.getInstance().playAlert();
            }

            if (data.top.cardsCount == 2) {
                if (!DZGameUtil.soundMap[seatId][data.top.cardsCount]) {
                    DZPlaySound.getInstance().playTwoCard(DZPlaySound.getInstance().getChatStr(sex));
                    DZGameUtil.soundMap[seatId][data.top.cardsCount] = 1;
                }
            } else if (data.top.cardsCount == 1) {
                if (!DZGameUtil.soundMap[seatId][data.top.cardsCount]) {
                    DZPlaySound.getInstance().playOneCard(DZPlaySound.getInstance().getChatStr(sex));
                    DZGameUtil.soundMap[seatId][data.top.cardsCount] = 1;
                }
            }

        }
        this.topPokers = data.top.lastCards;
        this.cardType = data.top.cardType;
        //在这儿根据 self.cardType statusConst.handType 来播动画和声音
        if (data.top.cards.length > 0) {
            if (cardResult[0] != null) {
                //var resAudio = cardArranger.getCardsTypeAndInfo(data.top.cards);
                //打牌动画
                this.spineControl.playCardAnimation(data.top.cardType, seatId, this.player_control.getAnimationPostion(seatId));
                //打牌音效
                DZPlaySound.getInstance().playCardSFX(data.top.cardType, cardResult[0].mainValue/*resAudio.value*/, DZPlaySound.getInstance().getChatStr(sex), data);
            }
        } else {
            //过，不要，pass 3个声音随机一个播放
            DZPlaySound.getInstance().playPass(DZGameUtil.random(0, 2), DZPlaySound.getInstance().getChatStr(sex));
        }

        let nextSeatId = DZGameUtil.toLocalSeatId(data.top.nextSid);
        this.playerPanel.showAlarmClock(nextSeatId);

        /**
         * 明牌出牌
         */
        if (data.top.lookCard) {
            for (let i = 0; i < data.top.lookCard.length; i++) {
                let seateId = DZGameUtil.toLocalSeatId(data.top.lookCard[i].sid);
                this.playerPanel.showMingPokers(seateId, data.top.lookCard[i].cards);
            }
        }

        //校验手牌,刚刚打出去那家的
        if (data.top && data.top.topCards && data.top.topCards.length > 0) {
            this.player_control.reloadPokers(data.top.topCards);
        }



        this.player_control.cleaDiscard(nextSeatId);

        if (data.next) {
            this.tipIndex = 0;
            //校验手牌，当前显示按钮的位置，根据服务返回的手牌重新生成一份 此处不做校验了，校验后会把用户提前选的牌放下来
            if (data.next.cards && data.next.cards.length > 0) {
                //this.player_control.reloadPokers(data.next.cards);
            }
            if (data.next.restart) {
                this.topPokers = [];
                this.cardType = "";
                this.addXingPaiBtn(DZConstant.buttonType.sendCard);
                this.update_sendBtn();
                h.log.debug("&&&....我是新一轮");
                this.player_control.clearAllDiscard();
            } else {
                var pokerNums = this.player_control.getAllPokers();
                cc.log('pokerNums:::' + JSON.stringify(pokerNums));
                cc.log('toppokers:::' + JSON.stringify(this.topPokers));
                cc.log('cardType:::' + JSON.stringify(this.cardType));
                cc.log('playType:::' + JSON.stringify(DZGameUtil.playType));
                var tipArray = CardRule.getTargetCards(pokerNums, this.topPokers, this.cardType, DZGameUtil.playType);
                cc.log('lastpokers' + JSON.stringify(this.lastCards));
                cc.log('tipArray' + JSON.stringify(tipArray));

                if (tipArray.length == 0) {
                    if (!data.isReplay) {
                        this.player_control.setTouchNodeEnable(true);
                        this.addXingPaiBtn(DZConstant.buttonType.yaobuqi);
                    }
                } else {
                    if (!data.isReplay) {
                        this.addXingPaiBtn(DZConstant.buttonType.play);
                    }

                }
            }
            this.update_sendBtn();
        }
        //最后一张牌显示地主标记
        this.player_control.showLandlordState();

        if (data.JiPaiQI) {
            this.jipai_control.updateView(data.JiPaiQI);
        }
    }
}