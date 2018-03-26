/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-11 14:46:41 
 * @Desc: 解散
 */

import { HallDismissView, HallDismissViewSign } from "./HallDismissView";
import { h } from "../../common/H";

export class HallDismissController {

    static showDismissView() {
        let view = new HallDismissView();
        h.viewManager.pushView(view);
    }

    static refreshDismissView() {
        let view = h.viewManager.getViewBySign(HallDismissViewSign);
        view.refreshData();
    }

    static dealDismissResult(){
        let view = h.viewManager.getViewBySign(HallDismissViewSign);
        view.dealDismissResult();
    }

}
