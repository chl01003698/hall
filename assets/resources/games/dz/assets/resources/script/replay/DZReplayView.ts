import { HallBaseView } from "../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../script/common/H";
import { DZConstant } from "../common/DZConstant";
import { DZHallController } from "../view/hall/DZHallController";
//回放
export class DZReplayView extends HallBaseView {

    blnPause: boolean = false;
    sptStop: cc.Sprite = null;
    constructor() {
        super();
        this.setBindDatas({
            "back": { varName: "back", callback: this.closeReplayView.bind(this) },
            "replay_back": { varName: "replay_back", callback: this.replay_back.bind(this) },//
            "replay_stop": { varName: "replay_stop", callback: this.replay_stop.bind(this) },//
            "replay_forward": { varName: "replay_forward", callback: this.replay_forward.bind(this) },//
        });
        this.setPrefab("res/prefab/replay/replay");

    }

    onPrefabLoaded() {
        this.blnPause = false;
        this.sptStop = this.replay_stop.getComponent(cc.Sprite);
    }

    closeReplayView() {
        h.log.debug("closeReplayView...");
        h.replayManager.stop();
        h.replayManager.resume();
        h.viewManager.removeViewBySign(DZConstant.resultName);
        h.viewManager.removeView(this);
        h.viewManager.removeViewBySign(DZConstant.gameName);
        DZHallController.showDZHallView();
    }

    replay_back() {
        h.log.debug("replay_back");
        h.replayManager.speedDown();
    }

    replay_stop() {
        h.log.debug("replay_stop");
        this.blnPause = !this.blnPause;
        let yxzPlist = h.resManager.getAtlasByName('res/images/atlas/youxizhong');
        h.log.debug("yxzPlist=" + yxzPlist);
        h.log.debug("sptStop=" + this.sptStop);
        if (this.blnPause) {
            this.sptStop.spriteFrame = yxzPlist.getSpriteFrame('playback_button_ks');
            this.runAction(cc.sequence(
                cc.delayTime(1.0),
                cc.callFunc(this.pauseReplay.bind(this)
                )));

        } else {
            h.replayManager.resume();
            this.sptStop.spriteFrame = yxzPlist.getSpriteFrame('playback_button_zt');
            // this.runAction(cc.sequence(
            //     cc.delayTime(1.0),
            //     cc.callFunc(this.pauseReplay.bind(this)
            //     )));
        }

    }

    pauseReplay() {
        h.replayManager.pause();
    }

    resumeReplay() {
        
    }

    replay_forward() {
        h.log.debug("replay_forward");
        h.replayManager.speedUp();
    }

}