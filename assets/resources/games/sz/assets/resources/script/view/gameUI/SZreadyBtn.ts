import { SZGameUtil } from "../../common/SZGameUtil";
import { HallController } from "../../../../../../../script/view/hall/HallController";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/readyBtn")
export default class readyBtn extends cc.Component {
    canReady: boolean;
    canBegin: boolean = true;
    @property(cc.Node)
    ready:cc.Node = null;   //准备


    @property(cc.Node)
    invite: cc.Node = null;     //邀请

    initView() {
        this.canReady = true;
        this.ready.on("touchend",function(){
            if(this.canReady) {
                cc.log('### 发送准备');
                HallController.ready(this.clickReadyBtn.bind(this));
                this.setreadyState(false);
            }else {
                cc.log('### 发送取消准备');
                HallController.cancelReady(this.clickReadyBtn.bind(this));
                this.setreadyState(true);
            }
        }.bind(this))

        this.invite.on('touchend',function(){
            //点击邀请
        }.bind(this))
    }

    clickReadyBtn() {

    }

    // /**
    //  * 开始按钮的亮与灰
    //  * 
    //  * @param {any} isLight 
    //  * @memberof readyBtn
    //  */
    // setBeginState(isLight) {
    //     let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/sz_youxizhong',cc.SpriteAtlas);
    //     if(isLight) {
    //         this.canBegin = true;
    //         this.begin.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b1');
    //         this.begin.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x34,0x5d,0x88);
    //     }else {
    //         this.canBegin = false;
    //         this.begin.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b3');
    //         this.begin.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x6b,0x6b,0x6b);
    //     }
    // }

    /**
     * 准备按钮的亮与灰
     * 
     * @param {any} isLight 
     * @memberof readyBtn
     */
    setreadyState(isLight) {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/sz_youxizhong',cc.SpriteAtlas);
        if(isLight) {
            this.canReady = true;
            this.ready.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b2');
            this.ready.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0xaa,0x8b,0x34);
            this.ready.getChildByName('label').getComponent(cc.Label).string = '准备';
            this.ready.getChildByName('label').getComponent(cc.Label).fontSize = 35;
        }else {
            this.canReady = false;
            this.ready.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b2');
            this.ready.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0xaa,0x8b,0x34);
            this.ready.getChildByName('label').getComponent(cc.Label).string = '取消准备';
            this.ready.getChildByName('label').getComponent(cc.Label).fontSize = 28;
        }
    }

    /**
     * 取是不是可以点击准备
     * 
     * @returns 
     * @memberof readyBtn
     */
    getReadyState() {
        cc.log('getReadyState' + this.canReady);
        return this.canReady;
    }
}
