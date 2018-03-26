/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 12:41:06 
 * @Desc: 文件描述
 */

import { DZLoadingView } from "./DZLoadingView";
import { h } from "../../../../../../../script/common/H";

export class DZLoadingController {

    static showLoadingView():DZLoadingView {
        let view:DZLoadingView = new DZLoadingView();
        h.viewManager.pushView(view);
        return view;
    }
}