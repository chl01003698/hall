/* * @Author: baizhanxiao 
 * @Date: 2018-02-11 17:56:54 
 * @Desc: 斗地主解散
 */

import { HallDismissView } from "../../../../../../../../script/view/dismiss/HallDismissView";
import { DZGameModel } from "../DZGameModel";
import { DZGameController } from "../DZGameController";
import { DZHallController } from "../../hall/DZHallController";

 export class DZDismissView extends HallDismissView {


    getPlayerData(uid){
        return DZGameModel.getInstance().getPlayerData(uid);
    }

    btnOk(){
        DZGameController.removeDZGameView();
        DZHallController.showDZHallView();
    }
 }
