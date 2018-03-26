import { NNGameUtil } from "../../common/NNGameUtil";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/Pk")
export default class NewClass extends cc.Component {
    data: any;
    gameView: any;
    @property(cc.Sprite) 
    leftHead:cc.Sprite = null;

    @property(cc.Sprite) 
    rightHead:cc.Sprite = null;

    @property(cc.Node)
    leftLayout:cc.Node = null;

    @property(cc.Node)
    rightLayout:cc.Node = null;

    @property(cc.Animation)
    pkanima:cc.Animation = null;

    @property(cc.Node) 
    bomb:cc.Node = null;


    playPkAnimation(data,gameView) {
        this.gameView = gameView;
        this.gameView.isPlayingPk = true;
        this.data = data;
        this.addCards(data.result.failure.cards,this.leftLayout);
        this.addCards(data.result.victory.cards,this.rightLayout);
        this.node.active = true;
        this.pkanima.play();
        
    }

    addCards(cards,layout) {
        layout.removeAllChildren();
        for(let i=0;i<cards.length;i++) {
            let pokerPreb = cc.loader.getRes("games/sz/assets/resources/res/prefab/poker/pai_Item",cc.Prefab)
            let poker = cc.instantiate(pokerPreb).getComponent('NNpokerItem');
            poker.initPoker(cards[i]);
            layout.addChild(poker.node);
        }
    }

    setActive(isShow) {
        this.node.active = isShow;
    }


    over() {
        this.gameView.isPlayingPk = false;
        this.node.active = false;
        let seatId = NNGameUtil.toLocalSeatId(this.data.result.failure.sid);
        this.gameView.playersControl.compaiLoseState(seatId,true);
    }

    playBomb() {
        this.bomb.getComponent(sp.Skeleton).timeScale = 1;
        this.bomb.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
    }
}
