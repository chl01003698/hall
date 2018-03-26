/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-15 14:48:44 
 * @Desc: logo
 */

import { HallBaseView } from "../../common/HallBaseView";
import { HallLoginController } from "../login/HallLoginController";
import { h } from "../../common/H";
import { HallLoadingController } from "../loading/HallLoadingController";

export class HallLogoView extends HallBaseView {
    constructor() {
        super();
        this.setPrefab("res/prefab/login/logo");
    }
    onPrefabLoaded() {
        let delayAction = cc.delayTime(1);
        let hideAction = cc.fadeTo(1, 100);
        let callback = cc.callFunc(this.closeCallback, this);
        let seq = cc.sequence(delayAction, hideAction, callback);
        this.prefabNode.runAction(seq);
    }
    closeCallback() {
        h.viewManager.removeView(this);
        HallLoadingController.showLoadingView();
    }
}