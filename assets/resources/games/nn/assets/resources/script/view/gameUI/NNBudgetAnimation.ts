import { NNGameUtil } from "../../common/NNGameUtil";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/NNBudgetAnimation")
export default class NNBudgetAnimation extends cc.Component {
    data: any;
    gameView: any;

    @property(cc.Node)
    pokerLayout:cc.Node = null;

    @property(cc.Animation)
    pkanima:cc.Animation = null;


    playanimaiotn(data,winCard,gameView) {
        this.gameView = gameView;
        this.data = data;
        this.addCards(winCard.cards,this.pokerLayout);
        if(this.gameView.isPlayingPk) {
            setTimeout(() => {
                this.node.active = true;
                this.pkanima.play();
                this.playTypeAnimation(winCard.cardsType);
            }, 2200);
        }else {
            this.node.active = true;
            this.pkanima.play();
            this.playTypeAnimation(winCard.cardsType);
        }
    }

    /**
     * 根据牌的类型加相应动画
     * 
     * @memberof NNBudgetAnimation
     */
    playTypeAnimation(cardsType) {
        if(cardsType == 'tonghua') {
            this.gameView.jinhuaAnimation.active = true;
            this.gameView.jinhuaAnimation.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
        }else if(cardsType == 'shunjin'){
            this.gameView.shunjinAnimation.active = true;
            this.gameView.shunjinAnimation.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
        }else if(cardsType == 'baozi'){
            this.gameView.baoziAnimation.active = true;
            this.gameView.baoziAnimation.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
        }else {
            // this.gameView.jinhuaAnimation.active = true;
            // this.gameView.jinhuaAnimation.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
        }
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
        this.node.active = false;
        this.gameView.resetStates();
        this.gameView.updateRoundNum(this.data.currentRound + 2,this.data.roundCount);
    }
}
