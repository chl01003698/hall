/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 22:25:10 
 * @Desc: 战绩
 */

import { DZZhanjiView } from "./DZZhanjiView";
import { h } from "../../../../../../../script/common/H";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { DZZhanjiModel } from "./DZZhanjiModel";

 export class DZZhanjiController {

    static showZhanjiView(){
        let view:DZZhanjiView = new DZZhanjiView();
        h.viewManager.pushView(view);
    }

    // service ////////////////////////////////////////
    static getRecords(callback:Function, gameName:string){
        let url:string = HallStringUtil.format("/api/v1/records/{0}/{1}", HallUserModel.getInstance().getUserID(), gameName);
        h.http.get(url, function (data) {
            DZZhanjiModel.getInstance().setFightRecordList(data.data);
            if (callback) {
                callback();
            }
        });
    }
 }