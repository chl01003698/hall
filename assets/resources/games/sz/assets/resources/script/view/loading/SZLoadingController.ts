/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-30 12:22:38 
 * @Desc: 文件描述
 */

import { SZLoadingView } from "./SZLoadingView";
import { h } from "../../../../../../../script/common/H";

 export class SZLoadingController {

    static showLoadingView(){
        let view = new SZLoadingView();
        h.viewManager.pushView(view);
    }
 }