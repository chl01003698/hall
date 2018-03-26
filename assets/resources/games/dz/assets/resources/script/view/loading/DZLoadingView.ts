/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-20 12:38:35 
 * @Desc: 斗地主加载界面
 */

import { h } from "../../../../../../../script/common/H";
import { HallLoadingView } from "../../../../../../../script/view/loading/HallLoadingView";
import { DZGameController } from "../game/DZGameController";
import { DZHallController } from "../hall/DZHallController";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { HallConstant } from "../../../../../../../script/view/hall/HallConstant";
import { DZConstant } from "../../common/DZConstant";

 export class DZLoadingView extends HallLoadingView {

    onFinished(){
        //h.viewManager.popToGameStartView();
        HallController.closeHallView();
        h.viewManager.removeView(this);
        h.log.debug("@@@...DZLoadingView..加载完成,派发监听事件HallConstant.GameEvent.loaded");
        h.eventManager.dispatchEvent(HallConstant.GameEvent.loaded);
        h.log.debug("@@@...DZLoadingView..加载完成 gameName=" + h.viewManager.getViewBySign(DZConstant.gameName));
        if(!h.viewManager.getViewBySign(DZConstant.gameName)){
            h.log.debug("@@@...DZLoadingView..加载完成,子游戏没有启动，显示大厅");
            DZHallController.showDZHallView();
        }else{
            h.log.debug("@@@...DZLoadingView..加载完成,子游戏已经启动");
        }


    }
 }
