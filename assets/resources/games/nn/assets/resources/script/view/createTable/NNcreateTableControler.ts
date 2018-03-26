
import { h } from "../../../../../../../script/common/H";
import NNcreateTableView from "./NNcreateTableView";
import { NNcreateTableMode } from "./NNcreateTableMode";

export class NNcreateTableControler {

   static showCreateTableView() {
        let view = new NNcreateTableView();
        h.viewManager.pushView(view);
    }


     static getTableInfo(callback: Function) {
        // h.http.getFile("http://chess-dev.oss-cn-beijing.aliyuncs.com/szCreate/szCreate.json", function(data){
        //     NNcreateTableMode.getInstance().setCreateData(JSON.parse(data));
        //     if (callback) {
        //         callback();
        //     }
        // });
        
    }
}