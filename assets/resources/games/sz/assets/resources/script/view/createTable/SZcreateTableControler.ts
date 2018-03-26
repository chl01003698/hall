
import { h } from "../../../../../../../script/common/H";
import SZcreateTableView from "./SZcreateTableView";
import { SZcreateTableMode } from "./SZcreateTableMode";

export class SZcreateTableControler {

   static showCreateTableView() {
        let view = new SZcreateTableView();
        h.viewManager.pushView(view);
    }


     static getTableInfo(callback: Function) {
        h.http.getFile("http://chess-dev.oss-cn-beijing.aliyuncs.com/szCreate/szCreate.json", function(data){
            SZcreateTableMode.getInstance().setCreateData(JSON.parse(data));
            if (callback) {
                callback();
            }
        });
        
    }
}