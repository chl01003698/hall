

//import { HallLoginView } from "./HallLoginView";
import { h } from "../../../../../../script/common/H";
import { DZConstant } from "../common/DZConstant";
import { DZjiesuanView } from "./DZjiesuanView";


export class DZjiesuanController {

    /**
     * 
     * @static
     * @memberof DZjiesuanController
     */
    static showJiesuanView() {    
        let view: DZjiesuanView = new DZjiesuanView();
        view.showMaskView(true);
        view.setSign(DZConstant.resultName);
        h.viewManager.pushView(view);
    }
}
