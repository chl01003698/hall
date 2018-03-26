import NNJoinTableView from "./NNJoinTableView";
import { h } from "../../../../../../../script/common/H";

export class NNJoinTableController {
   static showJoinTableView() {
        let view = new NNJoinTableView();
        h.viewManager.pushView(view);
    }
    
}