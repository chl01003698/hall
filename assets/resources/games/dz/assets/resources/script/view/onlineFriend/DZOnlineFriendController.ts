/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { h } from "../../../../../../../script/common/H";
import {DZGameUrl} from "../../common/DZGameUrl";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {DZOnlineFriendView} from "./DZOnlineFriendView";
import {DZOnlineFriendModel} from "./DZOnlineFriendModel";

export class DZOnlineFriendController {
    static showOnlineFriendView() {
         this.requsetOnlineFriend(this.FN_GetOnlineFriendData);
    }

    //请求邀请人数
    static requsetOnlineFriend(callback:Function){
        h.http.get(DZGameUrl.getOnlineFriend()+ HallUserModel.getInstance().getUserID()/*'5a6556193b7e1fa75ca20dd7'*/, function(data){
            if (callback) {
                callback(data);
            }
        });
    }

    static FN_GetOnlineFriendData(data){
        DZOnlineFriendModel.getInstance().FN_SetFriendData(data);
        let view = new DZOnlineFriendView();
        h.viewManager.pushView(view);
    }

}