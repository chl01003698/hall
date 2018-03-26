/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-30 12:22:38 
 * @Desc: 文件描述
 */

import { NNLoadingView } from "./NNLoadingView";
import { h } from "../../../../../../../script/common/H";

 export class NNLoadingController {

    static showLoadingView(){
        let view = new NNLoadingView();
        h.viewManager.pushView(view);
    }
 }