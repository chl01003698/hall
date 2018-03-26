/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 01:44:55 
 * @Desc: 斗地主启动脚本
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

import { DZGameController } from "./view/game/DZGameController";
import { DZLoadingController } from "./view/loading/DZLoadingController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(){
        this.regPush();
        this.regEvent();
    }

    regPush(){
    }

    regEvent(){
        DZGameController.getInstance().addGameListeners();
    }


    start () {
        this.init();
        DZLoadingController.showLoadingView();
    }

    // update (dt) {},
}
