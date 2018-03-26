import { h } from "../common/H";
import { HallUtil } from "../util/HallUtil";
import { HallUserModel } from "../view/login/HallUserModel";

/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-26 11:21:10 
 * @Desc: 重播
 */

export class HallReplayManager {

    private data = null
    private stepIndex: number = 0;
    private speed: number = 1;
    private action: cc.Action = null;

    startWithData(data) {
        data.isReplay = true;
        this.stepIndex = 0;
        h.pomelo.emit("allPush", "onPlayerJoinGame_", data);
        this.data = data;
        //过滤叫庄等无用的命令协议
        this.filerData();
        cc.log('startWithData' + JSON.stringify(this.data.commands));
        this.action = HallUtil.schedule(this.nextStep.bind(this), cc.director.getRunningScene(), 1, true);
    }

    filerData() {
        let filterArray = ['dz_onCallZhuang'];
        let data = this.data.commands.filter(function (item) {
            return filterArray.indexOf(item.type) < 0;
        });
        //h.log.debug("==@@=" + JSON.stringify(data));
        for (let i = 0; i < data.length; i++) {
            if (data[i].type == 'dz_onMakeLandlord_') {
                if (data[i].msg.uid != HallUserModel.getInstance().getUserID()) {
                    delete data[i];
                }
            }
        }
        //h.log.debug("==@@@@=" + JSON.stringify(data));
        let dataStr = JSON.stringify(data);
        const _ = window['node_require']('lodash')
        dataStr = _.replace(dataStr,'null,','');
        data = JSON.parse(dataStr);
        //h.log.debug("==@@@@ after=" + JSON.stringify(data));
        this.data.commands = data;
    }

    nextStep(dt) {
        h.log.debug("test===", this.stepIndex);
        let command = this.data.commands[this.stepIndex++];

        cc.log('nextStep  ' + JSON.stringify(command));
        if (!command) {
            //this.stop();
            return;
        }
        //删除按钮信息，按钮不需要显示
        delete command.msg.action;
        command.msg.isReplay = true;
        h.pomelo.emit("allPush", command.type, command.msg);
        // h.pomelo.emit("allPush", command.type, JSON.stringify(command.msg));
    }

    speedUp() {
        ++this.speed;
        if (this.speed > 3) {
            return;
        }
        cc.director.getScheduler().setTimeScale(this.speed);
    }

    speedDown() {
        --this.speed;
        if (this.speed < -3) {
            return;
        }
        cc.director.getScheduler().setTimeScale(this.speed);
    }

    resume() {
        cc.game.resume();
    }

    pause() {
        cc.game.pause();
    }

    stop() {
        cc.director.getScheduler().setTimeScale(1);
        cc.director.getRunningScene().stopAction(this.action);
    }
}
