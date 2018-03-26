/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 22:04:53 
 * @Desc: 文件描述
 */

import { NNSingleBattleReportView } from "./NNSingleBattleReportView";
import { h } from "../../../../../../../script/common/H";
import { NNSingleBattleReportModel } from "./NNSingleBattleReportModel";

 export class NNSingleBattleReportController{
    static showSingleBattleReportView(data:any){
        NNSingleBattleReportModel.getInstance().setData(data);
        let view = new NNSingleBattleReportView();
        h.viewManager.pushView(view);
    }

    
 }