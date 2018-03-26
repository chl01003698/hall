import { h } from "../../../../../../../script/common/H";
import { DZGameView } from "./DZGameView";
import { DZConstant } from "../../common/DZConstant";
import { DZGameUtil } from "../../common/DZGameUtil";
import { DZGameModel } from "./DZGameModel";
import { HallModel } from "../../../../../../../script/view/hall/HallModel";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { DZNetHandler } from "../../common/DZNetHandler";
import {DZPlaySound} from "./sound/DZPlaySound";
import { DZjiesuanModel } from "../../jiesuan/DZjiesuanModel";
import { DZDismissController } from "./dismiss/DZDismissController";
import { HallAlert } from "../../../../../../../script/common/HallAlert";
import { CreateController } from "../../createTable/DZCreateController";
import { DZjiesuanController } from "../../jiesuan/DZjiesuanController";
import { DZHallController } from "../hall/DZHallController";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import {DZBattleReportModel} from "../battleReport/DZBattleReportModel";
import {DZBattleReportController} from "../battleReport/DZBattleReportController";
import { DZFriendViewFromType } from "../friend/DZFriendView";
import { DZReplayController } from "../../replay/DZReplayController";
import { DZToast } from "../../../../../../sz/assets/resources/script/view/common/SZToast";
import {HallToast} from "../../../../../../../script/common/HallToast";
import {HallStringUtil} from "../../../../../../../script/util/HallStringUtil";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { DZLoadingController } from "../loading/DZLoadingController";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import {DZAlert} from "../common/DZAlert";
import { HallFriendController } from "../../../../../../../script/view/friend/HallFriendController";
import { HallFriendViewFromType } from "../../../../../../../script/view/friend/HallFriendView";
import { HallDismissModel } from "../../../../../../../script/view/dismiss/HallDismissModel";
/*
 * @Author: wang jun wei 
 * @Date: 2018-01-20 11:53:15 
 * 
 */

export class DZGameController {

    private static _instance: DZGameController;

    public static getInstance() {
        if (!DZGameController._instance) {
            DZGameController._instance = new DZGameController();
        }
        return DZGameController._instance;
    }
    
    static showDZGameView() {
        h.log.debug("@@@..showDZGameView-->begin");
        cc.director.getScheduler().setTimeScale(1);
        DZGameUtil.game_status = DZConstant.gameProgress.table;
        DZGameUtil.landlordSeatId = -1;
        DZGameUtil.laiziArray = [];
        let view = new DZGameView();
        view.setSign(DZConstant.gameName);
        h.viewManager.popToGameStartView();
        h.viewManager.pushView(view);
        DZGameController.getInstance().addAllEventListen(view);
        DZGameController.checkRestoreInfo();
        DZGameModel.getInstance().setRestoreGameInfo(null);
        h.log.debug("@@@..showDZGameView-->end");
    }

    static checkRestoreInfo(){
        let data = DZGameModel.getInstance().getRestoreGameInfo();
        if (data) {
            //重连进来的
            DZGameModel.getInstance().setRoomConfig(data.roomConfig);
            DZjiesuanModel.getInstance().setCurrentRound(data.currentRound);
            DZjiesuanModel.getInstance().setRoundCount(data.roomConfig.roundCount);
            if(data.results){
                //重连带结算的这个局数已经变成下一局了，这里要减一，否则到倒数第二局重连进来点继续就会直接跳大结算了
                if(data.currentRound > 0){
                    DZjiesuanModel.getInstance().setCurrentRound(data.currentRound-1);
                }
                
                for(let i = 0; i < data.results.length;i++){
                    let resultData = data.results[i];
                    h.log.debug("%%%...重连进来的resultData.playerId=" + resultData.playerId + " getUserID=" + HallUserModel.getInstance().getUserID());
                    if (resultData.playerId == HallUserModel.getInstance().getUserID()) {
                        //自己的数据
                        h.log.debug("%%%...保存自己的结算数据");
                        DZjiesuanModel.getInstance().setData(resultData);
                    }
                }
                let view = h.viewManager.getViewBySign(DZConstant.gameName);
                view.removeAllXingPaiBtn();
                view.clearAllDiscard();
                DZjiesuanController.showJiesuanView();
            }
            //有投票的
            if(data.dissolveInfo){
                HallDismissModel.getInstance().setDismissData(data.dissolveInfo);
                DZDismissController.showDismissView();
            }
        }
    }

    static removeDZGameView(){
        h.viewManager.removeViewBySign(DZConstant.gameName);
    }

    static cleanAllDiscard(){
        let view =  h.viewManager.getViewBySign(DZConstant.gameName);
        view.player_control.clearAllDiscard();
    }
    //检测断线重连
    static checkReconnect() :boolean{
        let data = DZGameModel.getInstance().getRestoreGameInfo();
        h.log.debug("@@@..DouDiZhuController 检测断线重连 checkReconnect=" + JSON.stringify(data));
        if (data) {
            //先读取创建房间配置文件再显示游戏场景
            h.log.debug("@@@...先读取创建房间配置文件再显示游戏场景，回调loadCreateCfgOk");
            CreateController.getTableInfo(DZGameController.loadCreateCfgOk);
            return true;
        }else{
            return false;
        }
    }
    static loadCreateCfgOk(){
        h.log.debug("@@@$$$..加载创建房间配置成功..调用showDZGameView.");
        let data = DZGameModel.getInstance().getRestoreGameInfo();
        if(data){
            if(data.roomConfig){
                DZGameUtil.playType = data.roomConfig.type;
                DZGameUtil.remaining = data.roomConfig.remaining;
                DZGameUtil.sendCards = data.roomConfig.sendCards;
                DZGameUtil.showCard = data.roomConfig.showCard;
            }
            DZGameUtil.tableId = data.roomId;
            DZGameUtil.playerNum = data.playerCount;
        }
        DZGameController.showDZGameView();
    }
    //共有监听消息
    private listBaseEvent: Array<any> = [
        //公共监听接口
        //协议里面带_的都是表示自发给自己的通知，不带_的都是广播
        { event: 'onRestoreGameInfo', callBack: this.onRestoreGameInfo.bind(this) },//通知断线重连恢复玩家数据
        { event: 'onPlayerJoinGame_', callBack: this.onPlayerJoinGame_.bind(this) },//当本玩家加入房间，包含创建加入房间
        { event: 'onPlayerJoinGame', callBack: this.onPlayerJoinGame.bind(this) },//广播有玩家加入房间
    ];

    //游戏监听事件
    private listGameEvent: Array<any> = [
        { event: 'onUpdateCoin', callBack: this.onUpdateCoin.bind(this) },//通知玩家更新房卡
        { event: 'onChat', callBack: this.onChat.bind(this) },//通知系统文字&表情
        { event: 'onChatText', callBack: this.onChatText.bind(this) },//通知玩家聊天     
        { event: 'onGamePlayerLogin', callBack: this.onGamePlayerLogin.bind(this) },//通知玩家重新登录
        { event: 'onGamePlayerLogout', callBack: this.onGamePlayerLogout.bind(this) },//通知玩家离线        
        { event: 'onPlayerLeaveGame', callBack: this.onPlayerLeaveGame.bind(this) },//通知有玩家离开房间
        { event: 'onPlayerSitDown', callBack: this.onPlayerSitDown.bind(this) },//通知玩家坐下
        { event: 'onPlayerStandUp', callBack: this.onPlayerStandUp.bind(this) },//通知玩家站起
        { event: 'onRequestGameDissolve', callBack: this.onRequestGameDissolve.bind(this) },//通知玩家请求解散游戏
        { event: 'onRefreshGameDissolve', callBack: this.onRefreshGameDissolve.bind(this) },//通知玩家刷新解散状态列表
        { event: 'onGameDissolveResult', callBack: this.onGameDissolveResult.bind(this) },//通知玩家解散结果
        { event: 'onGameDestroy', callBack: this.onGameDestroy.bind(this) },//通知游戏销毁
        { event: 'onRoomDestroy', callBack: this.onRoomDestroy.bind(this) },//通知房间销毁      
        { event: 'onGameReady', callBack: this.onReady.bind(this) },//通知玩家准备
        { event: 'onGameFinish', callBack: this.onGameFinish.bind(this) },//通知玩家大结算
        { event: 'dz_onGameStart', callBack: this.dz_onGameStart.bind(this) },//明牌|开始 当发牌中推送明牌时 不包含 gameStart multiple 字段
        { event: 'dz_onShowCard', callBack: this.dz_onShowCard.bind(this) },//发牌中点击明牌
        { event: 'dz_onOutput_', callBack: this.dz_onOutput_.bind(this) },//给自己发牌
        { event: 'dz_onOutput', callBack: this.dz_onOutput.bind(this) },//广播发牌
        { event: 'dz_onMultiple', callBack: this.dz_onMultiple.bind(this) },//推送倍数
        { event: 'dz_onCallZhuang', callBack: this.dz_onCallZhuang.bind(this) },//叫地主
        { event: 'dz_onMakeLandlord_', callBack: this.dz_onMakeLandlord_.bind(this) },//确定地主
        { event: 'dz_onRadio', callBack: this.dz_onRadio.bind(this) },//叫地主|踢拉|出牌 广播
        { event: 'dz_kickPush', callBack: this.dz_kickPush.bind(this) },//推送给某个人显示踢拉按钮
        { event: 'dz_onInput', callBack: this.dz_onInput.bind(this) },//广播打牌
        { event: 'dz_onLiuJu', callBack: this.dz_onLiuJu.bind(this) },//广播流局
        { event: 'dz_onResult', callBack: this.dz_onResult.bind(this) },//广播结算
        { event: 'dz_startInput', callBack: this.dz_startInput.bind(this)},//推拉结束后显示出牌按钮
        { event: 'dz_onResults', callBack: this.dz_onResults.bind(this)},//游戏中战报
        //新加协议显示加不加倍
        { event: 'dz_onDouble', callBack: this.dz_onDouble.bind(this)},//
        { event: 'dz_onReady',  callBack: this.dz_onReady.bind(this)},//点击开始游戏和明牌开始的推送再显示准备那个手
    ];

    //添加共有监听事件
    addBaseListeners() {
        h.log.debug("DouDiZhuController 添加共有监听事件 addBaseListeners");
        for (let i = 0; i < this.listBaseEvent.length; i++) {
            h.log.debug("ddz添加监听-->" + this.listBaseEvent[i].event + " callBack=" + this.listBaseEvent[i].callBack);
            h.net.regPush(this.listBaseEvent[i].event, this.listBaseEvent[i].callBack,DZConstant.gameName);
        }
    }
    //添加具体游戏监听事件
    addGameListeners() {
        h.log.debug("DouDiZhuController 具体游戏监听事件 addGameListeners");
        for (let i = 0; i < this.listGameEvent.length; i++) {
            h.log.debug("添加监听-->" + this.listGameEvent[i].event + " callBack=" + this.listGameEvent[i].callBack);
            h.net.regPush(this.listGameEvent[i].event, this.listGameEvent[i].callBack,DZConstant.gameName);
        }
    }

    addAllEventListen(view) {
        h.log.debug("%%%addAllEventListen= 添加事件");
        //h.eventManager.addListener(DZConstant.dataType.btnCall, this.whole_btn_click.bind(this), view);
    }
    //按钮统一处理事件
    private whole_btn_click(data: any) {
        h.log.debug("%%%whole_btn_click=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        if(data.type != DZConstant.buttonType.tip && data.type != DZConstant.buttonType.weChatFriend && data.type != DZConstant.buttonType.gameFriend){
            if(view){
                view.hideAllPlayerAlarmClock();
            }
        }
        
        if(DZGameUtil.buttonType == DZConstant.buttonType.sendCard || DZGameUtil.buttonType == DZConstant.buttonType.play || DZGameUtil.buttonType == DZConstant.buttonType.notSendCard){
            DZGameUtil.buttonType = data.type;
        }
        switch (data.type) {
            case DZConstant.buttonType.landOwner:
                //叫地主
                h.log.debug("叫地主");
                this.sendLandOwner(data.type);
                break;
            case DZConstant.buttonType.notCall:
                //不抢
                h.log.debug("不抢");
                this.sendLandOwner(data.type);
                break;
            case DZConstant.buttonType.landGrab:
                //抢地主
                h.log.debug("抢地主");
                this.sendLandOwner(data.type);
                break;
            case DZConstant.buttonType.onePoint:
                //1分
                h.log.debug("1分");
                this.sendLandOwner(data.type);
                break;
            case DZConstant.buttonType.twoPoint:
                //2分
                h.log.debug("2分");
                this.sendLandOwner(data.type);
                break;
            case DZConstant.buttonType.threePoint:
                //3分
                h.log.debug("3分");
                this.sendLandOwner(data.type);
                break;
            case DZConstant.buttonType.kick:
                //踢
                h.log.debug("踢");
                this.sendKickPull(data.type);
                break;
            case DZConstant.buttonType.notKick:
                //不踢
                h.log.debug("不踢");
                this.sendKickPull(data.type);
                break;
            case DZConstant.buttonType.pull:
                //拉
                h.log.debug("拉");
                this.sendKickPull(data.type);
                break;
            case DZConstant.buttonType.notPull:
                //不拉
                h.log.debug("不拉");
                this.sendKickPull(data.type);
                break;
            case DZConstant.buttonType.follow:
                //跟
                h.log.debug("跟");
                this.sendKickPull(data.type);
                break;
            case DZConstant.buttonType.notFollow:
                //不跟
                h.log.debug("不跟");
                this.sendKickPull(data.type);
                break;
            case DZConstant.buttonType.giveUp:
                //不出
                h.log.debug("不出");
                view.click_pass(data);
                break;
            case DZConstant.buttonType.yaobuqi:
                //要不起，
                h.log.debug("要不起");
                view.click_pass(data);
                view.recoveryTouchPoker();
                break;
            case DZConstant.buttonType.tip:
                //提示
                h.log.debug("提示");
                view.click_tip();
                break;
            case DZConstant.buttonType.ready:
                //准备
                h.log.debug("准备...调用准备发送");
                HallController.ready(this.clickReadyBtn.bind(this));
                break;
            case DZConstant.buttonType.weChatFriend:
                //微信好友
                h.log.debug("微信好友");
                HallController.inviteWxJoinGame(DZGameUtil.tableId);
                break;
            case DZConstant.buttonType.gameFriend:
                //游戏好友
                h.log.debug("游戏好友");
            
                HallFriendController.showFriendView(HallFriendViewFromType.game);
                break;
            case DZConstant.buttonType.sendCard:
                //打牌
                h.log.debug("打牌");
                view.click_discard(data,false);
                break;
            case DZConstant.buttonType.sendCard_restart:
                //只有一个按钮打牌（新一轮）
                h.log.debug("打牌");
                view.click_discard(data,true);
                break;
            case DZConstant.buttonType.lookCard:
                //明牌
                h.log.debug("明牌");
                break;
            case DZConstant.buttonType.addTimes:
                //加倍
                h.log.debug("加倍");
                this.sendKickPull(data.type);
                break;
            case DZConstant.buttonType.notAddTimes:
                //不加倍
                h.log.debug("不加倍");
                this.sendKickPull(data.type);
                break;
            case DZConstant.buttonType.grasp:
                //闷抓
                h.log.debug("闷抓");
                this.sendLandOwner(data.type);
                break;
            case DZConstant.buttonType.lookCards:
                //看牌
                h.log.debug("看牌");
                this.sendLandOwner(data.type);
                break;
            case DZConstant.buttonType.gsp:
                //抓
                h.log.debug("抓");
                break;
            case DZConstant.buttonType.notGsp:
                //不抓
                h.log.debug("不抓");
                break;
            case DZConstant.buttonType.gameStart:
                h.log.debug("开始按钮。。。");
                //开始 
                DZGameUtil.click_mingpai = false;
                this.gameStartCall(DZGameUtil.multiple, DZConstant.reqType.startGame);
                break;
            case DZConstant.buttonType.showCard:
                //明牌*5
                h.log.debug("明牌*5。。。");
                DZGameUtil.click_mingpai = true;
                this.gameStartCall(DZGameUtil.multiple, DZConstant.reqType.showCards);
                break;
            case DZConstant.buttonType.showCard_2:
                //发牌后点击明牌
                h.log.debug("发牌后点击明牌。。。");
                this.gameLookCards(DZGameUtil.mutilNum, DZConstant.reqType.lookCards);
                break;
        }
    }


    //明牌  开始
    gameStartCall(multiple: number, state: number) {
        let param: any = {
            multiple: multiple,
            state: state, //"1 明牌 | 2 开始 | 3 发牌后点击明牌
        };
        DZGameController.sendData(DZNetHandler.fgame.diZhuHandler.showCards, param, this.clickGameStartBtn.bind(this));
    }

    //发牌中点明牌
    gameLookCards(multiple: number, state: number) {
        let param: any = {
            multiple: multiple,
            state: state, //3 发牌后点击明牌
        };
        DZGameController.sendData(DZNetHandler.fgame.diZhuHandler.lookCards, param, this.clickGameStartBtn.bind(this));
    }

    //叫地主
    sendLandOwner(choose_value: string) {
        let param: any = {
            choosed: choose_value,
        };
        DZGameController.sendData(DZNetHandler.fgame.diZhuHandler.call, param, this.clickLandChooseBtn.bind(this));
    }

    //踢拉
    sendKickPull(choose_value: string) {
        let param: any = {
            choosed: choose_value,
        };
        DZGameController.sendData(DZNetHandler.fgame.diZhuHandler.kickPull, param, this.clickKickPullBtn.bind(this));
    }

    //发送打牌
    sendCardData(cardArr: any, cards_Type: string, sound_restart = false) {
        let param: any = {
            cards: cardArr,
            cardsType: cards_Type,
            soundRestart: sound_restart,
        };
        DZGameController.sendData(DZNetHandler.fgame.diZhuHandler.input, param, this.clickSendCardBtn.bind(this));
    }

    //发送数据
    static sendData(route: string, data: any, callback: Function) {
        h.log.debug("发送route=" + route);
        h.log.debug("发送data=" + JSON.stringify(data));
        h.net.sendData(route, function () {
            if (callback) {
                callback();
            }
        }, data);
    }



    //点击第一步的开始的返回
    clickGameStartBtn() {
        h.log.debug("点击第一步的开始 clickGameStartBtn");
    }
    //点击准备后的返回
    clickReadyBtn() {
        h.log.debug("准备 callback");
    }
    //点击叫地主后的返回
    clickLandChooseBtn() {
        h.log.debug("clickLandChooseBtn");
    }
    //点击推拉的返回
    clickKickPullBtn() {
        h.log.debug("clickKickPullBtn");
    }

    //点击打牌的返回
    clickSendCardBtn() {

    }
    //流局
    // {
    //       flowBureau:{"type":number,"required": true,default:1, "desc": "流局"}
    //   }
    dz_onLiuJu(data: any) {
        h.log.debug("@@@dz_onLiuJu=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
    //    view.cleanAllPoker();
        view.clearLookCard() ;
        h.log.debug("@@@dz_onLiuJu=1");
    }

    //结算
    // {
    //     playerId:{"type":number,"required": true,default:1, "desc": "用户ID"}
    //     type:{ "type": string,  "required": true, "desc": "身份 landlord 地主 farmers 农名"}
    //     win:{"type":number,"required": true,default:1, "desc": "赢取的积分"}
    //     victory:{"type":number,"required": true,default:1, "desc": "1胜利 0失败"}
    //     sid:{"type":number,"required": true,default:1, "desc": "位置ID"}
    //     cards:{"type":array,"required": true,default:1, "desc": "用户手牌"}
    //     isFlowBureau:{"type":number,"required": true,default:1, "desc": "是否流局 1流局 0 非流局"}
    //     grabLandlord:{"type":number,"required": true,default:1, "desc": "抢地主倍数"}
    //     bomb:{"type":number,"required": true,default:1, "desc": "炸弹"}
    //     spring:{"type":number,"required": true,default:1, "desc": "春天"}
    //     brandCard:{"type":number,"required": true,default:1, "desc": "明牌"}
    //     lowCard:{"type":number,"required": true,default:1, "desc": "抓底"}
    //     friedBomb:{"type":number,"required": true,default:1, "desc": "连炸"}
    // }
    dz_onResult(data: any){
        h.log.debug("@@@dz_onResult=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        //DZjiesuanModel.getInstance().setData(data);
        if(view){
            view.removeAllXingPaiBtn();
        }
        HallUtil.schedule(function(){
            h.audioManager.stopBGM();
           // h.audioManager.playMGBByName('youxizhong');
            view.receive_result_data(data);
        }.bind(this), view, 1.5);
        
    }

    //玩家准备
    // { 
    //     "uids": { "type": Array<string>, "required": true, "desc": "已准备玩家Id列表", keys: [{
    //       "type": string, "required": true, "desc": "玩家Id" 
    //      }]},
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" }
    //   }
    private onReady(data: any) {
        h.log.debug("@@@收到准备 onReady data = " + JSON.stringify(data));
        let gameView = h.viewManager.getViewBySign(DZConstant.gameName);
        if(gameView){
            //在这里做每一局开始前状态初始化的工作，比如头像下的倍数，底牌，底牌倍数隐藏，倍数提示等
            if (data.index == DZGameUtil.serverSeatId) {
                //每个人准备或者再开局点继续都会收到这个推送
                gameView.receive_ready_data();
            }
        }
        
        if (data) {
            if(data.index >= 0){
                let seatId = DZGameUtil.toLocalSeatId(data.index);
                let view = h.viewManager.getViewBySign(DZConstant.gameName);
                view.getPlayerPanel().hideOkStatus(seatId, false, false);
            }
            if(data.uids){
                for(let i = 0;i < data.uids.length;i++){
                    let serverSeatId = DZGameModel.getInstance().getSeverSeatId(data.uids[i]);
                    let seatId = DZGameUtil.toLocalSeatId(serverSeatId);
                    h.log.debug(" 已准备serverId =" +  data.uids[i] + " 已准备seatId = " + seatId);
                    let view = h.viewManager.getViewBySign(DZConstant.gameName);
                    view.getPlayerPanel().hideOkStatus(seatId, false, false);
                }
            }
        }

    }

    //显示准备的手
    private dz_onReady(data:any){
        h.log.debug("@@@收到准备 dz_onReady data = " + JSON.stringify(data));
        if(data && data.sid >= 0){
            let seatId = DZGameUtil.toLocalSeatId(data.sid);
            let view = h.viewManager.getViewBySign(DZConstant.gameName);
            view.getPlayerPanel().hideOkStatus(seatId, false, false);
        }
    }



    // 常用语 表情
    // { 
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" },
    //     "type": { "type": number, "required": true, "desc": "0: 文字 1: 表情" },
    //     "index": { "type": number, "required": true, "desc": "所选索引" }
    //   }
    private onChat(data: any) {
        if (data) {
            let view = h.viewManager.getViewBySign(DZConstant.gameName);
            view.onChat(data);
        }
        
    }

    //语音聊天
    // { 
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" },
    //     "text": { "type": string, "required": true, "desc": "玩家输入文字" }
    // }
    private onChatText(data: any) {
        //调用view更新界面
        //this.gameView.
        if (data) {
            let view = h.viewManager.getViewBySign(DZConstant.gameName);
            view.onChatText(data);
        }
    }

    // { 
    //     "coin": { "type": object, "required": true, "desc": "玩家货币", keys: {
    //     "card": { "type": number, "required": true, "desc": "房卡数" }}},
    //     "msg": { "type": string, "required": true, "desc": "更新房卡原因" }
    //   }
    private onUpdateCoin(data: any) {
        h.log.debug("@@@ onUpdateCoin 更新金币" + JSON.stringify(data));
    }


    //共有监听事件--end

    //斗地主监听事件--begin


    //通知房间销毁
    private onGameDestroy(data: any) {
        //这里需要判断是不是解散界面过来的，是解散界面过来的就不能直接退出
        h.log.debug("@@@通知房间销毁onGameDestroy=" + JSON.stringify(data));
        DZPlaySound.getInstance().clearPlayer();
        h.viewManager.removeViewBySign(DZConstant.gameName);
        DZHallController.showDZHallView();
        HallAlert.show("房间已解散");
    }

    private onRoomDestroy(data: any) {
        h.log.debug("@@@通知房间销毁  。。。onRoomDestroy=" + JSON.stringify(data));
        // h.viewManager.removeViewBySign(DZConstant.gameName);
        // HallAlert.show("房间已解散");
        // DZHallController.showDZHallView();
    }

    //当本玩家加入房间 返回结构
    // {
    //     "roomId": { "type": string, "required": true, "desc": "房间号" },
    //     "roomName": { "type": string, "default": "", "desc": "房间名称" },
    //     "currentRound": { "type": number, "required": true, "desc": "当前局数" },
    //     "state": { "type": string, "required": true, "desc": "游戏当前状态" },
    //     "playerCount": { "type": number, "required": true, "desc": "最大房间人数" },
    //     "stateRemain": { "type": number, "default": 0, "desc": "状态剩余秒数" },
    //     "gamePlayers": { "type": Array<GamePlayer>, "required": true, "desc": "玩家列表" },

    //   }
    private onPlayerJoinGame_(data: any) {
        if(!data.roomConfig || data.roomConfig.game != DZConstant.gameName){
            return;
        }
        h.log.debug("@@@ onPlayerJoinGame_自己加入或创建房间" + JSON.stringify(data));
        //x
        DZGameUtil.playType = data.roomConfig.type;
        DZGameUtil.tableId = data.roomId;
        DZGameUtil.remaining = data.roomConfig.remaining;
        DZGameUtil.playerNum = data.playerCount;
        DZGameUtil.sendCards = data.roomConfig.sendCards;
        DZGameUtil.showCard = data.roomConfig.showCard;
        //保存数据
        for(let i = 0; i < data.gamePlayers.length; i++){
            DZPlaySound.getInstance().addPlayerSex(data.gamePlayers[i].id, data.gamePlayers[i].sex);
            DZPlaySound.getInstance().addPlayerIp(data.gamePlayers[i].id, data.gamePlayers[i]);
        }
        DZGameModel.getInstance().setTableData(data);
        if(data.roomConfig){
            DZGameModel.getInstance().setRoomConfig(data.roomConfig);
        }
        
        //保存用户数据
        if(data.gamePlayers){
            for(let i = 0; i < data.gamePlayers.length;i++){
                let playerInfo = data.gamePlayers[i];
                DZGameModel.getInstance().setPlayerData(playerInfo.id, playerInfo);
            }
        }
        let gameName = HallController.getCurGameName();
        h.log.debug("@@@..onPlayerJoinGame_ 当前运行游戏名称=" + gameName);
        if(gameName == DZConstant.gameName){
            h.log.debug("@@@...已经启动子游戏..showDZGameView");
            DZGameController.showDZGameView();
        }else{
            h.log.debug("@@@...没有启动子游戏..先调用 startGame 启动 .再showDZGameView");
            let view = HallController.startGame(DZConstant.gameName);
            h.eventManager.addListener(HallConstant.GameEvent.loaded, function(){
                h.log.debug("@@@...启动子游戏完成，回调..showDZGameView");
                DZGameController.showDZGameView();
            }, view, 1);
        }
        
        if(data.isReplay){
            DZReplayController.showDZReplayView();
        }
    }

    //广播有玩家加入房间
    private onPlayerJoinGame(data: any) {
        let gameName = HallController.getCurGameName();
        if(gameName != DZConstant.gameName){
            return;
        }
        h.log.debug("@@@广播有玩家加入房间" + JSON.stringify(data));
        //保存单个用户信息
        DZGameModel.getInstance().setPlayerData(data.gamePlayer.id,data.gamePlayer);
        DZPlaySound.getInstance().playEnterRoom();
        DZPlaySound.getInstance().addPlayerSex(data.gamePlayer.id, data.gamePlayer.sex);
        DZPlaySound.getInstance().addPlayerIp(data.gamePlayer.id, data.gamePlayer);
        var playerData = this.FN_CheckIp();
        let ipSame = false;
        playerData.forEach((value)=>{
            if(value.length > 1){
                ipSame = true;
            }
        });
        if(ipSame){
            playerData.forEach((value)=>{
                var str = '';
                var list = value;
                for(let i = 0; i < list.length;i++){
                    str += list[i].nickname + "  ";
                }
                HallToast.show(HallStringUtil.format("玩家{0}ip相同",str));
                
                //HallAlert.show(HallStringUtil.format("玩家{0}ip相同",str));
            });
        }
        //先不用消息通知了
        //h.eventManager.dispatchEvent(DZConstant.dataType.otherJoin, data);
        let view = h.viewManager.getViewBySign(DZConstant.gameName);

        h.log.debug(view);
        h.log.debug("====##"+data);
        if(view) {
            view.otherJoin(data);
        }
        h.log.debug("====##===="+data);

        // DZToast.show()
    }

    FN_CheckIp():any{
        let ipMap = new Map();
        let dataList: Array<any> = [];
        let map = DZPlaySound.getInstance().getPlayerIpMap()
        map.forEach((tempData) => {
            if(ipMap.get(tempData.ip) == null){
                dataList.push(tempData);
                ipMap.set(tempData.ip,dataList);
            }else{
                var tempValue = ipMap.get(tempData.ip);
                tempValue.push(tempData);
                ipMap.set(tempData.ip,tempValue);
            }
        })
        // for(let i = 0; i <DZPlaySound.getInstance().getPlayerIpMap().size;i++){
        //     var tempData = DZPlaySound.getInstance().getPlayerIpMap().get();
        //     if(ipMap.get(tempData.ip) == null){
        //         ipMap.set(tempData.ip,tempData);
        //     }else{
        //         dataList.push(tempData);
        //         dataList.push(ipMap[tempData.ip]);
        //         ipMap.set(tempData.ip,dataList);
        //     }
        // }
        return ipMap;
    }

    //创建和加入房间的统一入口
    // private onGameEnter(data: any) {
    //     if (data) {
    //         //房间号
    //         DZGameUtil.tableId = data.roomId;
    //         h.eventManager.dispatchEvent(DZConstant.dataType.enter, data);
    //     }
    // }

    //通知玩家重新登录
    // { 
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" }
    //   }
    private onGamePlayerLogin(data: any) {
        h.log.debug("@@@玩家重新登录 onGamePlayerLogin" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        if(view){
            view.receive_online_data(data);
        }
    }
    // 通知玩家离线
    // { 
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" }
    //   }
    private onGamePlayerLogout(data: any) {
        h.log.debug("@@@玩家离线 onGamePlayerLogout" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_offline_data(data);
    }
    //通知断线重连恢复玩家数据
    // {
    //     "roomId": { "type": string, "required": true, "desc": "房间号" },
    //     "roomName": { "type": string, "default": "", "desc": "房间名称" },
    //     "currentRound": { "type": number, "required": true, "desc": "当前局数" },
    //     "state": { "type": string, "required": true, "desc": "游戏当前状态" },
    //     "playerCount": { "type": number, "required": true, "desc": "最大房间人数" },
    //     "stateRemain": { "type": number, "default": 0, "desc": "状态剩余秒数" },
    //     "gamePlayers": { "type": Array<GamePlayer>, "required": true, "desc": "玩家列表" },

    //   }
    private onRestoreGameInfo(data: any) {
        if(data.roomConfig.game != DZConstant.gameName){
            return;
        }
        h.log.debug("@@@断线重连恢复--DZGameController--onRestoreGameInfo" + JSON.stringify(data));
        DZGameModel.getInstance().setRestoreGameInfo(data);
        if(data){
            if(data.roomConfig){
                DZGameUtil.playType = data.roomConfig.type;
                DZGameUtil.remaining = data.roomConfig.remaining;
                DZGameUtil.sendCards = data.roomConfig.sendCards;
                DZGameUtil.showCard = data.roomConfig.showCard;
            }
            DZGameUtil.tableId = data.roomId;
            DZGameUtil.playerNum = data.playerCount;
        }
        let gameView = h.viewManager.getViewBySign(DZConstant.gameName);
        if(gameView){
            //已经在游戏场景中
            h.log.debug("@@@断线重连恢复--已经在游戏场景中");
            //gameView.updateViewInfo(data);
            //清空一些状态
            DZGameUtil.laiziArray = [];
            DZGameUtil.isDouble = false;
            DZGameUtil.click_mingpai = false;
            DZGameUtil.letBrandNum = 0;
            h.viewManager.removeViewBySign(DZConstant.gameName);
            DZGameController.showDZGameView();
        }else{
            h.log.debug("@@@启动子游戏 " + DZConstant.gameName);
            let view = HallController.startGame(DZConstant.gameName);
            h.log.debug("@@@... 子游戏gameName=" + h.viewManager.getViewBySign(DZConstant.gameName));
            h.log.debug("@@@..添加监听事件HallConstant.GameEvent.loaded");
            h.eventManager.addListener(HallConstant.GameEvent.loaded, function(){
                h.log.debug("@@@..触发HallConstant.GameEvent.loaded,调用加载房间配置loadCreateCfgOk");
                //DZGameController.showDZGameView();
                CreateController.getTableInfo(DZGameController.loadCreateCfgOk);
            }, view, 1);
        }
        
    }

    //明牌|开始
    // {
    //     showCard:  { "type": number,  "required": true, "default":1 "desc": "明牌" },
    //     gameStart: { "type": number,  "required": false, "default":2 "desc": "开始" },
    //     multiple:  { "type": number,  "required": false, "default":5 "desc": "倍数" }
    //   }
    private dz_onGameStart(data: any) {
        h.log.debug("@@@明牌|开始---dz_onGameStart" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.cleanAllPoker();
        DZGameUtil.game_status = DZConstant.gameProgress.game;
        h.log.debug("===========data.gameStart",data.gameStart,data.state);
        if (data.state == 'showCard' && data.gameStart != undefined) {
            //显示明牌和开始
            if(!data.isReplay){
                view.addXingPaiBtn(DZConstant.buttonType.gameStart);
            }
        } else {
            //
            if(!data.isReplay){
                //view.addXingPaiBtn(DZConstant.buttonType.showCard);
            }
        }
        view.showMingPaiCards(false) ;
    }

    //发牌中点击明牌
    // {
    //     cards:  { "type": array<string>,  "required": true, "desc": "用户的手牌" },
    //     sid:    { "type": number,  "required": true, "desc": "位置ID" },
    //     uid:    { "type": string,  "required": true, "desc": "用户ID" }
    //   }
    private dz_onShowCard(data: any) {
        h.log.debug("@@@发牌中点击明牌---dz_onShowCard" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_brightCard_data(data);
    }

    //发牌
    // {
    //     cards:  { "type": array<string>,  "required": true, "desc": "用户的手牌" },
    //     cardsCount:{"type":number,"require":true,"desc":"手牌数量"},
    //     showCards:[{
    //       cards:{ "type": array<string>,  "required": true, "desc": "用户的手牌" },
    //       sid:{ "type": number,  "required": true, "desc": "位置ID" },
    //       uid:{ "type": string,  "required": true, "desc": "用户ID" },
    //       cardCount:{ "type": number,  "required": true, "desc": "用户手牌数量" },
    //     }]
    //   }
    private dz_onOutput(data: any) {
        h.log.debug("@@@发牌---dz_onOutput" + JSON.stringify(data));
    }

    //给自己发牌
    // {
    //     cards:  { "type": array<string>,  "required": true, "desc": "用户的手牌" },
    //     cardsCount:{"type":number,"require":true,"desc":"手牌数量"},
    //     showCards:[{
    //       cards:{ "type": array<string>,  "required": true, "desc": "用户的手牌" },
    //       sid:{ "type": number,  "required": true, "desc": "位置ID" },
    //       uid:{ "type": string,  "required": true, "desc": "用户ID" },
    //       cardCount:{ "type": number,  "required": true, "desc": "用户手牌数量" },
    //     }]
    //   }
    private dz_onOutput_(data: any) {
        h.log.debug("@@@给自己发牌---dz_onOutput_" + JSON.stringify(data));
        DZGameUtil.game_status = DZConstant.gameProgress.game;
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        if(view){
            view.sendCard(data);
        }
    }

    //通知有玩家离开房间
    // {
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" },
    //     "reason": { "type": string, "default": "", "desc": "开发房间原因" }
    //   }
    private onPlayerLeaveGame(data: any) {
        h.log.debug("@@@通知有玩家离开房间---onPlayerLeaveGame-" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_quitGame_data(data);
    }


    //通知玩家坐下
    // {
    //     "gamePlayer": { "type": GamePlayer, "required": true, "desc": "玩家信息" }
    //   }
    private onPlayerSitDown(data: any) {
        h.log.debug("@@@通知玩家坐下---onPlayerSitDown-" + JSON.stringify(data));
    }

    //通知玩家站起
    // {
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" }
    //   }
    private onPlayerStandUp(data: any) {
        h.log.debug("@@@通知玩家站起---onPlayerStandUp-" + JSON.stringify(data));
    }

    //通知玩家请求解散游戏
    // {
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" },
    //     "seconds": { "type": number, "required": true, "desc": "解散倒计时秒数" },
    //     "states": { "type": any, "required": true, "desc": "玩家解散状态" }
    //   }
    private onRequestGameDissolve(data: any) {
        h.log.debug("@@@通知玩家请求解散游戏-->此时显示解散面板...onRequestGameDissolve=" + JSON.stringify(data));
        HallDismissModel.getInstance().setDismissData(data);
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_dismiss_notify_data(data);
    }

    //通知玩家刷新解散状态列表
    //    {
    //     "uid": { "type": string, "required": true, "desc": "玩家Id" },
    //     "states": { "type": any, "required": true, "desc": "玩家解散状态" }
    //   }
    private onRefreshGameDissolve(data: any) {
        h.log.debug("@@@通知玩家刷新解散状态列表onRefreshGameDissolve=" + JSON.stringify(data));
        HallDismissModel.getInstance().setDismissData(data);
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_dismiss_refresh_data(data);
    }

    //通知玩家解散结果
    // {
    //     "result": { "tyoe": boolean, "required": true, "desc": "true: 解散成功 | false: 解散失败" }
    //   }
    private onGameDissolveResult(data: any) {
        h.log.debug("@@@通知玩家解散结果onGameDissolveResult=" + JSON.stringify(data));
        if(data && data.result){
            DZGameUtil.dismiss_suc = true;
        }else{
            DZGameUtil.dismiss_suc = false;
        }
        HallDismissModel.getInstance().setDismissData(data);
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_dismiss_result_data(data);
    }

    //推送倍数
    // {
    //     playerInfo:{
    //       sid:{ "type": number,  "required": true, "desc": "位置ID"} ,
    //       mutiple:{ "type": number,  "required": true, "desc": "倍数"} ,
    //       uid: { "type": number,  "required": true, "desc": "用户ID"} 
    //     }
    //   }
    private dz_onMultiple(data: any) {
        h.log.debug("@@@dz_onMultiple=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        if(view){
            view.receive_totalMultiple_data(data);
        }
    }

    //叫地主
    // {
    //     action:{
    //       "state":{ "type": string,  "required": true,"default":"landOwner/callPoints/landGrab", "desc": "landOwner 叫地主 | callPoints 叫分 | landGrab 抢地主"},
    //       "action": {
    //         "landOwner|landGrab": { "type": string|array,  "required": true,"default":"landOwner/[1,2,3]/landGrab", "desc": "landOwner 叫地主 | [1,2,3] 叫分 | landGrab 抢地主"}, 
    //         "notCall":  { "type": string,  "required": true,"default":"notCall", "desc": "notCall 不叫/不抢"}    //不叫地主
    //       }
    //       "sid":{ "type": number,  "required": true, "desc": "位置ID"},
    //     }
    //   }
    private dz_onCallZhuang(data: any) {
        h.log.debug("@@@dz_onCallZhuang=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        h.log.debug("data.sid =" + data.sid );
        h.log.debug("DZGameUtil.serverSeatId =" + DZGameUtil.serverSeatId );
        if(view){
            view.receive_call_zhuang_data(data);
        }
        if (data.sid == DZGameUtil.serverSeatId) {
            if (data.action) {
                if (data.state) {
                    h.log.debug("setCallZhongData...data.state=" +data.state );
                    //grasp 闷抓 看牌  landOwner 叫地主 不叫  callPoints 叫分 landGrab 抢地主
                    h.log.debug("data.timely=" + data.timely);
                    if(data.isFlip){
                        view.showTurnCards(data) ;
                    }
                    if(data.timely){
                        //timely代表是否立即显示按钮 有的话立即显示，没有的话延后显示
                        h.log.debug("立即显示");
                        if(!data.isReplay){
                            view.addXingPaiBtn(data.state,data.action);
                        }                       
                    }else{
                        h.log.debug("延后显示");
                        DZGameModel.getInstance().setCallZhongData(data);
                    }
                }
            }
        }

    }

    //确定地主
    // {
    //     action:{
    //       "isFile":{ "type": boolean,  "required": true,"default":"true", "desc": "是否需要翻拍 true 否 | false 是"},
    //       "action": {
    //         "kick|sendCard": { "type": string,  "required": true,"default":"kick|sendCard", "desc": "kick 踢 | sendCard 出牌"}, 
    //         "notKick":  { "type": string,  "required": true,"default":"notKick", "desc": "notKick 不踢"}   
    //       }
    //       "state":{ "type": string,  "required": true,"default":"kick|sendCard", "desc": "kick 踢 | sendCard 出牌"},
    //       "speakSid":{ "type": number,  "required": true, "desc": "说话位置ID"},
    //       "speakUid":{ "type": string,  "required": true, "desc": "说话的uid"},
    //       "cards":{ "type": array<string>,  "required": true, "desc": "地主牌或者是翻牌 ","note":"只要本人能收到"},
    //       "identity":{ "type": string,  "required": true, "desc": "身份 landlord 地主 farmers 农名"},
    //       "landlordSid":{ "type": number,  "required": true, "desc": "说话位置ID"},
    //       "landlordUid":{ "type": string,  "required": true, "desc": "说话的uid"},
    //       "zhuangCards":{ "type": array<string>,  "required": true, "desc": "底牌"}
    //     }
    //   }
    private dz_onMakeLandlord_(data: any) {
        h.log.debug("@@@dz_确认地主_=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_identity_Lord_data(data);
        view.showMingPaiCards(true) ;
    }

    //根据sid显示出牌按钮
    private dz_startInput(data: any){
        h.log.debug("@@@dz_startInput=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_startInput_data(data);
    }
    //游戏中战报
    private dz_onResults(data: any){
        h.log.debug("@@@dz_onResults=" + JSON.stringify(data));
        DZBattleReportModel.getInstance().FN_SetShowAll(false);
        DZBattleReportModel.getInstance().FN_SetIsGaming(true);
        DZBattleReportModel.getInstance().FN_SetTotalData(data);
        DZBattleReportController.showBattleReportView();
    }

    //新增加协议
    private dz_onDouble(data: any){
        h.log.debug("@@@dz_onDouble=" + JSON.stringify(data));
        DZGameUtil.isDouble = true;
        setTimeout(() => {
            let view = h.viewManager.getViewBySign(DZConstant.gameName);
            view.receive_onDouble_data(data);
        }, 3000);
    }


    //叫地主|踢拉|出牌 广播
    // {
    //     "choosed":{ "type": string,  "required": true,"default":"kick|sendCard|landOwner|landGrab|notCall", "desc": "kick 踢 | sendCard 出牌 | landOwner 叫地主 | landGrab 抢地主|notCall | 不抢"}
    //     "sid":{ "type": number,  "required": true, "desc": "位置ID"},
    //   }
    private dz_onRadio(data: any) {
        h.log.debug("@@@dz_叫地主|踢拉|出牌 广播_=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_lord_choosed_data(data);
    }

    //踢拉(推送只是该谁显示的那一个人)
    // {
    //     "action": {
    //       "kick|sendCard|follow|pull": { "type": string,  "required": true,"default":"kick|sendCard|follow|pull", "desc": "kick 踢 | sendCard 出牌|follow 跟|pull 拉"}, 
    //       "notKick|notFollow|notPull":  { "type": string,  "required": true,"default":"notKick|notFollow|notPull", "desc": "notKick 不踢|notFollow 不跟 |notPull 不拉"}   
    //     }
    //     "state":{ "type": string,  "required": true,"default":"kick|sendCard|follow|pull", "desc": "kick 踢 | sendCard 出牌|follow 跟|pull 拉"},
    //     "sid":{ "type": number,  "required": true, "desc": "说话人的位置ID"},
    //     "playerId":{ "type": string,  "required": true, "desc": "说话的uid"},
    //   }
    private dz_kickPush(data: any) {
        h.log.debug("@@@dz_kickPush=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_kickPull_data(data);
    }
    //监听打牌数据
    private dz_onInput(data: any) {
        h.log.debug("@@@dz_onInput=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_play_data(data);
    }

    //通知玩家大结算
    // {
    //     "results": { "type": Array<any>, "required": true, "desc": "玩家Id", keys: [{
    //       "uid": { "type": string, "required": true, "desc": "玩家Id" },
    //       "isGuest": { "type": boolean, "required": true, "desc": "是否是游客账号" },
    //       "score": { "type": number, "required": true, "desc": "总的输赢积分" },
    //       "winCount": { "type": number, "required": true, "desc": "玩家赢局数" },
    //       "loseCount": { "type": number, "required": true, "desc": "玩家输局数" },
    //       "drawCount": { "type": number, "required": true, "desc": "玩家平局数" }
    //     }]}
    //   }
    private onGameFinish(data: any) {
        h.log.debug("@@@onGameFinish=" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.receive_totalResult_data(data);
    }


    dismissDeal() {
        let view = h.viewManager.getViewBySign(DZConstant.gameName);
        view.dismissDeal();
    }
}