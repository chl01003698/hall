import { NNLoadingController } from "./view/loading/NNLoadingController";
import NNgameControler from "./view/game/NNgameControler";
import { h } from "../../../../../script/common/H";

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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(){
        this.regPush();
        this.regEvent();
    }

    regPush(){
    }

    regEvent(){
        h.log.debug('----wx regEvent 1')
        NNgameControler.getInstance().addBaseListeners();
    }

    start () {
        this.init();
        NNLoadingController.showLoadingView();
    }

    // update (dt) {},
}
