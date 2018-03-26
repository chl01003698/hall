/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 15:52:01 
 * @Desc: 文件描述
 */

import { DZShopView } from "./DZShopView";
import { h } from "../../../../../../../script/common/H";

 export class DZShopController {

    static showShopView(){
        let view = new DZShopView();
        h.viewManager.pushView(view);
    }
 }