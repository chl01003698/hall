/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { h } from "../../../../../../../script/common/H";
import {DZChatCommonView} from "./DZChatCommonView";

export class DZChatCommonController {
    static showChatCommonView() {
        let view = new DZChatCommonView();
        h.viewManager.pushView(view);
    }
}