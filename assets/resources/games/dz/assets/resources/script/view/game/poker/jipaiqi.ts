import { DZGameUtil } from "../../../common/DZGameUtil";
import { DZConstant } from "../../../common/DZConstant";



const { ccclass, property, menu } = cc._decorator;

var paiArray = ['Y', "X", '2', 'A', 'K', 'Q', 'J', '0', '9', '8', '7', '6', '5', '4', '3'];

@ccclass
@menu("ddz/jipaiqi")
export default class NewClass extends cc.Component {

    @property([cc.Label])
    jipaiLabel: cc.Label[] = [];

    @property(cc.Node)
    jipaiTip_2: cc.Node = null;

    @property(cc.Node)
    jipaiTip_3: cc.Node = null;

    @property(cc.Node)
    jipaiTip_4: cc.Node = null;

    @property(cc.Node)
    jipaiTip_5: cc.Node = null;

    @property(cc.Node)
    jipaiTip_6: cc.Node = null;

    @property(cc.Node)
    jipaiTip_7: cc.Node = null;

    @property(cc.Node)
    jipaiTip_8: cc.Node = null;

    @property(cc.Node)
    jipaiTip_9: cc.Node = null;

    @property(cc.Node)
    jipaiTip_0: cc.Node = null;

    @property(cc.Node)
    jipaiTip_J: cc.Node = null;

    @property(cc.Node)
    jipaiTip_Q: cc.Node = null;

    @property(cc.Node)
    jipaiTip_K: cc.Node = null;

    @property(cc.Node)
    jipaiTip_A: cc.Node = null;
    // update (dt) {},

    updateView(data: any) {
        cc.log('jiapiqi::::' + JSON.stringify(data));
        for (let i = 0; i < paiArray.length; i++) {
            if (data[paiArray[i]]) {
                cc.log('jiapiqi::::  111 ' + JSON.stringify(data[paiArray[i]]));
                console.log("paiArray[i]=" + paiArray[i]);
                this.jipaiLabel[i].string = data[paiArray[i]].length;

            } else {
                this.jipaiLabel[i].string = "0";
            }

            if (this.jipaiLabel[i].string == "0") {
                this.jipaiLabel[i].node.color = cc.color(0xA3, 0x97, 0x65);
            } else {
                this.jipaiLabel[i].node.color = cc.color(0xF5, 0x33, 0x33);
            }
        }

        if (paiArray && paiArray.length > 0) {
            if (DZGameUtil.playType == DZConstant.playType.ordinaryLz3) {
                //癞子
                if (DZGameUtil.laiziArray.length > 0) {
                    this.updateImgSpt(DZGameUtil.laiziArray[0], "doudizhu_lz");
                }
            } else if (DZGameUtil.playType == DZConstant.playType.TDLZ3) {
                //天地癞子
                // DZGameUtil.laiziArray[0]
                // DZGameUtil.laiziArray[1]
                if (DZGameUtil.laiziArray.length > 0) {
                    this.updateImgSpt(DZGameUtil.laiziArray[0], "doudizhu_tian");
                    if (DZGameUtil.laiziArray.length == 2) {
                        this.updateImgSpt(DZGameUtil.laiziArray[1], "doudizhu_di");
                    }
                }

            }
        }
    }

    hidenAllTip(){
        this.jipaiTip_0.active = false;
        this.jipaiTip_A.active = false;
        this.jipaiTip_2.active = false;
        this.jipaiTip_3.active = false;
        this.jipaiTip_4.active = false;
        this.jipaiTip_5.active = false;
        this.jipaiTip_6.active = false;
        this.jipaiTip_7.active = false;
        this.jipaiTip_8.active = false;
        this.jipaiTip_9.active = false;
        this.jipaiTip_J.active = false;
        this.jipaiTip_Q.active = false;
        this.jipaiTip_K.active = false;
    }

    updateImgSpt(lz_card: string, img_name) {
        
        let index = lz_card.slice(1, 2);
        console.log("updateImgSpt...index=" + index + " img_name=" + img_name);
        let paiPlist = cc.loader.getRes("games/dz/assets/resources/res/images/atlas/youxizhong", cc.SpriteAtlas);
        switch (index) {
            case '0':
                this.jipaiTip_0.active = true;
                this.jipaiTip_0.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case 'A':
                this.jipaiTip_A.active = true;
                this.jipaiTip_A.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case '2':
                this.jipaiTip_2.active = true;
                this.jipaiTip_2.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case '3':
                this.jipaiTip_3.active = true;
                this.jipaiTip_3.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case '4':
                this.jipaiTip_4.active = true;
                this.jipaiTip_4.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case '5':
                this.jipaiTip_5.active = true;
                this.jipaiTip_5.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case '6':
                this.jipaiTip_6.active = true;
                this.jipaiTip_6.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case '7':
                this.jipaiTip_7.active = true;
                this.jipaiTip_7.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case '8':
                this.jipaiTip_8.active = true;
                this.jipaiTip_8.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case '9':
                this.jipaiTip_9.active = true;
                this.jipaiTip_9.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case 'J':
                this.jipaiTip_J.active = true;
                this.jipaiTip_J.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case 'Q':
                this.jipaiTip_Q.active = true;
                this.jipaiTip_Q.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
            case 'K':
                this.jipaiTip_K.active = true;
                this.jipaiTip_K.getComponent(cc.Sprite).spriteFrame = paiPlist.getSpriteFrame(img_name);
                break;
        }

    }

    //重置记牌器
    resetView() {
        this.hidenAllTip();
        for (let i = 0; i < paiArray.length; i++) {
            this.jipaiLabel[i].string = "0";
            this.jipaiLabel[i].node.color = cc.color(0xA3, 0x97, 0x65);
        }
    }
}
