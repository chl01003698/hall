/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-15 15:08:39 
 * @Desc: logo
 */

import { HallLogoView } from "./HallLogoView";
import { h } from "../../common/H";

export class HallLogoController {

    static showLogoView() {
        let view: HallLogoView = new HallLogoView();
        h.viewManager.pushView(view);
    }
}