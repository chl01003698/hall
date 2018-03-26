/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-30 12:12:16 
 * @Desc: 三张加载
 */

import { HallLoadingView } from "../../../../../../../script/view/loading/HallLoadingView";
import { SZHallController } from "../hall/SZHallController";
import { h } from "../../../../../../../script/common/H";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { SZConstant } from "../../common/SZConstant";

 export class SZLoadingView extends HallLoadingView {


    onFinished(){
        h.viewManager.popToGameStartView();
        HallController.closeHallView();
        cc.log('## SZLoadingView onFinished');
        h.eventManager.dispatchEvent(HallConstant.GameEvent.SZLoaded);
        if(!h.viewManager.getViewBySign(SZConstant.gameName)){
            SZHallController.showHallView();
        }
    }
 }
