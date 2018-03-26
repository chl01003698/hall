/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-11 18:01:17 
 * @Desc: 文件描述
 */

import { HallDismissController } from "../../../../../../../../script/view/dismiss/HallDismissController";
import { DZDismissView } from "./DZDismissView";
import { h } from "../../../../../../../../script/common/H";

export class DZDismissController extends HallDismissController {

    static showDismissView() {
        let view = new DZDismissView();
        h.viewManager.pushView(view);
    }

}
