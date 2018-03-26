/*
 * @Author: wang jun wei 
 * @Date: 2018-01-20 16:42:50 
 * @Last Modified by: wang jun wei
 * @Last Modified time: 2018-01-21 12:42:08
 */
import DZJoinTableView from "./DZJoinTableView";
import { h } from "../../../../../../../script/common/H";



export class DZJoinTableController {
   static showJoinTableView() {
        let view = new DZJoinTableView();
        h.viewManager.pushView(view);
    }
    
}