import { h } from "../../../../../../../script/common/H";
import NNgameView from "./NNgameView";
import { NNConstant } from "../../common/NNConstant";
import { HallAlert } from "../../../../../../../script/common/HallAlert";
import { NNNetHandler } from "../../common/NNNetHandler";
import { NNGameUtil } from "../../common/NNGameUtil";
import NNgameModel from "./NNgameModel";
import { DZjiesuanController } from "../../../../../../dz/assets/resources/script/jiesuan/DZjiesuanController";
import { NNbudgetController } from "../budeget/NNbudgetController";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { NNFightRecordController } from "../fightRecord/NNFightRecordController";
import { NNFightReportController } from "../fightReport/NNFightReportController";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { NNHallController } from "../hall/NNHallController";
import { HallDismissModel } from "../../../../../../../script/view/dismiss/HallDismissModel";


export default class NNgameControler {
    private static _instance: NNgameControler;

    /**
     * 创建牛牛桌子
     * 
     * @static
     * @memberof NNgameControler
     */
    static showGameView() {
        let view: NNgameView = new NNgameView();
        view.setSign(NNConstant.gameName);
        h.viewManager.pushView(view);
        NNgameControler.checkRestoreInfo();
    }

    static checkRestoreInfo() {
        let data = NNgameModel.getInstance().getRestoreGameInfo();
        if (data) {
            //重连进来的
            NNgameModel.getInstance().setRoomConfig(data.roomConfig);
            if(data.results){
                for(let i = 0; i < data.results.length;i++){
                    let resultData = data.results[i];
                    h.log.debug("%%%...重连进来的resultData.playerId=" + resultData.playerId + " getUserID=" + HallUserModel.getInstance().getUserID());
                }
            }
        }
    }

    /**
     * 
     * 单例
     * @static
     * @returns 
     * @memberof NNgameControler
     */
    public static getInstance() {
        if (!NNgameControler._instance) {
            NNgameControler._instance = new NNgameControler();
        }
        return NNgameControler._instance;
    }

    /**
     * 移除牛牛游戏场景
     * 
     * @static
     * @memberof NNgameControler
     */
    static removeNNGameView(){
        h.viewManager.removeViewBySign(NNConstant.gameName);
    }


     //共有监听消息
     private listBaseEvent: Array<any> = [
        //公共监听接口
        //协议里面带_的都是表示自发给自己的通知，不带_的都是广播
        { event: 'onUpdateCoin', callBack: this.onUpdateCoin.bind(this) },//通知玩家更新房卡
        { event: 'onChat', callBack: this.onChat.bind(this) },//通知系统文字&表情
        { event: 'onChatText', callBack: this.onChatText.bind(this) },//通知玩家聊天     
        { event: 'onGamePlayerLogin', callBack: this.onGamePlayerLogin.bind(this) },//通知玩家重新登录
        { event: 'onGamePlayerLogout', callBack: this.onGamePlayerLogout.bind(this) },//通知玩家离线
        { event: 'onPlayerLeaveGame', callBack: this.onPlayerLeaveGame.bind(this) },//通知有玩家离开房间
        { event: 'onRequestGameDissolve', callBack: this.onRequestGameDissolve.bind(this) },//通知玩家请求解散游戏
        { event: 'onRefreshGameDissolve', callBack: this.onRefreshGameDissolve.bind(this) },//通知玩家刷新解散状态列表
        { event: 'onGameDissolveResult', callBack: this.onGameDissolveResult.bind(this) },//通知玩家解散结果
        { event: 'onGameDestroy', callBack: this.onGameDestroy.bind(this) },//通知游戏销毁
        { event: 'onGameReady', callBack: this.onReady.bind(this) },//通知玩家准备
        { event: 'onGameUnready', callBack: this.onUnready.bind(this) },//通知玩家取消准备
        { event: 'onGameCountDown', callBack: this.onCountDown.bind(this) },//通知玩家游戏内倒计时
        { event: 'onGameFinish', callBack: this.onGameFinish.bind(this) },//通知玩家大结算
        
        { event: 'nn_onOutput', callBack:this.nn_onOutput.bind(this)}, // 自家发牌
        { event: 'nn_onScanCard', callBack: this.nn_onScanCard.bind(this) },//看牌
        { event: 'nn_onMatchCard', callBack: this.nn_onMatchCard.bind(this) },//比牌
        { event: 'nn_onShowCard', callBack: this.nn_onShowCard.bind(this) },//向其他人展示牌
        { event: 'nn_onLootZhuang', callBack: this.nn_onLootZhuang.bind(this) },//抢庄
        { event: 'nn_onSetZhuang', callBack: this.nn_onSetZhuang.bind(this) },//确定庄
        { event: 'nn_onBottomPour', callBack: this.nn_onBottomPour.bind(this) },//下注
        { event: 'nn_onRoundOver', callBack: this.nn_onRoundOver.bind(this) },//一局结束
        { event: 'nn_onGameOver', callBack: this.nn_onGameOver.bind(this) },//游戏结束
    ];

    //要移出来了的
    private listcommon: Array<any> = [
        { event: 'onRestoreGameInfo', callBack: this.onRestoreGameInfo.bind(this) },//通知断线重连恢复玩家数据
        { event: 'onPlayerJoinGame_', callBack: this.onPlayerJoinGame_.bind(this) },//当本玩家加入房间，包含创建加入房间
        { event: 'onPlayerJoinGame', callBack: this.onPlayerJoinGame.bind(this) },//广播有玩家加入房间
    ];


    //添加监听事件
    addBaseListeners() {
        h.log.debug("DouDiZhuController 添加监听 addGameListeners");
        for (let i = 0; i < this.listBaseEvent.length; i++) {
            h.log.debug("添加监听-->" + this.listBaseEvent[i].event + " callBack=" + this.listBaseEvent[i].callBack);
            h.net.regPush(this.listBaseEvent[i].event, this.listBaseEvent[i].callBack,NNConstant.gameName);
        }
    }

    //添加公共事件
    addCommonListeners() {
        h.log.debug("NNgameControler 添加监听 addCommonListeners");
        for (let i = 0; i < this.listcommon.length; i++) {
            h.log.debug("添加监听公共-->" + this.listcommon[i].event + " callBack=" + this.listcommon[i].callBack);
            h.net.regPush(this.listcommon[i].event, this.listcommon[i].callBack,NNConstant.gameName);
        }
    }

    private nn_onOutput(data: any) {
        NNGameUtil.game_status = NNConstant.gameProgress.game
        h.log.debug("-----wx nn_onOutput data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onOutput(data);
    }
    
    private nn_onScanCard(data: any) {
        h.log.debug("-----wx nn_onScanCard data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onScanCard(data);
    }
    
    private nn_onMatchCard(data: any) {
        h.log.debug("-----wx nn_onMatchCard data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onMatchCard(data);
    }
    
    private nn_onShowCard(data: any) {
        h.log.debug("-----wx nn_onShowCard data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onShowCard(data);
    }
    
    private nn_onLootZhuang(data: any) {
        h.log.debug("-----wx nn_onLootZhuang data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onLootZhuang(data);
    }
    
    private nn_onSetZhuang(data: any) {
        h.log.debug("-----wx nn_onSetZhuang data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onSetZhuang(data);
    }
    
    private nn_onBottomPour(data: any) {
        h.log.debug("-----wx nn_onBottomPour data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onBottomPour(data);
    }
    
    private nn_onRoundOver(data: any) {
        h.log.debug("-----wx nn_onGameOver data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onRoundOver(data);
    }
    
    private nn_onGameOver(data: any) {
        NNGameUtil.game_status = NNConstant.gameProgress.vote
        h.log.debug("-----wx nn_onGameOver data = ", data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onGameOver(data);
    }

    //刷新房卡
    private onUpdateCoin(data: any) {
        h.log.debug("#### onUpdateCoin 更新金币" + JSON.stringify(data));
    }

    //常用语聊天
    private onChat(data: any) {
        h.log.debug("#### onChat 常用语聊天" + JSON.stringify(data));
        if (data) {
            let view = h.viewManager.getViewBySign(NNConstant.gameName);
            //view.onChat(data);
        }
    }

    //语音聊天
    private onChatText(data: any) {
        h.log.debug("#### onChatText 语音聊天" + JSON.stringify(data));
        if (data) {
            let view = h.viewManager.getViewBySign(NNConstant.gameName);
            view.onChatText(data);
        }
    }

    //通知玩家重新登录
    private onGamePlayerLogin(data: any) {
        h.log.debug("####  玩家重新登录 onGamePlayerLogin" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        if(view) {
            view.receive_online_data(data);
        }
    }

     // 通知玩家离线
    private onGamePlayerLogout(data: any) {
        h.log.debug("####  玩家离线 onGamePlayerLogout" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        if(view) {
            view.receive_offline_data(data);
        }
    }


     //通知断线重连恢复玩家数据
    private onRestoreGameInfo(data: any) {
        if(data.roomConfig.game != NNConstant.gameName){
            return;
        }
        h.log.debug("####  断线重连恢复---onRestoreGameInfo" + JSON.stringify(data));
        NNgameModel.getInstance().setRestoreGameInfo(data);
        let view = HallController.startGame(NNConstant.gameName);
        cc.log('## onRestoreGameInfo');
        h.eventManager.addListener(HallConstant.GameEvent.NNLoaded, function(){
            cc.log('## onRestoreGameInfo1111');
            NNgameControler.showGameView();
        }, view, 1);
    }


    //当本玩家加入房间 返回结构
    private onPlayerJoinGame_(data: any) {
        if(!data.roomConfig || data.roomConfig.game != NNConstant.gameName){
            return;
        }
        h.log.debug("####  自己加入或创建房间" + JSON.stringify(data));
        //保存数据
        NNgameModel.getInstance().setTableData(data);

        //保存用户数据
        if(data.gamePlayers){
            for(let i = 0; i < data.gamePlayers.length;i++){
                let playerInfo = data.gamePlayers[i];
                NNgameModel.getInstance().setPlayerData(playerInfo.id, playerInfo);
            }
        }
        NNgameControler.showGameView();
    }


     //广播有玩家加入房间
     private onPlayerJoinGame(data: any) {
        let gameName = HallController.getCurGameName();
        if(gameName != NNConstant.gameName){
            return;
        }
        h.log.debug("####  广播有玩家加入房间" + JSON.stringify(data));
        NNgameModel.getInstance().setPlayerData(data.gamePlayer.id,data.gamePlayer);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        if(view) {
            view.otherJoin(data);
        }
    }

     //通知有玩家离开房间
    private onPlayerLeaveGame(data: any) {
        h.log.debug("####  通知有玩家离开房间---onPlayerLeaveGame-" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.receive_quitGame_data(data);
    }

    //通知玩家请求解散游戏
    private onRequestGameDissolve(data: any) {
        h.log.debug("####  通知玩家请求解散游戏-->此时显示解散面板...onRequestGameDissolve=" + JSON.stringify(data));
        HallDismissModel.getInstance().setDismissData(data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.receive_dismiss_notify_data(data);
    }

    //通知玩家刷新解散状态列表
    //{
    //  "uid": { "type": string, "required": true, "desc": "玩家Id" },
    //  "states": { "type": any, "required": true, "desc": "玩家解散状态" }
    //}
    private onRefreshGameDissolve(data: any) {
        h.log.debug("####  通知玩家刷新解散状态列表onRefreshGameDissolve=" + JSON.stringify(data));
        HallDismissModel.getInstance().setDismissData(data);
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.receive_dismiss_refresh_data(data);
    }

    //通知玩家解散结果
    //{
    //  "result": { "tyoe": boolean, "required": true, "desc": "true: 解散成功 | false: 解散失败" }
    //}
    private onGameDissolveResult(data: any) {
        h.log.debug("####  通知玩家解散结果onGameDissolveResult=" + JSON.stringify(data));
    }

    //通知房间销毁
    private onGameDestroy(data: any) {
        h.log.debug("####  通知房间销毁onGameDestroy=" + JSON.stringify(data))
        HallAlert.show("房间已解散")
        h.viewManager.removeViewBySign(NNConstant.gameName)
        NNHallController.showHallView()
    }

    //玩家准备
    private onReady(data: any) {
        h.log.debug("####  收到准备 onReady data = " + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.setReadyState(data);
    }

    //玩家取消准备
    private onUnready(data: any) {
        h.log.debug("####  收到取消准备 onUnready data = " + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.setUnreadyState(data);
    }

    //通知玩家倒计时
    private onCountDown(data: any) {
        h.log.debug("####  onCountDown data = " + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(NNConstant.gameName);
        view.onCountDown(data);
    }

    //通知玩家大结算
    private onGameFinish(data: any) {
        h.log.debug("####  onGameFinish=" + JSON.stringify(data));
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////调用服务器接口 start////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 抢庄
     * @param callback 
     */
    static lootZhuang(callback:Function, data:any){
        h.net.sendData(NNNetHandler.fgame.NNHandler.lootZhuang, function(){
            if(callback){
                callback();
            }
        }, data);
    }

    /**
     * 下注
     * @param callback 
     */
    static bottomPour(callback:Function, data:any){
        h.net.sendData(NNNetHandler.fgame.NNHandler.bottomPour, function(){
            if(callback){
                callback();
            }
        }, data);
    }

    /**
     * 配牌
     * @param callback 
     */
    static matchCard(callback:Function, data:any){
        h.net.sendData(NNNetHandler.fgame.NNHandler.matchCard, function(){
            if(callback){
                callback();
            }
        }, data);
    }

    // 战报
    static getResult(){
        this.sendData(NNNetHandler.fgame.NNHandler.getResults, null, null);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////调用服务器接口 end////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
