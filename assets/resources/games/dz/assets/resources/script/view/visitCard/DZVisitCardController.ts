/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 11:09:29 
 * @Desc: 文件描述
 */


import { DZVisitCardView } from "./DZVisitCardView";
import { h } from "../../../../../../../script/common/H";

 export class DZVisitCardController {

    static showVisitCardView(){
        let view = new DZVisitCardView();
        h.viewManager.pushView(view);
    }
 }