/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { h } from "../../../../../../../script/common/H";
import {DZOnlineCustomerView} from "./DZOnlineCustomerView";

export class DZOnlineCustomerController {
    static showOnlineCustomerView() {
        let view = new DZOnlineCustomerView();
        h.viewManager.pushView(view);
    }
}