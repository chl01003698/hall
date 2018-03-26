import { h } from "../../../../../../../script/common/H";
import { NNGameUtil } from "../../common/NNGameUtil";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { NNConstant } from "../../common/NNConstant";

/**
 * 牌桌上UI上所有按钮的操作
 */
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/UIBtn")
export default class UIBtn extends cc.Component {
    gameView: any;

    //点击退出
    onClickExit() {
        h.log.debug("NNGameView-->退出 quitGame NNGameUtil.game_status=" + NNGameUtil.game_status)
        if (NNGameUtil.game_status == NNConstant.gameProgress.table) {
            h.log.debug("----wx In onClickExit UserID = " + HallUserModel.getInstance().getUserID() + ', ownerId = ' + NNGameUtil.ownerId)
            //游戏未开始前  房主直接调销毁房间  非房主直接调用离开房间
            if (HallUserModel.getInstance().getUserID() == NNGameUtil.ownerId) {
                h.log.debug("房主销毁房间..");
                HallController.destroy(function () {
                    //房主销毁房间
                    h.log.debug("房主销毁房间...接口返回");
                }.bind(this));
            } else {
                h.log.debug("非房主离开房间..");
                HallController.leave(function () {
                    h.log.debug("非房主离开房间...接口返回");
                }.bind(this));
            }
        } else {
            //投票解散房间
            h.log.debug("投票解散房间...");
            HallController.dissolve(function () {
                h.log.debug("投票解散房间...接口返回");
            }.bind(this));
        }
    }

    //点击加好友
    onClickAddFriend() {

    }

    //点击战绩
    onClickReport() {
        
    }

    //点击规则
    onClickRule() {

    }

    //点击设置
    onClickSetting() {

    }

    //点击文字聊天
    onClickChat() {

    }

    //点击发送主意
    onClickVoice() {

    }

    initView(gameView) {
        this.gameView =  gameView;
    }
}
