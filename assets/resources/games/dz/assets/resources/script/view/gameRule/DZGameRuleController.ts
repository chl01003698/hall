/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { h } from "../../../../../../../script/common/H";
import {DZGameRuleView} from "./DZGameRuleView";

export class DZGameRuleController {
    static showGameRuleView(type) {
        let view = new DZGameRuleView(type);
        h.viewManager.pushView(view);
    }
}