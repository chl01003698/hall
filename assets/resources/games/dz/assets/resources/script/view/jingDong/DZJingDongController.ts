/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { DZJingDongView } from "./DZJingDongView";
import { h } from "../../../../../../../script/common/H";
import {DZJingDongModel} from "./DZJingDongModel";
import {DZGameUrl} from "../../common/DZGameUrl";
import {HallStringUtil} from "../../../../../../../script/util/HallStringUtil";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import { HallNetConfig } from "../../../../../../../script/net/HallNetConfig";

export class DZJingDongController {
    static showJingDongView() {
         this.requsetInviteTotal(this.FN_GetInvitedTotalData);
        // let view = new DZJingDongView();
        // h.viewManager.pushView(view);
        // DZJingDongModel.getInstance().FN_SetInviteNum(5);
    }

    //请求邀请人数
    static requsetInviteTotal(callback:Function){
        h.http.get(HallNetConfig.h5url.inviteGiftCard +'/'+HallUserModel.getInstance().getUserID()/*'5a6556193b7e1fa75ca20dd7'*/, function(data){
            if (callback) {
                callback(data);
            }
        });
    }

    static FN_GetInvitedTotalData(data){
        if(data.code != -1){
            DZJingDongModel.getInstance().FN_SetInviteNum(data.data.invited.friends.length);
            DZJingDongModel.getInstance().FN_SetFriendList(data.data.invited.friends);
            DZJingDongModel.getInstance().FN_SetReward(data.data.invited.award);
        }
        let view = new DZJingDongView();
        h.viewManager.pushView(view);
    }

    //请求领取奖励
    static requsetReward(callback:Function,info){
        h.http.put(HallNetConfig.h5url.getRewardCard, function(data){
            if (callback) {
                callback(data);
            }
        },info);
    }

}