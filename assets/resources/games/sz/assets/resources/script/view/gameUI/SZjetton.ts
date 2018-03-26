import { SZGameUtil } from "../../common/SZGameUtil";
import { SZConstant } from "../../common/SZConstant";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZjetton")
export default class SZjetton extends cc.Component {
    isBtn: boolean;
    JettonNum: number;
    gameBtn: any;
    cantouch: boolean;
    @property(cc.Node)
    jetton:cc.Node = null;

    /**
     * 
     * 根据传进来的值生成一张筹码
     * @param {number} num 
     * @memberof SZjetton
     */
    initView(num:number,gameBtn,isBtn:boolean = false) {
        this.gameBtn = gameBtn;
        this.JettonNum = num;
        this.isBtn = isBtn;

        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/poker', cc.SpriteAtlas);
        this.jetton.getComponent(cc.Sprite).spriteFrame = (plist.getSpriteFrame('Jetton_' + num));


        this.node.on('touchend', function () {
            cc.log('xxxxxxxxxxxxxxxxxxxx' + this.isBtn + this.cantouch);
            if (this.isBtn && this.cantouch) {
                cc.log('#### sendJetton' + this.getIndex());
                this.gameBtn.sendJetton(this.getIndex());
            }
            }.bind(this));
        }
            
    /**
     * 获取jetton上面的字
     * 
     * @returns 
     * @memberof SZjetton
     */
    getJettonNum() {
        return this.JettonNum;
    }

    /**
     * 
     * 
     * @returns 
     * @memberof SZjetton
     */
    getIndex() {
        let indexJetton = {};
        if(SZConstant.hasLook) {
            indexJetton = {
                '4':0,
                '8':1,
                '10':2,
                '20':3
            }
        }else {
            indexJetton = {
                '2':0,
                '4':1,
                '5':2,
                '10':3
            }
        }
        
        let num = this.getJettonNum();
        return indexJetton[num];
    }

    /**
     * 显示或取消蒙板
     * 
     * @param {boolean} isShow 
     * @memberof SZjetton
     */
    setMaskShow(isShow:boolean) {
        this.jetton.color = isShow ? cc.color(0x9e,0x9e,0x9e) : cc.color(0xff,0xff,0xff);
        this.cantouch = !isShow;
    }

    /**
     * 
     * 随机一个角度
     * @memberof SZjetton
     */
    changeRandomRotation() {
        this.node.scale = 0.6;
        //this.node.rotation = SZGameUtil.randomFromZero(360);
    }


}
