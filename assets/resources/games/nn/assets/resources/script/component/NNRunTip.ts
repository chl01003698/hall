import { DZHallModel } from "../../../../../dz/assets/resources/script/view/hall/DZHallModel";

/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 16:54:33 
 * @Desc: 跑马灯
 */

// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    textLabel: cc.Node = null;

    @property(cc.Node)
    textBgNode: cc.Node = null;
    
    @property
    speed:number = 100;

    tips:string[] = [];
    index:number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.tips = DZHallModel.getInstance().getTips();
        this.showTip();
    },

    showTip(){
        let tip:string = this.tips[this.index];
        this.textLabel.getComponent(cc.Label).string = tip;
        this.textLabel.x = this.textBgNode.width - 10;
        this.textLabel.runAction(cc.sequence(
            cc.moveTo((this.textBgNode.width + this.textLabel.width) / 100, cc.p(-this.textLabel.width - 10, 0)),
            cc.callFunc(function () {
                this.index++;
                if(this.index == this.tips.length) {
                    this.index = 0;
                }
                this.showTip();
            }.bind(this))
        ));
    }
    // update (dt) {},
}
