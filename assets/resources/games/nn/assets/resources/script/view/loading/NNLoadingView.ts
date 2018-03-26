/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-30 12:12:16 
 * @Desc: 三张加载
 */

import { HallLoadingView } from "../../../../../../../script/view/loading/HallLoadingView";
import { NNHallController } from "../hall/NNHallController";
import { h } from "../../../../../../../script/common/H";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { NNConstant } from "../../common/NNConstant";

 export class NNLoadingView extends HallLoadingView {


    onFinished(){
        h.viewManager.popToGameStartView();
        HallController.closeHallView();
        cc.log('## NNLoadingView onFinished');
        h.eventManager.dispatchEvent(HallConstant.GameEvent.NNLoaded);
        if(!h.viewManager.getViewBySign(NNConstant.gameName)){
            NNHallController.showHallView();
        }
    }
 }
