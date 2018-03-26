/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { DZInvitedFriendView } from "./DZInvitedFriendView";
import { h } from "../../../../../../../script/common/H";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {HallStringUtil} from "../../../../../../../script/util/HallStringUtil";
import {DZGameUrl} from "../../common/DZGameUrl";
import {DZJingDongModel} from "../jingDong/DZJingDongModel";

export class DZInvitedFriendController {
    static showInvitedFriendView() {
        let view = new DZInvitedFriendView();
        h.viewManager.pushView(view);
    }



}