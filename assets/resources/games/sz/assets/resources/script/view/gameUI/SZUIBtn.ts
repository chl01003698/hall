import { h } from "../../../../../../../script/common/H";

/**
 * 牌桌上UI上所有按钮的操作
 */

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/UIBtn")
export default class UIBtn extends cc.Component {
    gameView: any;

    //点击退出
    onClickExit() {
        h.viewManager.removeView(this.gameView);
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

    onclickTest() {
        if(this.gameView.uiNode_test.activeInHierarchy) {
            this.gameView.uiNode_test.active = false;
        }else {
            this.gameView.uiNode_test.active = true;
        }
    }
}
