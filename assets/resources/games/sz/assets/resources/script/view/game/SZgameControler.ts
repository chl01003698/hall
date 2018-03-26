import { h } from "../../../../../../../script/common/H";
import SZgameView from "./SZgameView";
import { SZConstant } from "../../common/SZConstant";
import { HallAlert } from "../../../../../../../script/common/HallAlert";
import { SZNetHandler } from "../../common/SZNetHandler";
import { SZGameUtil } from "../../common/SZGameUtil";
import SZgameModel from "./SZgameModel";
import { DZjiesuanController } from "../../../../../../dz/assets/resources/script/jiesuan/DZjiesuanController";
import { SZbudgetController } from "../budeget/SZbudgetController";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { SZFightRecordController } from "../fightRecord/SZFightRecordController";
import { SZFightReportController } from "../fightReport/SZFightReportController";
import { SZFightReportModel } from "../fightReport/SZFightReportModel";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import SZPlaySound from "../../common/SZPlaySound";


export default class SZgameControler{
    static selfGiveUp: boolean;
    private static _instance: SZgameControler;

    /**
     * 创建三张桌子
     * 
     * @static
     * @memberof SZgameControler
     */
    static showGameView() {    
        let view: SZgameView = new SZgameView();
        view.setSign(SZConstant.gameName);
        //h.viewManager.popToGameStartView();
        h.viewManager.pushView(view);
        SZgameControler.checkRestoreInfo();

        //SZgameModel.getInstance().setRestoreGameInfo(null);
    }

    static checkRestoreInfo(){
        let data = SZgameModel.getInstance().getRestoreGameInfo();
        if (data) {
            //重连进来的
            SZgameModel.getInstance().setRoomConfig(data.roomConfig);
            //DZjiesuanModel.getInstance().setCurrentRound(data.currentRound);
            //DZjiesuanModel.getInstance().setRoundCount(data.roomConfig.roundCount);
            if(data.results){
                //重连带结算的这个局数已经变成下一局了，这里要减一，否则到倒数第二局重连进来点继续就会直接跳大结算了
                if(data.currentRound > 0){
                    //DZjiesuanModel.getInstance().setCurrentRound(data.currentRound-1);
                }
                
                for(let i = 0; i < data.results.length;i++){
                    let resultData = data.results[i];
                    h.log.debug("%%%...重连进来的resultData.playerId=" + resultData.playerId + " getUserID=" + HallUserModel.getInstance().getUserID());
                    // if (resultData.playerId == HallUserModel.getInstance().getUserID()) {
                    //     //自己的数据
                    //     h.log.debug("%%%...保存自己的结算数据");
                    //     //DZjiesuanModel.getInstance().setData(resultData);
                    // }
                }
                let view = h.viewManager.getViewBySign(SZConstant.gameName);
                //DZjiesuanController.showJiesuanView();
            }
        }
    }


    /**
     * 
     * 单例
     * @static
     * @returns 
     * @memberof SZgameControler
     */
    public static getInstance() {
        if (!SZgameControler._instance) {
            SZgameControler._instance = new SZgameControler();
        }
        return SZgameControler._instance;
    }

    /**
     * 移除三张游戏场景
     * 
     * @static
     * @memberof SZgameControler
     */
    static removeSZGameView(){
        h.viewManager.removeViewBySign(SZConstant.gameName);
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
        { event: 'onGameCancelReady', callBack: this.onGameCancelReady.bind(this) },//通知玩家准备
        { event: 'onGameFinish', callBack: this.onGameFinish.bind(this) },//通知玩家大结算
        
        { event: 'sz_onResults', callBack:this.sz_onResults.bind(this)}, // 战报
        { event: 'sz_onGameStart', callBack: this.sz_onGameStart.bind(this) },//通知开始三张游戏
        { event: 'sz_onFirstInput', callBack: this.sz_onFirstInput.bind(this) },//通知第一次跟注|加注|比牌消息
        { event: 'sz_onInput', callBack: this.sz_onInput.bind(this) },//通知有玩家跟注|加注|比牌消息
        { event: 'sz_onOutput', callBack: this.sz_onOutput.bind(this) },//通知玩家发牌消息
        { event: 'sz_onBeatGroup', callBack: this.sz_onBeatGroup.bind(this) },//通知比牌结果
        { event: 'sz_onPaiCai', callBack: this.sz_onPaiCai.bind(this) },//通知派彩结果
        { event: 'sz_onGameOver', callBack: this.sz_onGameOver.bind(this) },//通知游戏结束
        { event: 'sz_onRadio', callBack: this.sz_onRadio.bind(this)},   //加注广播
        { event: 'sz_onBiPai', callBack: this.sz_onBiPai.bind(this)},   //加注广播
        { event: 'sz_onShowCards_', callBack: this.sz_onShowCards_.bind(this)},   //看牌
        { event: 'sz_onBiPaiPlayers_', callBack: this.sz_onBiPaiPlayers_.bind(this)},   //看牌
        { event: 'sz_onGameResult', callBack: this.sz_onGameResult.bind(this)},   //结算
        { event: 'sz_onShowCards', callBack: this.sz_onShowCards.bind(this)},   //亮牌
        { event: 'sz_onQunBi', callBack: this.sz_onQunBi.bind(this)},   //群比
        { event: 'sz_onJieSuan', callBack: this.sz_onJieSuan.bind(this)},   //结算前倒计时

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
            h.net.regPush(this.listBaseEvent[i].event, this.listBaseEvent[i].callBack,SZConstant.gameName);
        }
    }

    //添加公共事件
    addCommonListeners() {
        h.log.debug("DouDiZhuController 添加监听 addGameListeners11");
        for (let i = 0; i < this.listcommon.length; i++) {
            h.log.debug("添加监听公共-->" + this.listcommon[i].event + " callBack=" + this.listcommon[i].callBack);
            h.net.regPush(this.listcommon[i].event, this.listcommon[i].callBack,SZConstant.gameName);
        }
    }

    //操作广播
    sz_onRadio(data:any) {
        h.log.debug("#### sz_onRadio 操作广播" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.updateChips(data);
        switch(data.state) {
            case SZConstant.outputState.follow:     //跟注
                let localSeatIdgen = SZGameUtil.toLocalSeatId(data.sid);
                view.throwJetton(localSeatIdgen,data.chip);
                SZPlaySound.getInstance().playGenzhu(SZgameModel.getInstance().getPlayerSex(data.uid));
            break;
            case SZConstant.outputState.bet:        //加注
                let localSeatIdadd = SZGameUtil.toLocalSeatId(data.sid);
                view.throwJetton(localSeatIdadd,data.chip);
                SZPlaySound.getInstance().playJiazhu(SZgameModel.getInstance().getPlayerSex(data.uid));
            break;
            case SZConstant.outputState.bipai:      //比牌
                SZPlaySound.getInstance().playBibai(SZgameModel.getInstance().getPlayerSex(data.uid));
                view.receive_bipai(data);
            break;
            case SZConstant.outputState.qipai:      //弃牌
                view.receive_qipai(data);
            break;
            case SZConstant.outputState.kanpai:      //看牌
                view.receive_kanpai(data);
            break;
            case SZConstant.outputState.huopin:     //火拼
                SZPlaySound.getInstance().playHuopinMusic(SZgameModel.getInstance().getPlayerSex(data.uid));
                let localSeatIdHuo = SZGameUtil.toLocalSeatId(data.sid);
                view.throwJetton(localSeatIdHuo,data.chip);
                if(data.isInitiateHuoPin) {
                    view.sethotFightActive(true);
                    SZPlaySound.getInstance().playHuopin();
                }
            break;
        }
    }

    //通知开始三张游戏
    private sz_onGameStart(data:any) {
        h.log.debug("#### sz_onGameStart 通知开始三张游戏" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.onReceiveStart(data);
    }

    //通知第一次跟注|加注|比牌消息
    private sz_onFirstInput(data:any) {
        h.log.debug("#### sz_onFirstInput 通知第一次跟注|加注|比牌消息" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.receive_firstInput(data);
    }


    //知有玩家跟注|加注|比牌消息
    private sz_onInput(data:any) {
        h.log.debug("#### sz_onInput 通通知有玩家跟注|加注|比牌消息" + JSON.stringify(data));
    }

    

    //通知玩家发牌消息
    private sz_onOutput(data:any) {
        h.log.debug("#### sz_onOutput 通知玩家发牌消息" + JSON.stringify(data));
    }

    //通知比牌结果
    private sz_onBeatGroup(data:any) {
        h.log.debug("#### sz_onBeatGroup 通知比牌结果" + JSON.stringify(data));
    }


    //通知派彩结果
    private sz_onPaiCai(data:any) {
        h.log.debug("#### sz_onBeatGroup 通知派彩结果" + JSON.stringify(data));
    }

    //通知游戏结束
    private sz_onGameOver(data:any) {
        h.log.debug("#### sz_onGameOver 通知游戏结束" + JSON.stringify(data));
    }

    //刷新房卡
    private onUpdateCoin(data: any) {
        h.log.debug("#### onUpdateCoin 更新金币" + JSON.stringify(data));
    }

    //常用语聊天
    private onChat(data: any) {
        h.log.debug("#### onChat 常用语聊天" + JSON.stringify(data));
        if (data) {
            let view = h.viewManager.getViewBySign(SZConstant.gameName);
            //view.onChat(data);
        }
    }

    //语音聊天
    private onChatText(data: any) {
        h.log.debug("#### onChatText 语音聊天" + JSON.stringify(data));
        if (data) {
            let view = h.viewManager.getViewBySign(SZConstant.gameName);
            view.onChatText(data);
        }
    }

    //通知玩家重新登录
    private onGamePlayerLogin(data: any) {
        h.log.debug("####  玩家重新登录 onGamePlayerLogin" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        if(view) {
            view.receive_online_data(data);
        }
    }

     // 通知玩家离线
    private onGamePlayerLogout(data: any) {
        h.log.debug("####  玩家离线 onGamePlayerLogout" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        if(view) {
            view.receive_offline_data(data);
        }
    }


     //通知断线重连恢复玩家数据
    private onRestoreGameInfo(data: any) {
        if(data.roomConfig.game != SZConstant.gameName){
            return;
        }
        h.log.debug("####  断线重连恢复---onRestoreGameInfo" + JSON.stringify(data));
        SZgameModel.getInstance().setRestoreGameInfo(data);
        let gameView = h.viewManager.getViewBySign(SZConstant.gameName);
        if(gameView) {
            h.viewManager.removeView(gameView);
            SZgameControler.showGameView();
        }else {
            let view = HallController.startGame(SZConstant.gameName);
            h.eventManager.addListener(HallConstant.GameEvent.SZLoaded, function(){
                SZgameControler.showGameView();
            }, view, 1);
        }
    }


    //当本玩家加入房间 返回结构
    private onPlayerJoinGame_(data: any) {
        if(!data.roomConfig || data.roomConfig.game != SZConstant.gameName){
            return;
        }
        h.log.debug("#### 自己加入或创建房间" + JSON.stringify(data));
        //保存数据
        SZgameModel.getInstance().setTableData(data);

        //保存用户数据
        if(data.gamePlayers){
            for(let i = 0; i < data.gamePlayers.length;i++){
                let playerInfo = data.gamePlayers[i];
                SZgameModel.getInstance().setPlayerData(playerInfo.id, playerInfo);
            }
        }
        SZgameControler.showGameView();
    }


     //广播有玩家加入房间
     private onPlayerJoinGame(data: any) {
        let gameName = HallController.getCurGameName();
        if(gameName != SZConstant.gameName){
            return;
        }
        h.log.debug("####  广播有玩家加入房间" + JSON.stringify(data));
        SZgameModel.getInstance().setPlayerData(data.gamePlayer.id,data.gamePlayer);
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        if(view) {
            view.otherJoin(data);
        }
    }

     //通知有玩家离开房间
    private onPlayerLeaveGame(data: any) {
        h.log.debug("####  通知有玩家离开房间---onPlayerLeaveGame-" + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.receive_quitGame_data(data);
    }

    //通知玩家请求解散游戏
    private onRequestGameDissolve(data: any) {
        h.log.debug("####  通知玩家请求解散游戏-->此时显示解散面板...onRequestGameDissolve=" + JSON.stringify(data));
       
    }

     //通知玩家刷新解散状态列表
    private onRefreshGameDissolve(data: any) {
        h.log.debug("####  通知玩家刷新解散状态列表onRefreshGameDissolve=" + JSON.stringify(data));
    }

     //通知玩家解散结果
    private onGameDissolveResult(data: any) {
        h.log.debug("####  通知玩家解散结果onGameDissolveResult=" + JSON.stringify(data));
    }

    //通知房间销毁
    private onGameDestroy(data: any) {
        h.log.debug("####  通知房间销毁onGameDestroy=" + JSON.stringify(data));
        HallAlert.show("房间已解散");
    }

    //玩家准备
    private onReady(data: any) {
        h.log.debug("####  收到准备 onReady data = " + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.setReadyState(data);
    }

    //玩家取消准备
    private onGameCancelReady(data: any) {
        h.log.debug("####  玩家取消准备 onGameCancelReady data = " + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.cancelReadyState(data);
    }

    //通知玩家大结算
    private onGameFinish(data: any) {
        h.log.debug("####  onGameFinish=" + JSON.stringify(data));
        setTimeout(() => {
            SZFightReportModel.getInstance().setRoundDatas(data.results);
            SZFightReportController.showFightReportView(SZConstant.bigBudgetType.gameEnd);
        }, 4000);
    }

    //自己看牌
    private sz_onShowCards_(data:any) {
        cc.log('### 自己看牌  sz_onShowCards_' + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.receive_sz_onShowCards_(data);
    }

    //自己比牌用户 
    private sz_onBiPaiPlayers_(data:any) {
        cc.log('### 自己比牌用户  sz_onBiPaiPlayers_' + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.receive_sz_onBiPaiPlayers_(data);
    }

    //结算
    private sz_onGameResult(data:any) {
        cc.log('### 结算  sz_onGameResult' + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.receive_sz_onGameResult(data);
    }

    //结算倒计时前状态
    private sz_onJieSuan(data:any) {
        cc.log('### 结算倒计时前状态  sz_onJieSuan' + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.receive_sz_onJieSuan(data);
    }

    //亮牌广播
    private sz_onShowCards(data:any) {
        cc.log('### 亮牌广播  sz_onShowCards' + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.receive_sz_onShowCards(data);
    }

    //比牌
    private sz_onBiPai(data:any) {
        cc.log('### 比牌  sz_onBiPai' + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        switch(data.state) {
            case SZConstant.outputState.bipai:      //比牌
            break;
            case SZConstant.outputState.huopin:     //火拼
            break;
        }
        view.receive_sz_onBiPai(data);
    }

    //群比
    private sz_onQunBi(data:any) {
        cc.log('### 比牌  sz_onQunBi' + JSON.stringify(data));
        let view = h.viewManager.getViewBySign(SZConstant.gameName);
        view.receive_sz_onQunBi(data);
    }   

    // 战报
    private sz_onResults(data:any){
        cc.log('### 点击出来的战报' + JSON.stringify(data));
        if(data.results.length == 0) {
            return;
        }
        SZFightReportModel.getInstance().setRoundDatas(data.results);
        SZFightReportModel.getInstance().setCurrentRound(data.round);
        SZFightReportController.showFightReportView(SZConstant.bigBudgetType.gaming);
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

    //玩家弃牌操作
    static giveup() {
        cc.log('### 玩家弃牌操作');
        this.sendData(SZNetHandler.fgame.SzHandler.giveup,null,null);
    }

    //玩家看牌操作
    static checked() {
        cc.log('### 玩家看牌操作');
        this.sendData(SZNetHandler.fgame.SzHandler.checked,null,null);
    }

    //玩家加注,比牌操作,
    static input(state:number,params:any) {
        let param: any = {
            type: state,
            param: params
        };
        cc.log('### 发送玩家加注,比牌操作' + JSON.stringify(param));
        this.sendData(SZNetHandler.fgame.SzHandler.input,param,null);
    }

    //玩家跟注，火拼
    static inputAdd(state:number) {
        let param: any = {
            type: state,
        };
        cc.log('### 发送玩家跟注' + JSON.stringify(param));
        this.sendData(SZNetHandler.fgame.SzHandler.input,param,null);
    }

    //取比牌
    static getBeatPlayer() {
        cc.log('### 发送获取比牌玩家');
        this.sendData(SZNetHandler.fgame.SzHandler.getbeatPlayers,null,null);
    }

    //亮牌
    static showCards() {
        cc.log('### 发送亮牌操作');
        this.sendData(SZNetHandler.fgame.SzHandler.showCards,null,null);
    }

    // 战报
    static getResult(){
        cc.log('### 获取战报');
        this.sendData(SZNetHandler.fgame.SzHandler.getResults, null, null);
    }

    // 测试
    static setTestPoker(type:any){
        let param: any = {
            type: type,
        };
        this.sendData(SZNetHandler.fgame.SzHandler.peiPai, param, null);
    }

    static setSelfGiveUP(isGiveUp:boolean) {
        this.selfGiveUp = isGiveUp;
    }

    static getSelfGiveUP() {
        return this.selfGiveUp;
    }
}
