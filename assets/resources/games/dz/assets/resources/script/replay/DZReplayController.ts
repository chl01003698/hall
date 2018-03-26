import { h } from "../../../../../../script/common/H";
import { DZReplayView } from "./DZReplayView";


export class DZReplayController {
    static showDZReplayView(prefabName:string = null) {
        let view = new DZReplayView();
        h.viewManager.pushView(view);
    }

}