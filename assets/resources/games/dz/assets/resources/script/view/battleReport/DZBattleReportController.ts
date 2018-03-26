/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { DZBattleReportView } from "./DZBattleReportView";
import { h } from "../../../../../../../script/common/H";

export class DZBattleReportController {
    static showBattleReportView() {
        let view = new DZBattleReportView();
        h.viewManager.pushView(view);
    }
    // //请求试玩数据
    // static requestTestPlay(callback:Function){
    //     h.http.get(DZGameUrl.getInviteFriend() +'/'+HallUserModel.getInstance().getUserID()/*'5a6556193b7e1fa75ca20dd7'*/, function(data){
    //         if (callback) {
    //             callback(data);
    //         }
    //     });
    // }

}