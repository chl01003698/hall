import SZJoinTableView from "./SZJoinTableView";
import { h } from "../../../../../../../script/common/H";

export class SZJoinTableController {
   static showJoinTableView() {
        let view = new SZJoinTableView();
        h.viewManager.pushView(view);
    }
    
}