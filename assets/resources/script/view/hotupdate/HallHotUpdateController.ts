/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-09 21:11:45 
 * @Desc: 文件描述
 */

import { HallHotUpdateView } from "./HallHotUpdateView";
import { h } from "../../common/H";

export class HallHotUpdateController {

    static showHotUpdateView(){
        let view = new HallHotUpdateView();
        h.viewManager.pushView(view);
    }
}