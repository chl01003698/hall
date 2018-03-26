import { SZGameUtil } from "../../common/SZGameUtil";
import SZPlaySound from "../../common/SZPlaySound";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZBudgetAnimation")
export default class SZBudgetAnimation extends cc.Component {
    data: any;
    gameView: any;

    @property(cc.Node)
    pokerLayout:cc.Node = null;

    @property(cc.Animation)
    budgetAnimation:cc.Animation = null;


    playanimaiotn(data,winCard,gameView) {
        this.gameView = gameView;
        this.data = data;
        this.addCards(winCard.cards,this.pokerLayout);
        if(this.gameView.isPlayingPk) {
            setTimeout(() => {
                this.node.active = true;
                let localSeatId =  SZGameUtil.toLocalSeatId(winCard.sid);
                this.budgetAnimation.play('budget' + localSeatId); 
                if(winCard.daxi) {
                    this.playTypeAnimation('daxi');
                }else {
                    setTimeout(() => {
                        this.playTypeAnimation(winCard.type);
                    }, 500);
                }
            }, 2200);
        }else {
            this.node.active = true;
            let localSeatId =  SZGameUtil.toLocalSeatId(winCard.sid);
            this.budgetAnimation.play('budget' + localSeatId); 
            if(winCard.daxi) {
                this.playTypeAnimation('daxi');
            }else {
                setTimeout(() => {
                    this.playTypeAnimation(winCard.type);
                }, 500);
            }
        }
    }

    /**
     * 根据牌的类型加相应动画
     * 
     * @memberof SZBudgetAnimation
     */
    playTypeAnimation(cardsType) {
        if(cardsType == 'tonghua') {
            SZPlaySound.getInstance().playshunzi(); 
            this.gameView.jinhuaAnimation.active = true;
            this.gameView.jinhuaAnimation.getComponent(cc.Animation).play();
        }else if(cardsType == 'shunjin'){
            SZPlaySound.getInstance().playshunzi(); 
            this.gameView.shunjinAnimation.active = true;
            this.gameView.shunjinAnimation.getComponent(sp.Skeleton).setAnimation(0,'animation',false);
        }else if(cardsType == 'baozi'){
            SZPlaySound.getInstance().playBaozi(); 
            this.gameView.baoziAnimation.active = true;
            this.gameView.baoziAnimation.getComponent(cc.Animation).play();
        }else if(cardsType == 'daxi'){
            let pokerPreb = cc.loader.getRes("games/sz/assets/resources/res/prefab/game/Daxi",cc.Prefab);
            let poker = cc.instantiate(pokerPreb);
            let daxi = poker.getChildByName('Daxi').getComponent(cc.ParticleSystem);
            poker.y = 519;
            this.gameView.addChild(poker,1,300);
            SZPlaySound.getInstance().playDaxi(); 
            daxi.preview = true;
        }else if(cardsType == 'shunzi'){
            this.gameView.shunziAnimation.active = true;
            this.gameView.shunziAnimation.getComponent(sp.Skeleton).timeScale = 1;
            this.gameView.shunziAnimation.getComponent(sp.Skeleton).setAnimation(0,'shunziAni',false);
            SZPlaySound.getInstance().playshunzi(); 
        }
    }

    addCards(cards,layout) {
        layout.removeAllChildren();
        for(let i=0;i<cards.length;i++) {
            let pokerPreb = cc.loader.getRes("games/sz/assets/resources/res/prefab/poker/pai_Item",cc.Prefab)
            let poker = cc.instantiate(pokerPreb).getComponent('SZpokerItem');
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
        this.gameView.shunziAnimation.getComponent(sp.Skeleton).timeScale = 0;
    }
}
