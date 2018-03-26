/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { DZHallView } from "./DZHallView";
import { h } from "../../../../../../../script/common/H";
import { HallNetConfig } from "../../../../../../../script/net/HallNetConfig";
import { DZWebView } from "../common/DZWebView";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import {DZConstant} from "../../common/DZConstant";
import {DZGameModel} from "../game/DZGameModel";
import { DZPlaySound } from "../game/sound/DZPlaySound";

export class DZHallController {
    static showDZHallView(prefabName:string = null) {
        HallController.closeHallView();
        DZGameModel.getInstance().clearPlayerMap();
        DZGameModel.getInstance().clearAllData();
        DZPlaySound.getInstance().clearPlayer();
        let view = new DZHallView(prefabName);
        h.viewManager.pushView(view);
    }

    static showServiceGirl(){
        let param = {
            sysNum:"85062fe155bf4d6b934251e785ccb87e",
            partnerId:undefined,
            uname:undefined
        }
        let url:string = h.http.getUrl(HallNetConfig.service, param);
        DZWebView.show(url,DZConstant.webType.service);
    }
}