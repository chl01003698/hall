import { SZGameUtil } from "../../common/SZGameUtil";
import SZPlaySound from "../../common/SZPlaySound";



const {ccclass, property, menu} = cc._decorator;
/**
 * 
 * 
 * @export
 * @class SZpokersControl
 * @extends {cc.Component}
 */
@ccclass
@menu("sz/pokersControl")
export default class SZpokersControl extends cc.Component {
    gameView: any;
    @property([cc.Node])
    panelLayoutArray:cc.Node[] = [];     //牌的节点

    @property([cc.Label])
    JettonNum:cc.Label[] = [];       //筹码的结点

    pokersArray:any;     //五个人的牌的数组

    @property(cc.Node)
    pokerTypeNode:cc.Node = null;

    @property(cc.Sprite)
    pokerTypeSpr: cc.Sprite = null; 
    
    /**
     * 初始化每个玩家扑克牌
     * 
     * @memberof SZpokersControl
     */
    initPlayersPoker(gaemeViwe) {
        this.pokersArray = [];
        this.gameView = gaemeViwe;
        for(let i=0;i<this.panelLayoutArray.length;i++) {
            let pokerArray = [];    //每个人扑克的数组
            for(let j=0;j<3;j++) {
                let poker = this.producePoker('-1');
                pokerArray.push(poker);
                this.panelLayoutArray[i].addChild(poker.node);
            }
            this.panelLayoutArray[i].active = false;
            this.pokersArray.push(pokerArray);
        }

        for(let i=0;i<this.JettonNum.length;i++) {
            this.JettonNum[i].node.parent.active = false;
        }
    }


    /**
     * 把几家的牌背面生成出来
     * @param data 
     */
    updatePokerView(data:any) {
        for(let i=0;i<this.JettonNum.length;i++) {
            this.JettonNum[i].node.parent.active = false;
            this.panelLayoutArray[i].active = false;
        }
        for(let i=0;i<data.sidIds.length;i++) {
            let index = SZGameUtil.toLocalSeatId(data.sidIds[i]);
            this.panelLayoutArray[index].active = true;
            this.JettonNum[index].node.parent.active = true;
        }
        for(let i=0;i<data.playerInfos.length;i++) {
            let toLocalSeatId = SZGameUtil.toLocalSeatId(data.playerInfos[i].sid);
            this.gameView.throwJetton(toLocalSeatId,Math.abs(data.playerInfos[i].chip));
        }
    }

    /**
     * 动态加入的人不显示牌
     * 
     * @param {any} index 
     * @memberof SZpokersControl
     */
    hidePokerBysid(index,isshow) {
        this.panelLayoutArray[index].active = isshow;
        this.JettonNum[index].node.parent.active = isshow;
    }

    // updatePokerautoEnter(data:any) {
    //     for(let i=0;i<this.JettonNum.length;i++) {
    //         this.JettonNum[i].node.parent.active = false;
    //         this.panelLayoutArray[i].active = false;
    //     }
    //     for(let i=0;i<data.playerInfos.length;i++) {
    //         if(data.playerInfos[i].watcher) {
    //             break;
    //         }
    //         let toLocalSeatId = SZGameUtil.toLocalSeatId(data.playerInfos[i].sid);
    //         cc.log('#### updatePokerautoEnter' + toLocalSeatId);
            
    //         this.panelLayoutArray[toLocalSeatId].active = true;
    //         this.JettonNum[toLocalSeatId].node.parent.active = true;
    //     }
    // }

    /**
     * 断线重连生成扑克
     * 
     * @param {*} data 
     * @memberof SZpokersControl
     */
    updatePokerViewReLink(data:any) {
        for(let i=0;i<data.length;i++) {
            if(data[i].watcher) {
                break;
            }

            let index = SZGameUtil.toLocalSeatId(data[i].sid);
            cc.log('##### updatePokerViewReLink' + index);
            this.panelLayoutArray[index].active = true;
            this.JettonNum[index].node.parent.active = true;
            this.JettonNum[index].string = data[i].chip;
        }
    }

    /**
     * 刷新筹码
     * 
     * @param {*} data 
     * @memberof SZpokersControl
     */
    updateJetton(data:any) {
        for(let i=0;i<data.length;i++) {
            let seateId = SZGameUtil.toLocalSeatId(data[i].sid);
            this.JettonNum[seateId].string = data[i].chip;
        }
    }

    /**
     * 生成一张扑克
     * 
     * @returns 
     * @memberof pokersControl
     */
    producePoker(pokerStr) {
        let pokerPreb = cc.loader.getRes("games/sz/assets/resources/res/prefab/poker/pai_Item",cc.Prefab)
        let poker = cc.instantiate(pokerPreb).getComponent('SZpokerItem');
        poker.initPoker(pokerStr);
        return poker;
    }

    /**
     * 
     * 看牌
     * @param {number} index 
     * @param {any} pokerArray 
     * @memberof SZpokersControl
     */
    flipPokers(index:number,pokerArray) {
        for(let i= 0;i < pokerArray.length;i++) {
            this.pokersArray[index][i].initPoker(pokerArray[i]);
            this.pokersArray[index][i].flipXPoker();
        }
        SZPlaySound.getInstance().playFlixPoker();
    }

    /**
     * 把牌变灰，比牌输和弃牌时
     * 
     * @param {number} index 
     * @memberof SZpokersControl
     */
    setGrayPokers(index:number) {
        for(let i= 0;i < this.pokersArray[index].length;i++) {
            this.pokersArray[index][i].setBackSidelight(true);
            //this.pokersArray[index][i].setBackSideActive(true);
        }
    }

    /**
     * 
     * 清空一些状态
     * 
     * @memberof SZpokersControl
     */
    clearAllStates() {
        for(let i= 0;i < this.pokersArray.length;i++) {
            for(let j=0;j<this.pokersArray[i].length;j++) {
                this.pokersArray[i][j].setBackSidelight(false);
                this.pokersArray[i][j].setBackSideActive(true);
            }
        }
    }

    /**
     * 显示牌型
     * 
     * @param {any} isshow 
     * @memberof SZpokersControl
     */
    showTypeNode(isshow) {
        this.pokerTypeNode.active = isshow;
    }

    /**
     * 
     * 
     * @param {any} type 
     * @param {any} hasLaizi 
     * @memberof SZpokersControl
     */
    setTypeSpr(type,hasLaizi) {
        let typePlist = cc.loader.getRes("games/sz/assets/resources/res/images/atlas/pokerType", cc.SpriteAtlas);
        if(hasLaizi) {
            this.pokerTypeSpr.spriteFrame = typePlist.getSpriteFrame(type + '1');
        }else {
            this.pokerTypeSpr.spriteFrame = typePlist.getSpriteFrame(type);
        }
    }

}
