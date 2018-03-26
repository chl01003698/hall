/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { SelfInfoView } from "./SelfInfoView";
import { h } from "../../../../../../../script/common/H";

export class SelfInfoController {
    static showSelfInfoView() {
        let view = new SelfInfoView();
        h.viewManager.pushView(view);
    }
}