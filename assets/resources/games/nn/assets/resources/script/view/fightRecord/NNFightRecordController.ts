/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 11:21:20 
 * @Desc: 文件描述
 */

import { NNFightRecordView } from "./NNFightRecordView";
import { h } from "../../../../../../../script/common/H";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { NNConstant } from "../../common/NNConstant";
import { NNFightRecordModel } from "./NNFightRecordModel";

 export class NNFightRecordController {

    static showFightRecordView(){
        let fightRecordView = new NNFightRecordView();
        h.viewManager.pushView(fightRecordView);
    }

    // service ////////////////////////////////////////
    static getRecords(callback:Function){
        let url:string = HallStringUtil.format("/api/v1/records/{0}/{1}", HallUserModel.getInstance().getUserID(), NNConstant.gameName);
        h.http.get(url, function (data) {
            NNFightRecordModel.getInstance().setFightRecordList(data.data);
            if (callback) {
                callback();
            }
        });
    }
 }