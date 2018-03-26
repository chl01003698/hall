import { SZGameUtil } from "../../common/SZGameUtil";
import { HallUtil } from "../../../../../../../script/util/HallUtil";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZCountDown")
export default class SZCountDown extends cc.Component {
    time: any;
    alarmTimer: any;
    gameView: any;

    @property(cc.Label)
    readyTime:cc.Label = null;

   //显示倒计时
   begin(time) {
        this.node.active = true;
        this.time = time;
        this.readyTime.string = this.time;
        this.alarmTimer = HallUtil.schedule(function () {
            this.updateTime();
        }.bind(this), this.node, 1.0, true);
   }

   //结束倒计时
   over() {
       this.node.active = false;
       this.node.stopAction(this.alarmTimer);
   }

   updateTime() {
        this.time -=1;
        this.readyTime.string = this.time;
        if (this.time == 0) {
            this.over();        
        }
    }

}
