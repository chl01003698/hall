import { NNGameUtil } from "../../common/NNGameUtil";
import NNplayerHead from "./NNplayerHead";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/NNplayerControl")
export default class NNplayerControl extends cc.Component {
    gameView: any;
    players: NNplayerHead[];     //所有玩家

    @property([cc.Node])    //头像的位置节点
    playersNode: cc.Node[] = [];

    @property(cc.Node) 
    tempNode: cc.Node = null;       //自己在牌桌内的位置节点

    /**
     * 
     * 创建所有头像预制体节点
     * @type {function ()}
     * @memberof NNplayerControl
     */
    initPlayers(gameView) {
        cc.log('initPlayers');
        this.players = [];      
        this.gameView = gameView;
        for(let i=0;i<this.playersNode.length;i++) {
            var prefab = cc.loader.getRes('games/nn/assets/resources/res/prefab/game/headItem', cc.Prefab) 
            let player = cc.instantiate(prefab).getComponent('NNplayerHead');
            player.initInfo(gameView);
            this.playersNode[i].addChild(player.node);
            this.players.push(player);
            player.node.active = false;
        }
    }

    hidePlayer(seateId) {
        this.players[seateId].node.active = false
    }

    /**
     * 改变游戏中自己头像位置，游戏中在靠左一些，准备界面在正中间
     * 
     * @param {boolean} isGaming 
     * @memberof NNplayerControl
     */
    resetMyPosition(isGaming:boolean) {
        if(isGaming) {
            this.playersNode[0].x = this.tempNode.x;
        }else {
            this.playersNode[0].x = 0;
        }
    }

    /**
     * 刷新分数
     * 
     * @param {number} seateId 本地seatId
     * @param {number} score    分数
     * @memberof NNplayerControl
     */
    updateScore(seateId:number,score:number) {
        this.players[seateId].updateScore(score);
    }

    /**
     * 刷新所有的分数
     * 
     * @param {*} data 
     * @memberof NNplayerControl
     */
    updateAllScore(data:any) {
        for(let i=0;i<data.length;i++) {
            let localSeatId = NNGameUtil.toLocalSeatId(data[i].sid);
            this.players[localSeatId].updateScore(data[i].score);
        }
    }
    
    /**
     * 刷新指定玩家的信息
     * 
     * @param {any} index 
     * @param {any} data 
     * @memberof NNplayerControl
     */
    updatePlayerInfo(index,data) {
        cc.log('updatePlayerInfo ' + index + this.players.length);
        this.players[index].node.active = true;
        this.players[index].updatePlayerInfo(data);
    }

    /**
     * 
     * 显示隐藏准备状态
     * @param {number} index 
     * @param {boolean} isShow 
     * @param {boolean} isAll 
     * @memberof NNplayerControl
     */
    showReadyState(index:number,isShow:boolean,isAll:boolean) {
        if(isAll) {     //全部显示或隐藏
            this.players.forEach(element => {
                element.showReadyState(isShow);
            });
        }else {
            this.players[index].showReadyState(isShow);
        }
    }

   /**
    * 显示指定玩家的庄家标志
    * 
    * @param {any} index 
    * @memberof NNplayerControl
    */
    showBankerState(index) {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].showBankerState(index == i);
        }
    }

    /**
     * 显示进度条
     * 传－1可以把所有的进度条停掉
     * @param {any} index 
     * @memberof NNplayerControl
     */
    showPorgerss(index) {
        for(let i=0;i<this.players.length;i++) {
            this.players[i].showPorgerss(index == i);
        }
    }

    /**
     * 
     * 清除所有的状态
     * @param {any} index 
     * @memberof NNplayerControl
     */
    clearAllStates() {
        for(let i=0;i<this.players.length;i++) {
            this.players[i].clearAllStates();
        }
    }

    /**
     * 取得头像位置
     * 
     * @param {any} index 
     * @memberof NNplayerControl
     */
    getPlayerPos(index:number) {
        return this.playersNode[index].getPosition();
    }
    /**
     * 
     * 看牌标志
     * @param {number} index 
     * @param {any} isShow 
     * @memberof NNplayerControl
     */
    lookCardState(index:number,isShow) {
        this.players[index].lookCardState(isShow);
    }

    /**
     * 弃牌标志
     * @param {number} index 
     * @param {any} isShow 
     * @memberof NNplayerControl
     */
    showGiveUpState(index:number,isShow) {
        this.players[index].showGiveUpState(isShow);
    }
    
    /**
     * 离线状态
     * 
     * @param {any} index 
     * @param {any} isShow 
     * @memberof NNplayerControl
     */
    showOffLineState(index,isShow) {
        this.players[index].showOffLineState(isShow);
    }
}
