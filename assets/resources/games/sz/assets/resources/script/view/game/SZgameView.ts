import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { SZConstant } from "../../common/SZConstant";
import { SZGameUtil } from "../../common/SZGameUtil";
import SZgameModel from "./SZgameModel";
import readyBtn from "../gameUI/SZreadyBtn";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import SZgameControler from "./SZgameControler";
import SZplayerControl from "../players/SZplayerControl";
import SZPlaySound from "../../common/SZPlaySound";
import { h } from "../../../../../../../script/common/H";
/**
 * 
 * 
 * @export
 * @class SZgameView
 * @extends {HallBaseView}
 */

let jettonArray = {
    '0':[],
    '1':[1],
    '2':[2],
    '3':[1,2],
    '4':[4],
    '5':[5],
    '6':[2,4],
    '7':[1,2,4],
    '8':[8],
    '9':[4,4,1],
    '10':[10],
    '16':[8,8],
    '20':[20],
    '40':[20,20],
    '80':[20,20,20,20],
    '100':[100],
    '200':[100,100]
} 

export default class SZgameView extends HallBaseView {
    laiziNode: any;
    daxiAnimation: cc.Node;
    uiNode_guanzhanzhong: any;
    uiNode_slectPkPlayer: any;
    uiNode_readyTime: any;
    uiNod_laiziEffect: any;
    collectAnimation: any;
    timeLabel: cc.Label;
    allJetton: any;
    canInnings: any;
    readyBtnControl: any;
    playersControl: any;    //所有头像控制脚本
    gameBtnControl: any;    //游戏中下面五个按钮控制脚本
    UIControl: any;     //游戏中按钮控制
    pokerControl:any;   //扑克控制脚本

    players_contol: cc.Node;
    readyBtnNode: cc.Node;
    gameBtnNode: cc.Node;
    tableId: cc.Node;
    inningNum: cc.Node;
    uiNode_btn: cc.Node;
    des: cc.Node;
    bj: cc.Node;
    jettonArea: cc.Node;
    pai_control: cc.Node;
    effect_layer: cc.Node;
    uisNode_bipaiEffect: cc.Node;
    budgetEffect: cc.Node;
    startAnimation: cc.Node;
    time_tip: cc.Node;
    uiNode_hotFight: cc.Node;
    baoziAnimation:cc.Node;
    jinhuaAnimation:cc.Node;
    shunjinAnimation:cc.Node;
    shunziAnimation:cc.Node;
    uiNode_collectJetton:cc.Node;

    constructor(){
        super();
        this.setBindDatas({
            uiNode_touxing:{varName:"players_contol"},
            uiNode_zhunbei:{varName:"readyBtnNode"},    //准备界面的按钮
            uiNode_youxicaozuo:{varName:"gameBtnNode"},         //游戏中按钮
            zhuohao:{varName:"tableId"},    //房间id
            jushu:{varName:"inningNum"},    //局数
            uiNode_btn:{varName:"uiNode_btn"},       //ui上面所有的按钮
            des:{varName:"des"},
            bj:{varName:"bj"},
            jettonArea:{varName:'jettonArea'},
            effect_layer:{varName:'effect_layer'},
            uiNode_pai_control:{varName: 'pai_control'},
            canInnings:{varName: 'canInnings'},
            allJetton:{varName: 'allJetton'},
            uisNode_bipaiEffect:{varName: 'uisNode_bipaiEffect'},
            budgetEffect:{varName:'budgetEffect'},
            startAnimation: {varName: 'startAnimation'},
            time_tip: {varName: 'time_tip'},
            uiNode_hotFight: {varName:'uiNode_hotFight'},       //火拼动画

            daxiAnimation:{varName:'daxiAnimation'},
            baoziAnimation:{varName:'baoziAnimation'},
            jinhuaAnimation:{varName:'jinhuaAnimation'},
            shunjinAnimation:{varName:'shunjinAnimation'},
            shunziAnimation:{varName:'shunziAnimation'},
            zhanji:{callback:this.fightReportCallback.bind(this)},
            uiNode_collectJetton:{varName:'uiNode_collectJetton'},
            uiNod_laiziEffect: {varName:'uiNod_laiziEffect'},
            uiNode_readyTime:{varName:'uiNode_readyTime'},
            uiNode_slectPkPlayer:{varName:'uiNode_slectPkPlayer'},
            uiNode_test:{varName:'uiNode_test'},
            uiNode_guanzhanzhong:{varName:'uiNode_guanzhanzhong'},
            laiziNode:{varName: 'laiziNode'}
        });
        this.setPrefab("res/prefab/game/game");
    }

    // update (dt) {},

    onPrefabLoaded() {
        //let data = SZgameModel.getInstance().getTableData();
        let data;
        data = SZgameModel.getInstance().getRestoreGameInfo();
        if(data) {
            SZgameModel.getInstance().setTableData(data);
            this.storeUpdateViewInfo(data);
        }else {
            data = SZgameModel.getInstance().getTableData();
            //是动态加桌
            if(data.watcher) {
                this.storeUpdateViewInfo(data);
            }else {
                this.updateViewInfo(data);
            }
        }
        this.showTimeClock();
        h.audioManager.stopBGM();
        h.audioManager.playMGBByName('bgm');
    }

     /**
      * 刷新时间
      * 
      * @memberof SZgameView
      */
     showTimeClock() {
        this.timeLabel = this.time_tip.getComponent(cc.Label);
        this.timeLabel.string = SZGameUtil.getHourAndMinites();
        HallUtil.schedule(function () {
            this.timeLabel.string = SZGameUtil.getHourAndMinites();
        }.bind(this), this, 10, true);
    }

    /**
     * 
     * 设置火拼的显示隐藏
     * @param {any} isshow 
     * @memberof SZgameView
     */
    sethotFightActive(isshow) {
        this.uiNode_hotFight.active = isshow;
    }

    /**
     * 断线重连走这块
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    storeUpdateViewInfo(data: any) {
        if(data) {
            this.initGameComponent();
            this.changeCloth(SZConstant.clothColor.red);
            //this.changeReadyOrGame(SZConstant.gameState.ready); 

            SZGameUtil.tableId = data.roomId;
            SZGameUtil.playerNum = data.playerCount;
            SZGameUtil.serverSeatId = data.sid;
            SZGameUtil.readyTime = data.readySeconds;

            this.updateRoundNum(data.currentRound + 1,data.roomConfig.roundCount);
            this.tableId.getComponent(cc.Label).string = '桌号: ' + data.roomId;
            this.setInnings(data.wheelNum); //轮数
            this.setAllJetton(data.sumScore);//总底池
            //已有头像显示
            if(data.gamePlayers) {
                for(let i = 0; i < data.gamePlayers.length;i++) {
                    let playerInfo = data.gamePlayers[i];
                    let seatId = SZGameUtil.toLocalSeatId(playerInfo.index);
                    this.playersControl.updatePlayerInfo(seatId, playerInfo);
                    SZgameModel.getInstance().setPlayerData(data.gamePlayers[i].id,data.gamePlayers[i]);
                    if(data.gamePlayers[i].score) {
                        this.playersControl.updateScore(seatId,data.gamePlayers[i].score);
                    }else {
                        this.playersControl.updateScore(seatId,0);
                    }


                }
            }

          

            if(data.state == SZConstant.gameState.ready) {
                //恢复准备界面
                this.storeReadyViewInfo(data);
            }else {
                //恢复游戏界面
                this.storeGameViewInfo(data);
            }

            SZConstant.mAddBets = data.mAddBets;
            SZConstant.sAddBets = data.sAddBets;
        }
    }

    /**
     * 恢复准备界面数据
     * 
     * @param {any} data 
     * @memberof SZgameView
     */
    storeReadyViewInfo(data) {
        this.changeReadyOrGame(SZConstant.gameState.ready); 
        //显示自己准备按钮是准备还是取消准备
        for(let i=0;i<data.gamePlayers.length;i++) {
            let serverSid = data.gamePlayers[i].index;
            if(SZGameUtil.toLocalSeatId(serverSid) == 0) {
                if(data.gamePlayers[i].ready) {
                    this.readyBtnControl.setreadyState(false);
                }else {
                    this.readyBtnControl.setreadyState(true);
                }
                break;
            }
        }

        if(data.redayTimes) {
            this.uiNode_readyTime.getComponent("SZCountDown").begin(Math.floor(data.redayTimes/1000));
        }
    }

    /**
     * 恢复游戏界面数据
     * 
     * @param {any} data 
     * @memberof SZgameView
     */
    storeGameViewInfo(data) {

        if(data.LzCards) {
            this.laiziNode.active = true;
            this.laiziNode.removeAllChildren();
            let pokerPreb = cc.loader.getRes("games/sz/assets/resources/res/prefab/poker/pai_Item",cc.Prefab)
            let poker = cc.instantiate(pokerPreb).getComponent('SZpokerItem');
            poker.initPoker(data.LzCards);
            poker.node.scale = 0.6;
            this.laiziNode.addChild(poker.node);
        }

          //刷新头像下面的数字
          for(let i=0;i<data.playerInfos.length;i++) {
            let seatId = SZGameUtil.toLocalSeatId(data.playerInfos[i].sid);
            this.playersControl.updateScore(seatId,data.playerInfos[i].score);
            //已看牌标志
            this.playersControl.lookCardState(seatId,data.playerInfos[i].showCards);

            //已弃牌标志
            this.playersControl.showGiveUpState(seatId,data.playerInfos[i].giveup);

            //比牌输标志
            this.playersControl.compaiLoseState(seatId,data.playerInfos[i].thanCards);

        }
        
        //恢复筹码
        for(let i=0;i<data.chips.length;i++) {
            for(let j=0;j<jettonArray[data.chips[i]].length;j++) {
                let jettonNode = cc.loader.getRes("games/sz/assets/resources/res/prefab/chip/chipItem",cc.Prefab)
                let jetton = cc.instantiate(jettonNode).getComponent('SZjetton');
                jetton.initView(jettonArray[data.chips[i]][j]);
                jetton.node.position = cc.p(0,0);
                // if(jettonArray[data.chips[i]][j] <50) {
                //     this.effect_layer.addChild(jetton.node,1);
                // }else{
                //     this.effect_layer.addChild(jetton.node,2);
                // }
                this.effect_layer.addChild(jetton.node,1);
                let randomPos = this.produceRandomPos();
                jetton.changeRandomRotation();
                jetton.node.runAction(cc.sequence(
                    cc.delayTime(0.1),
                    cc.moveTo(0.1,randomPos)
                ));
            }
        }

        
        // if(data.watcher) {
        //     this.pokerControl.updatePokerautoEnter(data);
        // }

        //恢复下面的按钮
        if(data.thanCards || data.giveup) {
            this.gameBtnControl.setGiveUpbtnLight(false);
            this.gameBtnControl.setAllGray();
        }else {
            if(data.sid == data.saySid) {
                this.gameBtnControl.refreshBtnState(data.action);
            }else {
                this.gameBtnControl.setAllGray();
            }
            if(data.action.huopin && ! data.action.genzhu) {    //显示火拼状态
                this.sethotFightActive(true);
                SZPlaySound.getInstance().playHuopin();
            }
            this.gameBtnControl.setLookCardActive(data.action.kanpai || 0);
        }
        
        
        setTimeout(() => {
            //说话人的头像走进度条 
            let sayLocalSeatId = SZGameUtil.toLocalSeatId(data.saySid); 
            this.playersControl.showPorgerss(sayLocalSeatId); 
            if(data.watcher) {
                cc.log('###### setTimeout');
                this.changeReadyOrGame(SZConstant.gameState.autoEnter); 
            }else {
                cc.log('###### setTimeout111');
                this.changeReadyOrGame(SZConstant.gameState.game); 
            }

            setTimeout(() => {
                //恢复扑克牌，及下面的筹码值
                this.pokerControl.updatePokerViewReLink(data.playerInfos);
            }, 1);
        }, 0.01);
    
        
        //恢复庄家标志
        let bankerSid = SZGameUtil.toLocalSeatId(data.zhuangJiaSid);
        this.playersControl.showBankerState(bankerSid);

        //恢复自己的牌面
        if(data.cards) {
            if(data.cards[0] == -1) {
                //this.gameBtnControl.setLookCardActive(true);
            }else {
                this.pokerControl.flipPokers(0,data.cards);
                this.pokerControl.showTypeNode(true);
                this.pokerControl.setTypeSpr(data.type,data.isRuan);
            }
        }else {

        }

        

    }


    /**
     * 从无到有刷新一些界面
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    updateViewInfo(data: any) {
        if(data) {
            this.initGameComponent();
            this.changeCloth(SZConstant.clothColor.red);
            this.changeReadyOrGame(SZConstant.gameState.ready);

            SZGameUtil.tableId = data.roomId;
            SZGameUtil.playerNum = data.playerCount;
            SZGameUtil.serverSeatId = data.index;
            SZGameUtil.readyTime = data.readySeconds;

            this.updateRoundNum(data.currentRound + 1,data.roomConfig.roundCount);
            this.tableId.getComponent(cc.Label).string = '桌号: ' + data.roomId;
            this.setInnings(0);
            this.setAllJetton(0);

            //已有头像显示
            if(data.gamePlayers) {
                for(let i = 0; i < data.gamePlayers.length;i++) {
                    let playerInfo = data.gamePlayers[i];
                    let seatId = SZGameUtil.toLocalSeatId(playerInfo.index);
                    this.playersControl.updatePlayerInfo(seatId, playerInfo);
                    
                    if(data.gamePlayers[i].score) {
                        this.playersControl.updateScore(seatId,data.gamePlayers[i].score);
                    }else {
                        this.playersControl.updateScore(seatId,0);
                    }
                }
            }

            //初始化加倍相关按钮
            SZConstant.mAddBets = data.mAddBets;
            SZConstant.sAddBets = data.sAddBets;
        }
    }

    /**
     * 更新局数
     * 
     * @param {any} currentRound 
     * @param {any} roundCount 
     * @memberof SZgameView
     */
    updateRoundNum(currentRound,roundCount) {
        this.inningNum.getComponent(cc.Label).string = '局数: ' + currentRound +'/' + roundCount;
    }


    otherJoin(data: any) {
        let seatId = SZGameUtil.toLocalSeatId(data.gamePlayer.index);
        if (this.playersControl) {
            this.playersControl.updatePlayerInfo(seatId, data.gamePlayer);
        }
    }

    /**
     * 初始化一些组件
     * 
     * @memberof SZgameView
     */
    initGameComponent() {
        this.UIControl = this.uiNode_btn.getComponent('SZUIBtn');
        this.UIControl.initView(this);

        this.gameBtnControl = this.gameBtnNode.getComponent('SZgameBtn');
        this.gameBtnControl.initView(this);

        this.playersControl = this.players_contol.getComponent('SZplayerControl');
        this.playersControl.initPlayers(this);

        this.pokerControl = this.pai_control.getComponent('SZpokersControl');
        this.pokerControl.initPlayersPoker(this);

        this.readyBtnControl = this.readyBtnNode.getComponent('SZreadyBtn');
        this.readyBtnControl.initView();
    }

    /**
     * 
     * 切换桌布
     * @memberof SZgameView
     */
    changeCloth(type) {
        if(type == SZConstant.clothColor.red) {
            this.bj.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("games/sz/assets/resources/res/images/nopack/desk_bj",cc.SpriteFrame);
            this.tableId.color = cc.color(255,65,33);
            this.inningNum.color = cc.color(255,65,33);
        }else {
            this.bj.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("games/sz/assets/resources/res/images/nopack/desk_bj2",cc.SpriteFrame);
            this.tableId.color = cc.color(28,58,194);
            this.inningNum.color = cc.color(28,58,194);
        }
    }
    /**
     * 切换游戏和准备界面
     * 
     * @param {any} type 
     * @memberof SZgameView
     */
    changeReadyOrGame(type) {
        cc.log('#### changeReadyOrGame   ' + type);
        if(type == SZConstant.gameState.game) {
            this.readyBtnNode.active = false;
            this.gameBtnNode.active = true;
            this.playersControl.resetMyPosition(true);
            this.pokerControl.node.active = true;
            this.playersControl.showReadyState(0,false,true);
            this.uiNode_guanzhanzhong.active = false;
        }else if(type == SZConstant.gameState.ready){
            this.readyBtnNode.active = true;
            this.gameBtnNode.active = false;
            this.playersControl.resetMyPosition(false);
            this.pokerControl.node.active = false;
            this.uiNode_guanzhanzhong.active = false;
        }else if(type == SZConstant.gameState.laizi){
            this.readyBtnNode.active = false;
            this.gameBtnNode.active = false;
            this.playersControl.resetMyPosition(true);
            this.pokerControl.node.active = true;
            this.playersControl.showReadyState(0,false,true);
            this.uiNode_guanzhanzhong.active = false;
        }else if(type == SZConstant.gameState.autoEnter) {
            this.readyBtnNode.active = false;
            this.gameBtnNode.active = false;
            this.playersControl.resetMyPosition(false);
            this.pokerControl.node.active = false;
            this.playersControl.showReadyState(0,false,true);
            this.uiNode_guanzhanzhong.active = true;
        }
    }

    /**
     * 战报
     */
    fightReportCallback(){
        SZgameControler.getResult();
    }

    /**
     * 把硬币从头像抛到牌桌
     * 
     * @param {any} index 
     * @param {any} num 
     * @memberof SZgameView
     */
    throwJetton(index,num) {
        for(let i=0;i<jettonArray[num].length;i++) {
            let jettonNode = cc.loader.getRes("games/sz/assets/resources/res/prefab/chip/chipItem",cc.Prefab)
            let jetton = cc.instantiate(jettonNode).getComponent('SZjetton');
            let pos = this.playersControl.getPlayerPos(index);
            jetton.initView(jettonArray[num][i]);
            jetton.node.position = pos;
            cc.log('## throwJetton' + JSON.stringify(pos));
            // if(jettonArray[num][i] <50) {
            //     this.effect_layer.addChild(jetton.node,1);
            // }else{
            //     this.effect_layer.addChild(jetton.node,2);
            // }
            this.effect_layer.addChild(jetton.node,1);

            let randomPos = this.produceRandomPos();
            jetton.changeRandomRotation();
            jetton.node.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.moveTo(0.3,randomPos),
                cc.callFunc(function() {
                    SZPlaySound.getInstance().playxiachouma();
                })
            ));
            // setTimeout(() => {
            //     SZPlaySound.getInstance().playxiachouma();
            // }, 200);
        }
    }




    /**
     * 随机一个筹码扔到牌桌的位置
     * 
     * @returns 
     * @memberof SZgameView
     */
    produceRandomPos() {
        let rWidth =  SZGameUtil.randomFromZero(this.jettonArea.width);
        let rHeight = SZGameUtil.randomFromZero(this.jettonArea.height);

        return cc.p(this.jettonArea.x + rWidth,this.jettonArea.y + rHeight);
    }

    /**
     * 准备状态的显示与隐藏
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    setReadyState(data:any) {
        let seatId = SZGameUtil.toLocalSeatId(data.index);
        this.playersControl.showReadyState(seatId,true,false);
        if(data.uids.length == 2) {
            this.uiNode_readyTime.getComponent("SZCountDown").begin(SZGameUtil.readyTime);
        }

        SZPlaySound.getInstance().playzhunbei();
    }   

    /**
     * 玩法取消准备
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    cancelReadyState(data:any) {
        this.playersControl.showReadyState(0,false,true);
        this.readyBtnControl.setreadyState(true);
        this.uiNode_readyTime.getComponent("SZCountDown").over();
        // SZGameUtil.readyTime
    }   


    /**
     * 游戏开始
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    onReceiveStart(data:any) {
        this.uiNode_readyTime.getComponent("SZCountDown").over();
        SZgameControler.setSelfGiveUP(false);
        if(data.LzCards) {
            this.changeReadyOrGame(SZConstant.gameState.laizi);
            SZgameModel.getInstance().setHasLaizi(true);

            //播癞子动画
            let animation = this.uiNod_laiziEffect.getComponent('SZLaiziAnimation');
            SZPlaySound.getInstance().playLaizi();
            animation.playLaiziAnimation(data,this);
            setTimeout(() => {
                this.startAnimation.getComponent(sp.Skeleton).timeScale = 1.3;
                this.startAnimation.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
                SZPlaySound.getInstance().playStart();
                setTimeout(() => {
                    this.beginGame(data);
                }, 1500);
            }, SZConstant.laiziAnimationTime);
        }else {
            SZgameModel.getInstance().setHasLaizi(false);
            this.startAnimation.getComponent(sp.Skeleton).timeScale = 1.3;
            this.startAnimation.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
            SZPlaySound.getInstance().playStart();
            setTimeout(() => {
                this.beginGame(data);
            }, 1500);
        }
    }

    /**
     * 
     * 从准备界面到游戏界面
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    beginGame(data:any) {
        cc.log('#### has ' + data.sidIds.indexOf(SZGameUtil.serverSeatId));
        this.pokerControl.updatePokerView(data);
        let bankerLocalSeatId = SZGameUtil.toLocalSeatId(data.zhuangSid);
        this.playersControl.showBankerState(bankerLocalSeatId);
        this.setInnings(data.wheelNum);
        this.setAllJetton(data.sumScore);
        this.playersControl.updateAllScore(data.playerInfos);
        this.pokerControl.updateJetton(data.playerInfos);

        if(data.sidIds.indexOf(SZGameUtil.serverSeatId) >=0) {
            this.changeReadyOrGame(SZConstant.gameState.game);
        }else {
            this.changeReadyOrGame(SZConstant.gameState.autoEnter);
        }

        for(let i=0;i<data.watchArr.length;i++) {
            let localSeatId = SZGameUtil.toLocalSeatId(data.watchArr[i].sid);
            this.playersControl.showGuanzhan(localSeatId,true);
            this.pokerControl.hidePokerBysid(localSeatId,false);
        }
        
    }

    /**
     * 第一次操作
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_firstInput(data:any) {
        if(SZgameModel.getInstance().getHasLaizi()) {
            setTimeout(() => {
                this.firstInput(data);
            }, SZConstant.laiziAnimationTime);
            SZgameModel.getInstance().setHasLaizi(false);
        }else{
            this.firstInput(data);
        }
        //this.firstInput(data);
    }

    /**
     *  第一次操作 
     * @param data 
     */
    firstInput(data:any) {
        if(data.speakSid == SZGameUtil.serverSeatId) {
            this.gameBtnControl.refreshBtnState(data);
        }else {
            this.gameBtnControl.setAllGray();
            this.gameBtnControl.setLookCardActive(true);
            this.gameBtnControl.setGiveUpbtnLight(true);
        }


        let hasMySelf = false;
        if(data.kanPaiList) {
            for(let i=0;i<data.kanPaiList.length;i++) {
                let localSeatId = SZGameUtil.toLocalSeatId(data.kanPaiList[i].sid);
                if(localSeatId == 0) {
                    hasMySelf = true;
                    break;
                }
            }
        }
        this.gameBtnControl.setLookCardActive(hasMySelf);

        let speakSeatId = SZGameUtil.toLocalSeatId(data.speakSid);
        this.playersControl.showPorgerss(speakSeatId);

        if(SZgameControler.getSelfGiveUP()) {
            cc.log('#### firstInput');
            this.gameBtnControl.setGiveUpbtnLight(false);
        }
    }

    /**
     * 收到看牌广播
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_kanpai(data:any) {
        let localSeatId = SZGameUtil.toLocalSeatId(data.sid);
        this.playersControl.lookCardState(localSeatId,true);

        SZPlaySound.getInstance().playKanpai(SZgameModel.getInstance().getPlayerSex(data.uid));
    }
    /**
     * 自己看牌
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_sz_onShowCards_(data:any) {
        this.pokerControl.flipPokers(0,data.cards);
        this.pokerControl.showTypeNode(true);
        this.pokerControl.setTypeSpr(data.type,data.isRuan || 0);
        SZConstant.hasLook = true;
        if(data.action && data.action.addBets) {
            SZConstant.addBets = data.action.addBets;
        }

    }

    /**
     * 弃牌
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_qipai(data:any) {
        let localSeatId = SZGameUtil.toLocalSeatId(data.sid);
        this.playersControl.showGiveUpState(localSeatId,true);
        this.playersControl.lookCardState(localSeatId,false);
        this.pokerControl.setGrayPokers(localSeatId);
        if(localSeatId == 0) {
            this.gameBtnControl.setGiveUpbtnLight(false);
            this.gameBtnControl.setAllGray();
            // if(data.liangpai) {
            //     this.gameBtnControl.setShowCardActive(true);
            // }
            SZgameControler.setSelfGiveUP(true);
        }

        this.hideSelectPk();

        SZPlaySound.getInstance().playQipai(SZgameModel.getInstance().getPlayerSex(data.uid));
    }
    /**
     * 比牌
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_bipai(data:any) {
        let localSeatId = SZGameUtil.toLocalSeatId(data.sid);
        this.throwJetton(localSeatId,data.chip);
    }
    /**
     * 游戏结束亮牌操作
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_sz_onShowCards(data:any) {
        let seatId = SZGameUtil.toLocalSeatId(data.sid);
        this.pokerControl.flipPokers(seatId,data.cards);
        // this.pokerControl.showTypeNode(true);
        // this.pokerControl.setTypeSpr(data.type,data.isRuan || 0);
    }

    /**
     * 取得可以比牌的玩家列表
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_sz_onBiPaiPlayers_(data:any) {
        if(data.players.length == 1) {
            SZgameControler.input(SZConstant.inputState.compare,data.players[0].uid);
            return;
        }

        for(let i= 0;i< data.players.length;i++) {
            let localSeatId = SZGameUtil.toLocalSeatId(data.players[i].sid);
            this.playersControl.showPkBtn(localSeatId,true);
        }

        this.uiNode_slectPkPlayer.getComponent('SZSelectPlayers').begin(this);
    }


    /**
     * 通知玩家离线
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_offline_data(data:any) {
        if (data) {
            if (data.uid) {
                let serverSeatId = SZgameModel.getInstance().getSeverSeatId(data.uid);
                let localSeatId = SZGameUtil.toLocalSeatId(serverSeatId);
                this.playersControl.showOffLineState(localSeatId, true);
            }
        }
    }

    /**
     * 通知玩家在线
     * 
     * @param {*} data 
     * @memberof SZgameView
     */
    receive_online_data(data:any) {
        if (data) {
            if (data.uid) {
                let serverSeatId = SZgameModel.getInstance().getSeverSeatId(data.uid);
                let localSeatId = SZGameUtil.toLocalSeatId(serverSeatId);
                this.playersControl.showOffLineState(localSeatId, false);
            }
        }
    }

    /**
     * 设置轮数
     * 
     * @param {any} innings 
     * @memberof SZgameView
     */
    setInnings(innings) {
        this.canInnings.getComponent(cc.Label).string = '轮数：' + (innings+1) + '/20';
    }

    /**
     * 底池
     * 
     * @param {any} allJetton 
     * @memberof SZgameView
     */
    setAllJetton(allJetton) {
        this.allJetton.getComponent(cc.Label).string = '底池：' + allJetton ;
    }
    /**
     * 
     * 广播时刷新一些数据
     * @param {any} data 
     * @memberof SZgameView
     */
    updateChips(data) {
        this.setAllJetton(data.sumScore);
        this.setInnings(data.wheelNum);
        this.pokerControl.updateJetton(data.chips);

        let localSeatId = SZGameUtil.toLocalSeatId(data.sid);
        if(data.score) {
            this.playersControl.updateScore(localSeatId,data.score);
        }
    }

    /**
     * 结算
     * 
     * @param {any} data 
     * @memberof SZgameView
     */
    receive_sz_onGameResult(data) {
        let winCard:any;
        for(let i=0;i<data.results.length;i++) {
            if(data.results[i].win >=0) {
                winCard = data.results[i];
                break;
            }
        }
        let animation = this.budgetEffect.getComponent('SZBudgetAnimation');
        animation.playanimaiotn(data,winCard,this);

        this.effect_layer.removeAllChildren();
        this.collectAnimation = this.uiNode_collectJetton.getComponent('SZcollectJetton');        
        let localSeatId = SZGameUtil.toLocalSeatId(winCard.sid);
        this.collectAnimation.playAnimation(localSeatId);
        SZPlaySound.getInstance().playshouChouma();
        this.playersControl.showBankerState(-1);
        this.sethotFightActive(false);
        SZPlaySound.getInstance().stopHuopin();
        this.gameBtnControl.setJettonLayoutActive(false);      
        this.playersControl.updateAllScore(data.results);

        for(let i=0;i<data.results.length;i++) {
            let localSid = SZGameUtil.toLocalSeatId(data.results[i].sid);
            cc.log('### data.results[i].cards[0]' + data.results[i].cards[0] + 'showcards' + data.results[i].showCards);
            if(localSid == 0) {
                if((data.results[i].cards[0] != '-1') && ((! data.results[i].showCards) && (! data.results[i].brightBrand))) {
                    this.pokerControl.flipPokers(localSid,data.results[i].cards);
                }
            }else {
                if(data.results[i].cards[0] != '-1' && ! data.results[i].brightBrand) {
                    this.pokerControl.flipPokers(localSid,data.results[i].cards);
                }
            }
        }
    }

    /**
     * 结算倒计时前
     * 
     * @param {any} data 
     * @memberof SZgameView
     */
    receive_sz_onJieSuan(data) {
        if(data.jieSuan) {
            this.gameBtnControl.setAllBtnFailure();
            this.gameBtnControl.setShowCardActive(true);
            this.gameBtnControl.setAllGray1();
            this.gameBtnControl.setGiveUpbtnLight(false);
        }
    }
    
    /**
     * 重直状态
     * 
     * @memberof SZgameView
     */
    resetStates() {
        this.changeReadyOrGame(SZConstant.gameState.ready);
        this.readyBtnControl.setreadyState(true);
        this.playersControl.clearAllStates();
        this.setInnings(0);
        this.setAllJetton(0);
        this.pokerControl.clearAllStates();
        this.gameBtnControl.setShowCardActive(false);
        this.gameBtnControl.setLookCardActive(false);

        this.baoziAnimation.active = false;
        this.daxiAnimation.active = false;
        this.jinhuaAnimation.active = false;
        this.shunjinAnimation.active = false;
        this.shunziAnimation.active = false;
        this.collectAnimation.hideAllJetton();
        this.uiNod_laiziEffect.active = false;
        this.playersControl.showReadyState(0,false,true);
        this.playersControl.hideAllGuanzhan();
        this.pokerControl.showTypeNode(false);
        this.hideSelectPk();
        SZgameControler.setSelfGiveUP(false);
        SZConstant.hasLook = false;
        SZConstant.addBets = [];
        this.laiziNode.active = false;
    }


    /**
     * 比牌
     * 
     * @param {any} data 
     * @memberof SZgameView
     */
    receive_sz_onBiPai(data) {
        this.sethotFightActive(false);
        SZPlaySound.getInstance().stopHuopin();
        let bipaiAnimation = this.uisNode_bipaiEffect.getComponent('SZPkAnimation');
        bipaiAnimation.playPkAnimation(data,this);
        let hasMySelf = false;
        if(data.kanPaiList) {
            for(let i=0;i<data.kanPaiList.length;i++) {
                let localSeatId = SZGameUtil.toLocalSeatId(data.kanPaiList[i].sid);
                if(localSeatId == 0) {
                    hasMySelf = true;
                    break;
                }
            }
        }
        cc.log('### hasMyself' + hasMySelf);
        this.gameBtnControl.setLookCardActive(hasMySelf);

        if(data.result.failure.sid == SZGameUtil.serverSeatId) {
            this.gameBtnControl.setGiveUpbtnLight(false);
            this.gameBtnControl.setAllGray();
            SZgameControler.setSelfGiveUP(true);
        }
    }

     /**
     * 群比
     * 
     * @param {any} data 
     * @memberof SZgameView
     */
    receive_sz_onQunBi(data) {
        for(let i=0;i<data.results.results.length;i++) {
            let localSid = SZGameUtil.toLocalSeatId(data.results[i].sid);
            if(localSid == 0) {
                if((data.results[i].cards[0] != '-1') && ((! data.results[i].showCards) && (! data.results[i].brightBrand))) {
                    this.pokerControl.flipPokers(localSid,data.results[i].cards);
                }
            }else {
                if(data.results[i].cards[0] != '-1' && ! data.results[i].brightBrand) {
                    this.pokerControl.flipPokers(localSid,data.results[i].cards);
                }
            }
        }
    }

    /**
     * 隐藏pk按钮
     * 
     * @memberof SZgameView
     */
    hideSelectPk() {
        this.uiNode_slectPkPlayer.active = false;
        this.playersControl.hideAllPkBtn();
    }
}
