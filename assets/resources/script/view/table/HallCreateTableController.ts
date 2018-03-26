/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-27 21:04:14 
 * @Desc: 文件描述
 */

import { h } from "../../common/H";
import { HallCreateTableView } from "./HallCreateTableView";

 export class HallCreateTableController {

    static showCreateTableView(){
        let view = new HallCreateTableView();
        h.viewManager.pushView(view);
    }
 }