import { NNGameUtil } from "../../common/NNGameUtil";
import NNgameView from "./NNgameView";
import NNpokerItem from "../poker/NNpokerItem";
import { h } from "../../../../../../../script/common/H";
import NNPeiPaiLogic from "../gameUI/NNPeiPaiLogic";
import { NNConstant } from "../../common/NNConstant";

const {ccclass, property, menu} = cc._decorator;

/**
 * @export
 * @class NNpokersControl
 * @extends {cc.Component}
 */
@ccclass
@menu("nn/pokersControl")
export default class NNpokersControl extends cc.Component {
    gameView: NNgameView;
    
    @property([cc.Node])
    panelLayoutArray:cc.Node[] = [];    //牌的节点
    
    @property([cc.Node])
    cards3Array:cc.Node[] = [];         //cards3的节点
    
    @property([cc.Node])
    cards2Array:cc.Node[] = [];         //cards2的节点
    
    @property([cc.Node])
    resultArray:cc.Node[] = [];         //显示牌型的节点
    
    @property([cc.Node])
    scores:cc.Node[] = [];              //显示牌型的节点

    scoreLabels:cc.Label[] = [];        //分数的label
    scoreAnims:cc.Animation[] = [];     //分数的动画

    pokersArray:NNpokerItem[][];        //六个人的牌的数组
    pokersSelected:NNpokerItem[] = [];  //选中的牌的数组
    canClick: boolean = false;
    peiPaiLogic: NNPeiPaiLogic;

    onLoad() {

        for (let i = 0; i < this.scores.length; i++) {
            this.scoreLabels[i] = this.scores[i].getComponent(cc.Label)
            this.scoreAnims[i] = this.scores[i].getComponent(cc.Animation)
        }

    }
    
    /**
     * 初始化每个玩家扑克牌
     * 
     * @memberof NNpokersControl
     */
    initPlayersPoker(gaemeViwe: NNgameView) {
        h.log.debug('----wx initPlayersPoker comes')
        this.pokersArray = [];
        this.gameView = gaemeViwe;
        this.peiPaiLogic = gaemeViwe.peiPaiLogic;
        
        for(let i=0;i<this.panelLayoutArray.length;i++) {
            let pokerArray = [];    //每个人扑克的数组
            for(let j=0;j<5;j++) {
                let poker = this.producePoker('-1');
                poker.node.active = false
                poker.node.setPosition(0, 0)
                if (i == 0) {
                    poker.node.on('touchend', function() {
                        if (!this.canClick) return

                        h.log.debug('----wx initPlayersPoker poker touchend comes!')

                        let cardValue = NNConstant.CardValue[poker.v]
                        if (poker.node.y == 0) {
                            if (this.pokersSelected.length == 3) {
                                return
                            }
                            this.pokersSelected.push(poker)
                            poker.node.y = 30

                            this.peiPaiLogic.pushValue(cardValue)
                        } else {
                            let idx = this.pokersSelected.indexOf(poker)
                            this.pokersSelected.splice(idx, 1)
                            poker.node.y = 0

                            this.peiPaiLogic.popValue(cardValue)
                        }
                    }.bind(this))
                }
                pokerArray.push(poker);
                this.panelLayoutArray[i].addChild(poker.node);
            }
            this.panelLayoutArray[i].active = false;
            this.pokersArray.push(pokerArray);
        }
    }

    /**
     * 把几家的牌生成出来
     * @param data 
     */
    updatePokerView(data:any) {
        for(let i=0;i<this.panelLayoutArray.length;i++) {
            this.panelLayoutArray[i].active = false;
        }
        for (const key in data) {
            let index = NNGameUtil.toLocalSeatId(key);
            this.panelLayoutArray[index].active = true;
            
            const element = data[key];
            for (let i = 0; i < element.length; i++) {
                const pokerNum = element[i];
                this.pokersArray[index][i].initPoker(pokerNum)
                this.pokersArray[index][i].node.active = true
            }
        }
    }

    /**
     * 生成一张扑克
     * 
     * @returns 
     * @memberof pokersControl
     */
    producePoker(pokerStr) {
        let pokerPreb = cc.loader.getRes("games/nn/assets/resources/res/prefab/poker/pai_Item",cc.Prefab)
        let poker:NNpokerItem = cc.instantiate(pokerPreb).getComponent('NNpokerItem');
        poker.initPoker(pokerStr);
        return poker;
    }

    /**
     * 
     * 看牌
     * @param {number} index 
     * @param {any} pokerArray 
     * @memberof NNpokersControl
     */
    flipPokers(index:number, pokerArray) {
        for(let i= 0;i < pokerArray.length;i++) {
            this.pokersArray[index][i].initPoker(pokerArray[i]);
            this.pokersArray[index][i].flipXPoker();
        }
    }

    /**
     * 
     * 显示比牌结果
     * @param {[{index,cards3,cards2,paiXing}]} data
     * @memberof NNpokersControl
     */
    showResult(data:any) {
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            h.log.debug('----wx in showResult element = ', d)
            
            let localIdx = NNGameUtil.toLocalSeatId(d.index);
            this.panelLayoutArray[localIdx].active = false;
            
            for (let i = 0; i < d.cards3.length; i++) {
                const pokerNum = d.cards3[i];
                let poker = this.producePoker(pokerNum);
                this.cards3Array[localIdx].addChild(poker.node)
            }
            for (let i = 0; i < d.cards2.length; i++) {
                const pokerNum = d.cards2[i];
                let poker = this.producePoker(pokerNum);
                this.cards2Array[localIdx].addChild(poker.node)
            }
            
            this.resultArray[localIdx].parent.active = true
            this.resultArray[localIdx].getComponent(cc.Sprite).spriteFrame = 
                cc.loader.getRes('games/nn/assets/resources/res/images/niuniu/' + NNConstant.NiuNiuPaiXingImage[d.paiXing], cc.SpriteFrame)
        }
    }

    /**
     * 显示分数，data是服务器发过来的数据
     * @param {[{index,cards3,cards2,paiXing}]} data
     */
    showScore(data:any) {
        let results = data.results
        for (let i = 0; i < results.length; i++) {
            const r = results[i]
            let idx = NNGameUtil.toLocalSeatId(r.index)
            this.scores[idx].active = true
            if (r.score > 0) {
                this.scoreLabels[idx].string = '+' + r.score
                this.scoreLabels[idx].node.color = cc.color(223, 223, 19)
            } else {
                this.scoreLabels[idx].string = r.score
                this.scoreLabels[idx].node.color = cc.color(19, 223, 223)
            }
            this.scoreAnims[idx].play('scorefly', 0)
        }
    }

    /**
     * 把牌变灰，比牌输和弃牌时
     * 
     * @param {number} index 
     * @memberof NNpokersControl
     */
    setGrayPokers(index:number) {
        for(let i= 0;i < this.pokersArray[index].length;i++) {
            this.pokersArray[index][i].setBackSidelight(false);
            this.pokersArray[index][i].setBackSideActive(true);
        }
    }

    /**
     * 
     * 清空一些状态
     * 
     * @memberof NNpokersControl
     */
    clearAllStates() {
        this.canClick = false
        this.pokersSelected = []
        for(let i= 0;i < this.pokersArray.length;i++) {
            for(let j=0;j<this.pokersArray[i].length;j++) {
                let card = this.pokersArray[i][j]
                card.node.y = 0
                card.setBackSidelight(true)
                card.setBackSideActive(true)
                if (j == 4) {
                    card.node.active = false
                }
            }
        }
        for(let i= 0;i < this.cards3Array.length;i++) {
            this.cards3Array[i].removeAllChildren()
            this.cards2Array[i].removeAllChildren()
            this.resultArray[i].parent.active = false
        }
    }

}
