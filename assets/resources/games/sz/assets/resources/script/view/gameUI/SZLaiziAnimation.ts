import { SZGameUtil } from "../../common/SZGameUtil";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/laizi")
export default class SZLaiziAnimation extends cc.Component {
    data: any;
    gameView: any;

    @property(cc.Node)
    pokerNode:cc.Node = null;

    @property(cc.Animation)
    laiziAnimation:cc.Animation = null;

    playLaiziAnimation(data,gameView) {
        this.gameView = gameView;
        this.data = data;
        this.addCards(data.LzCards);
        this.node.active = true;
        this.laiziAnimation.play();
        
    }

    addCards(cards) {
        this.pokerNode.removeAllChildren();
        let pokerPreb = cc.loader.getRes("games/sz/assets/resources/res/prefab/poker/pai_Item",cc.Prefab)
        let poker = cc.instantiate(pokerPreb).getComponent('SZpokerItem');
        poker.initPoker(cards);
        this.pokerNode.addChild(poker.node);
    }

    setActive(isShow) {
        this.node.active = isShow;
    }


    // over() {
    //     this.node.active = false;
    //     let seatId = SZGameUtil.toLocalSeatId(this.data.result.failure.sid);
    //     this.gameView.playersControl.compaiLoseState(seatId,true);
    // }
}
