/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-30 12:13:38 
 * @Desc: 文件描述
 */

import { h } from "../../../../../../../script/common/H";
import { SZHallView } from "./SZHallView";
import { HallController } from "../../../../../../../script/view/hall/HallController";

 export class SZHallController {

    static showHallView(){
        HallController.closeHallView();
        let view = new SZHallView();
        h.viewManager.pushView(view);
    }
 }