// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

import { HallBaseView } from "./HallBaseView";
import { h } from "./H";
import { HallUtil } from "../util/HallUtil";
import { HallAlert, HallAlertType } from "./HallAlert";
import { HallNetConfig } from "../net/HallNetConfig";
import { HallLoginController } from "../view/login/HallLoginController";
import { HallUserModel } from "../view/login/HallUserModel";

export let HallNetWaitingViewSign = "net_waiting";
export class HallNetWaiting extends HallBaseView {

    private tipLabel: cc.Node;
    //网络连接倒计时秒数
    private waitSeconds: number = 30;
    constructor() {
        super();
        this.setBindDatas({
            tipText: { varName: "tipLabel" }
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/common/NetWaiting");
    }

    onPrefabLoaded() {
        this.tipLabel.getComponent(cc.Label).string = "网络不稳定,正在努力加载中(30)";
    }

    //显示等待框
    static show() {
        let viewWaiting = h.viewManager.getViewBySign(HallNetWaitingViewSign);
        if(!viewWaiting){
            let view: HallNetWaiting = new HallNetWaiting();
            view.setSign(HallNetWaitingViewSign);
            h.viewManager.pushView(view);
            if(view){
                view.startClock();
            }
        }
    }
    //删除等待框
    static removeWaiting() {
        h.log.debug("pomelo...删除等待框");
        let view = h.viewManager.getViewBySign(HallNetWaitingViewSign);
        if(view){
            view.stopClock();
            h.viewManager.removeView(view);
        }
    }

    //更新数字
    updateTime() {
        this.waitSeconds -= 1;
        this.tipLabel.getComponent(cc.Label).string = "网络不稳定,正在努力加载中(" + String(this.waitSeconds) + ")";
        if (this.waitSeconds <= 0) {
            //时间到，默认发送同意
            h.log.debug("pomelo...时间到，弹出提示框");
            HallNetWaiting.removeWaiting();
            let alertView = HallAlert.show('重连失败,请开启网络再次重试',this.ok.bind(this),this.cancelNet.bind(this));
            alertView.setType(HallAlertType.twoButton);
        }else{
            if(this.waitSeconds % 3 == 0){
                h.log.debug("pomelo..." + this.waitSeconds + "秒尝试重连...");
                this.reconnect();
            }
        }
    }

    ok() {
        //确定后重连，先判断有无网络，有网络重连，无网络跳到登陆页面
        if(h.commonSDK.checkHaveNet()){
            this.reconnect();
        }else{
            //跳到登陆界面
            //h.viewManager.popToRootView();
            let alertView = HallAlert.show('重连失败,请开启网络再次重试',this.ok.bind(this),this.cancelNet.bind(this));
            alertView.setType(HallAlertType.twoButton);
        }
    }

    cancelNet(){
        //取消跳到登陆界面
        h.viewManager.popToRootView();
    }

    reconnect(){
        h.net.initPomelo(HallNetConfig.host, HallNetConfig.port,function(){
            h.log.debug("pomelo...确定后重连成功...");
            HallNetWaiting.removeWaiting();
            HallLoginController.login(function(){
                h.log.debug("pomelo...确定后重连成功...登陆成功");
            }, HallUserModel.getInstance().getToken());
        });
    }

    /**
    * 启动闹钟
    */
    startClock() {
        if (this.tipLabel) {
            HallUtil.schedule(this.updateTime.bind(this), this.tipLabel, 1, true);
        }
    }

    //停止闹钟
    stopClock() {
        if (this.tipLabel) {
            this.tipLabel.stopAllActions();
        }
    }

}
