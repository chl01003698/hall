/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { h } from "../../../../../../../script/common/H";
import {DZGameSelfInfoView} from "./DZGameSelfInfoView";
import {DZFriendController} from "../friend/DZFriendController";

export class DZGameSelfInfoController {
    static showGameSelfInfoView(shortId:any) {
        DZFriendController.getUserDetail(function(userData){
            let view = new DZGameSelfInfoView(userData.data);
            h.viewManager.pushView(view);
        },shortId);

    }
}