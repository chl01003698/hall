/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-22 13:59:02 
 * @Desc: 
 */

import { DZSetView } from "./DZSetView";
import { h } from "../../../../../../../script/common/H";

 export class DZSetController {

    static showSetView(){
        let view = new DZSetView();
        h.viewManager.pushView(view);
    }
 }