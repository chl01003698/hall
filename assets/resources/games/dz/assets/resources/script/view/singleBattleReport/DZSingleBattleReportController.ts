/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 13:40:11 
 * @Desc: 文件描述
 */

import { DZSingleBattleReportView } from "./DZSingleBattleReportView";
import { h } from "../../../../../../../script/common/H";
import { HallStringUtil } from "../../../../../../../script/util/HallStringUtil";

 export class DZSingleBattleReportController {

    static showSingleBattleReportView(data:any, isPlaying:boolean = false){
        let view = new DZSingleBattleReportView(data, isPlaying);
        h.viewManager.pushView(view);
    }

    static replay(recordId){
        let url = HallStringUtil.format("http://chess-dev.oss-cn-beijing.aliyuncs.com/record/{0}.json", recordId);
        h.http.get(url, function(data){
            h.replayManager.startWithData(data);
        });
    }
 }