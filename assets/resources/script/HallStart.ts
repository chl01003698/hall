
// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

import { HallLogoController } from "./view/logo/HallLogoController";
import {h} from "./common/H";
import { HallController } from "./view/hall/HallController";
import { HallUtil } from "./util/HallUtil";
import { HallLogView } from "./view/test/HallLogView";
import { HallTimeUtil } from "./common/HallTimeUtil";
import { DZGameController } from "../games/dz/assets/resources/script/view/game/DZGameController";
import SZgameControler from "../games/sz/assets/resources/script/view/game/SZgameControler";
import NNgameControler from "../games/nn/assets/resources/script/view/game/NNgameControler";
import { HallFriendController } from "./view/friend/HallFriendController";
import * as _ from
const { ccclass, property } = cc._decorator;

@ccclass
    export default class HallStart extends cc.Component {
        // LIFE-CYCLE CALLBACKS:

        // onLoad () {},
        
        init(){

            const _ = window['node_require']('lodash')
            cc.log('===========+++')
            cc.log(_.includes([1,2,3], 1))
            this.regPush();
            this.regEvent();
            h.commonSDK.init();
            h.voiceManager.init();
            cc.game.on(cc.game.EVENT_HIDE, function () {
                
            });
            cc.game.on(cc.game.EVENT_SHOW, function () {
                HallController.checkMwurl();
            });
        }

        regPush(){
            SZgameControler.getInstance().addCommonListeners();
            DZGameController.getInstance().addBaseListeners();
            NNgameControler.getInstance().addCommonListeners();
            HallController.regOnUpdateConfig(null);
            HallFriendController.onInviteJoinGame(null);
            HallFriendController.onAddFriend(null);
            HallFriendController.onJoinFriendGame(null);
            HallFriendController.onRefuseInvite(null);
            HallFriendController.onAgreeJoinGame(null);
            HallFriendController.onRefuseJoinGame(null);
        }

        regEvent(){

        }

        start() {
            window.__errorHandler = function (filename, lineNumber, message, stack) {
                cc.loader.loadRes("res/config/project.manifest", function(err, data){
                    const _ = window['node_require']('lodash')
                    if(_.isEmpty(data)){
                        return;
                    }
                    let version = JSON.parse(data).version;
                    let text = "";
                    text += "date:" + HallTimeUtil.getDateByFormat(parseInt(version), "yyyy-MM-dd hh:mm:ss") + "\n";
                    text += "filename:" + filename + "\n";
                    text += "lineNumber:" + lineNumber + "\n";
                    text += "message:" + message + "\n";
                    text += "stack:" + stack + "\n";
                    HallLogView.show(text);
                })
            }
            this.init();
            let s = cc.view.getViewPortRect();
            cc.view.setDesignResolutionSize(s.width, s.height, cc.ResolutionPolicy.SHOW_ALL);
            let visibleSize = cc.director.getVisibleSize();
            this.node.setPosition(visibleSize.width * 0.5, visibleSize.height * 0.5);
            h.viewManager.setRootNode(this.node);
            HallLogoController.showLogoView();
        }
    }
