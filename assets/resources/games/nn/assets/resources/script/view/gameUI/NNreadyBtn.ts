import { NNGameUtil } from "../../common/NNGameUtil";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { h } from "../../../../../../../script/common/H";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/readyBtn")
export default class readyBtn extends cc.Component {
    isReady: boolean = false

    readyLabel: cc.Label

    @property(cc.Node)
    ready: cc.Node = null       //准备

    @property(cc.Node)
    invite: cc.Node = null      //邀请

    onLoad() {
        this.readyLabel = cc.find('label', this.ready).getComponent(cc.Label)
    }

    initView() {
        this.ready.on("touchend",function(){
            if(this.isReady) {
                HallController.unready(this.clickReadyBtn.bind(this));
                this.setreadyState(false);
            } else {
                HallController.ready(this.clickReadyBtn.bind(this));
                this.setreadyState(true);
            }
        }.bind(this))

        this.invite.on('touchend',function(){
            //点击邀请
        }.bind(this))
    }

    clickReadyBtn() {

    }

    /**
     * 准备按钮的亮与灰
     * 
     * @param {any} isLight 
     * @memberof readyBtn
     */
    setreadyState(isLight) {
        this.isReady = isLight
        if (isLight) {
            this.readyLabel.string = '取消准备'
        } else {
            this.readyLabel.string = '准备游戏'
        }
    }

    /**
     * 取是不是可以点击准备
     * 
     * @returns 
     * @memberof readyBtn
     */
    getReadyState() {
        return this.isReady;
    }
}
