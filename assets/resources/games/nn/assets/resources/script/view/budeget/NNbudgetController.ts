import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { h } from "../../../../../../../script/common/H";
import NNbudgetView from "./NNbudgetView";


export class NNbudgetController extends HallBaseModel {
    static showJiesuanView(data) {
        let view = new NNbudgetView(data);
        h.viewManager.pushView(view);
    }
 }