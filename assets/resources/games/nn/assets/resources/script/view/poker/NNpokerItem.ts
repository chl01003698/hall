import { NNConstant } from "../../common/NNConstant";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/NNpokerItem")
export default class NNpokerItem extends cc.Component {
    _pokerNum: any;

    // 花色
    c: number;

    // 牌面值
    v: number;

    @property(cc.Sprite)
    pokerNum:cc.Sprite = null;      //扑克值

    @property(cc.Sprite)
    colorBig:cc.Sprite = null;      //大花色

    @property(cc.Sprite)
    colorSmall:cc.Sprite = null;    //小花色

    @property(cc.Sprite)
    pokerIcon:cc.Sprite = null;     //k ,Q ,J上面的人儿

    @property(cc.Node)
    backSide:cc.Node = null;        //牌背面

    /**
     * 
     * 生成扑克牌
     * @param {*} pokerNum 
     * @memberof NNpokerItem
     */
    initPoker(pokerNum:any){
        if(pokerNum == '-1') {
            this.setBackSideActive(true);
            this._pokerNum = pokerNum;
            return;
        }
        this.backSide.active = false;
        this._pokerNum = pokerNum;
        let pokerArray = (pokerNum+ '').split('.');
        cc.log("initPoker" + JSON.stringify(pokerArray));
        let paiPlist = cc.loader.getRes("games/nn/assets/resources/res/images/atlas/poker", cc.SpriteAtlas);
        let color = '';
        this.c = +pokerArray[0]
        this.v = +pokerArray[1]
        if (pokerArray[0]  == NNConstant.pokerColor.spade) {   //黑桃
            this.colorBig.spriteFrame = paiPlist.getSpriteFrame('huase3');
            this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('huase3');
            this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('poker_' + pokerArray[1]);
            color = 'heitao_'
            this.pokerNum.node.color = cc.color(0,0,0);
        } else if (pokerArray[0] == NNConstant.pokerColor.hearts) {   //红桃
            this.colorBig.spriteFrame = paiPlist.getSpriteFrame('huase2');
            this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('huase2');
            this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('poker_' + pokerArray[1]);
            color = 'hongtao_'
            this.pokerNum.node.color = cc.color(214,29,29);
        } else if (pokerArray[0] == NNConstant.pokerColor.club) {   //梅花
            this.colorBig.spriteFrame = paiPlist.getSpriteFrame('huase1');
            this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('huase1');
            this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('poker_' + pokerArray[1]);
            color = 'meihua_'
            this.pokerNum.node.color = cc.color(0,0,0);
        } else if (pokerArray[0] == NNConstant.pokerColor.diamond) {   //方块
            this.colorBig.spriteFrame = paiPlist.getSpriteFrame('huase0');
            this.colorSmall.spriteFrame = paiPlist.getSpriteFrame('huase0');
            this.pokerNum.spriteFrame = paiPlist.getSpriteFrame('poker_' + pokerArray[1]);
            color = 'fangbian_'
            this.pokerNum.node.color = cc.color(214,29,29);
        }else { //不对
            cc.log('花色分解的不对')
        }

        if(parseInt(pokerArray[1]) >= 11 && parseInt(pokerArray[1]) <= 13) {
            this.pokerIcon.node.active = true;
            this.pokerIcon.spriteFrame = paiPlist.getSpriteFrame(color + pokerArray[1]);
        }else {
            this.pokerIcon.node.active = false;
        }
    }

    /**
     * 显示隐藏牌背
     * 
     * @param {boolean} isShow 
     * @memberof NNpokerItem
     */
    setBackSideActive(isShow:boolean) {
        this.backSide.active = isShow;
    }

    /**
     * 更改牌背
     * 
     * @param {any} isLight 
     * @memberof NNpokerItem
     */
    setBackSidelight(isLight) {
        if(isLight) {
            this.backSide.color = cc.color(255,255,255);
        }else {
            this.backSide.color = cc.color(131,110,110);
        }
    }

    

    /**
     * 
     * 播放翻牌动画
     * @memberof NNpokerItem
     */
    flipXPoker() {
        var self = this;
        this.setBackSideActive(true);
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.18,0.01,1),
            cc.callFunc(function(){
                self.setBackSideActive(false);
            }),
            cc.scaleTo(0.18,1,1)
        ))
    }

    /**
     * 获取牌上面的数字
     * 
     * @returns 
     * @memberof NNpokerItem
     */
    getPokerNum() {
        return this._pokerNum;
    }
    /**
     * 设置扑克牌的大小
     * 
     * @param {any} num 
     * @memberof NNpokerItem
     */
    setScale(num) {
        this.node.setScale(num);
    }
}
