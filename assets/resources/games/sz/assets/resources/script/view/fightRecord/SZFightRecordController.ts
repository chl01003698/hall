/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 11:21:20 
 * @Desc: 文件描述
 */

import { SZFightRecordView } from "./SZFightRecordView";
import { h } from "../../../../../../../script/common/H";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { SZConstant } from "../../common/SZConstant";
import { SZFightRecordModel } from "./SZFightRecordModel";

 export class SZFightRecordController {

    static showFightRecordView(){
        let fightRecordView = new SZFightRecordView();
        h.viewManager.pushView(fightRecordView);
    }

    // service ////////////////////////////////////////
    static getRecords(callback:Function){
        let url:string = HallStringUtil.format("/api/v1/records/{0}/{1}", HallUserModel.getInstance().getUserID(), SZConstant.gameName);
        h.http.get(url, function (data) {
            SZFightRecordModel.getInstance().setFightRecordList(data.data);
            if (callback) {
                callback();
            }
        });
    }
 }