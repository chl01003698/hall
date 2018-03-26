/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { RealNameView } from "./RealNameView";
import { h } from "../../../../../../../script/common/H";
import {HallStringUtil} from "../../../../../../../script/util/HallStringUtil";
import {DZGameUrl} from "../../common/DZGameUrl";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {HallNetConfig} from "../../../../../../../script/net/HallNetConfig";

export class RealNameController {
    static showRealNameView() {
        let view = new RealNameView();
        h.viewManager.pushView(view);
    }
    //实名认证
    static requsetRealName(callback:Function,info){
        h.http.put(HallStringUtil.format(HallNetConfig.RealName/*DZGameUrl.getRealName()*/,HallUserModel.getInstance().getUserID()), function(data){
            if (callback) {
                callback(data);
            }
        },info);
    }
}