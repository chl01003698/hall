import { SZGameUtil } from "../../common/SZGameUtil";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";
import SZgameModel from "../game/SZgameModel";
import { DZPlaySound } from "../../../../../../dz/assets/resources/script/view/game/sound/DZPlaySound";
import SZPlaySound from "../../common/SZPlaySound";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import { HallViewConfig } from "../../../../../../../script/config/HallViewConfig";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/Pk")
export default class NewClass extends cc.Component {
    bgScale: any;
    alarmTimer: any;
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

    // @property(cc.Node)
    // bomb1:cc.Node = null;


    @property(cc.Node) 
    mask:cc.Node = null;


    playPkAnimation(data,gameView) {
        if(data.count == 2) {
            this.mask.active = false;
        }else {
            this.mask.active = true;
        }
        this.gameView = gameView;
        this.gameView.isPlayingPk = true;
        this.data = data;
        this.addCards(data.result.failure.cards,this.leftLayout);
        this.addCards(data.result.victory.cards,this.rightLayout);
        this.node.active = true;
        this.pkanima.play();

        //添加头像，左边是输的，右边是赢的
        cc.log('### playPkAnimation' + JSON.stringify(SZgameModel.getInstance().getPlayerData(data.result.failure.uid)));
        HallUIUtil.urlSprite(SZgameModel.getInstance().getPlayerData(data.result.failure.uid).headimgurl, this.leftHead.node);
        HallUIUtil.urlSprite(SZgameModel.getInstance().getPlayerData(data.result.victory.uid).headimgurl, this.rightHead.node);

        this.bgScale = HallViewConfig.getUIBgScale();
        // this.alarmTimer = HallUtil.schedule(function () {
        //     this.updateTime();
        // }.bind(this), this.node, 0.1, true);
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
        this.gameView.isPlayingPk = false;
        this.node.active = false;
        let seatId = SZGameUtil.toLocalSeatId(this.data.result.failure.sid);
        this.gameView.playersControl.compaiLoseState(seatId,true);
        this.gameView.pokerControl.setGrayPokers(seatId);
        if(seatId == 0) {
            this.gameView.gameBtnControl.setGiveUpbtnLight(false);
            this.gameView.gameBtnControl.setLookCardActive(false);
            this.gameView.gameBtnControl.setAllGray();
        }
        this.gameView.gameBtnControl.setLookCardActive(false);
        this.node.stopAction(this.alarmTimer);
    }

    playBomb() {
        SZPlaySound.getInstance().playBomb();
    }

    // updateTime() {
    //     cc.log('##### updateTime' + this.bgScale);
    //     //this.bomb.x *= this.bgScale.x;
    //     //this.bomb1.x *= this.bgScale.x;
    // }
}
