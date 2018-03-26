/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { TestPlayView } from "./TestPlayView";
import { h } from "../../../../../../../script/common/H";
import {DZGameUrl} from "../../common/DZGameUrl";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {DZTestPlayModel} from "./DZTestPlayModel";

export class TestPlayController {
    static showTestPlayView() {
        let view = new TestPlayView();
        h.viewManager.pushView(view);
    }

    //请求试玩数据
    static requestTestPlay(callback:Function){
        h.http.get(DZGameUrl.getTestPlay(), function(data){
            if (callback) {
                DZTestPlayModel.getInstance().FN_SetWeChat(data.wechatGroup);
                DZTestPlayModel.getInstance().FN_SetImageItems(data.items);
                callback(data);
            }
        });
    }

}