import NNgameModel from "../game/NNgameModel";
import NNpokersControl from "../game/NNpokersControl";


const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/NNbudgetItem")
export default class NNbudgetItem extends cc.Component {
    @property(cc.Sprite) 
    head:cc.Sprite = null;

    @property(cc.Label)
    nickName: cc.Label = null;   //名字

    @property(cc.Label)
    score: cc.Label = null;   //

    @property(cc.Sprite)
    winType: cc.Sprite = null;

    @property(cc.Node)
    pokersLayout: cc.Node = null;

    updateView(data:any) {
        let userData = NNgameModel.getInstance().getPlayerData(data.uid);
        cc.log('updateView' + JSON.stringify(userData));
        this.nickName.string = userData.nickname;
        //头像
        let self = this;
        // cc.loader.load(userData.headimgurl, function (err, texture) {
        //     var frame = new cc.SpriteFrame(texture);
        //     self.head.spriteFrame = frame;
        // });
        this.score.string = data.win;
        this.winType.spriteFrame = this.getSpriteBytype(data.victory);
        for(let i=0;i<data.cards.length;i++) {
            let pokerPreb = cc.loader.getRes("games/sz/assets/resources/res/prefab/poker/pai_Item",cc.Prefab)
            let poker = cc.instantiate(pokerPreb).getComponent('NNpokerItem');
            poker.initPoker(data.cards[i]);
            poker.setScale(0.8);
            this.pokersLayout.addChild(poker.node);
        }
    }

    getSpriteBytype(victory) {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/budget', cc.SpriteAtlas);
        if(victory) {
            this.score.node.color = cc.color(255,255,0);
            
            return plist.getSpriteFrame('yingbiao');
        }else {
            this.score.node.color = cc.color(13,238,220);
            
            return plist.getSpriteFrame('shubiao')
        }
    }
}
