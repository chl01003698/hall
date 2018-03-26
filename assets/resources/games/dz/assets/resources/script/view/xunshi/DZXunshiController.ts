/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-22 22:08:46 
 * @Desc: 文件描述
 */

import { DZXunshiView } from "./DZXunshiView";
import { h } from "../../../../../../../script/common/H";

 export class DZXunshiController {

    static showXunshiView(){
        let view = new DZXunshiView();
        h.viewManager.pushView(view);
    }
 }