import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { h } from "../../../../../../../script/common/H";
import SZbudgetView from "./SZbudgetView";


export class SZbudgetController extends HallBaseModel {
    static showJiesuanView(data) {
        let view = new SZbudgetView(data);
        h.viewManager.pushView(view);
    }
 }