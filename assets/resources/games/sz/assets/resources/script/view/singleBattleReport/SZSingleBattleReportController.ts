/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 22:04:53 
 * @Desc: 文件描述
 */

import { SZSingleBattleReportView } from "./SZSingleBattleReportView";
import { h } from "../../../../../../../script/common/H";
import { SZSingleBattleReportModel } from "./SZSingleBattleReportModel";

 export class SZSingleBattleReportController{
    static showSingleBattleReportView(data:any){
        SZSingleBattleReportModel.getInstance().setData(data);
        let view = new SZSingleBattleReportView();
        h.viewManager.pushView(view);
    }

    
 }