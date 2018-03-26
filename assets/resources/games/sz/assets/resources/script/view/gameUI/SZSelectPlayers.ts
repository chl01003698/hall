import { SZGameUtil } from "../../common/SZGameUtil";
import { HallUtil } from "../../../../../../../script/util/HallUtil";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZSelectPlayers")
export default class SZSelectPlayers extends cc.Component {
    gameView: any;

   //显示倒计时
   begin(gameView) {
        this.gameView = gameView;
        this.node.active = true;
   }

   //结束倒计时
   over() {
       this.gameView.playersControl.hideAllPkBtn();
       this.node.active = false;
   }

}
