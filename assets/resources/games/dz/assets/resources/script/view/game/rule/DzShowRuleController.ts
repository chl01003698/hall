import { h } from "../../../../../../../../script/common/H";
import { DzShowRuleView } from "./DzShowRuleView";
import { DZConstant } from "../../../common/DZConstant";

/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

export class DzShowRuleController {
    static showRuleView() {
        let view = new DzShowRuleView();
        view.setSign(DZConstant.ruleName);
        h.viewManager.pushView(view);
    }
}