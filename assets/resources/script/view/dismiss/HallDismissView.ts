/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-11 15:04:22 
 * @Desc: 文件描述
 */

import { HallUIUtil } from './../../util/HallUIUtil';
import { HallConstant } from '../hall/HallConstant';
import { HallBaseView } from '../../common/HallBaseView';
import { h } from '../../common/H';
import { HallController } from '../hall/HallController';
import { HallDismissModel } from './HallDismissModel';
import { HallUserModel } from '../login/HallUserModel';
import { HallAlert } from '../../common/HallAlert';
import { HallUtil } from '../../util/HallUtil';
import { HallDismissController } from './HallDismissController';

export let HallDismissViewSign = "dismiss";
export class HallDismissView extends HallBaseView {
    text_dismiss: any;
    jvjue: cc.Node;
    tongyi: cc.Node;
    text_time: any;
    playerNode: cc.Node;
    //发起人用户Id
    invokeUserId: string;
    //发起人昵称
    invoke_nick_name: string = '';
    //显示提示
    invoke_tip: string;
    //是否是发起人
    blnInvoke: boolean = false;
    //解散倒计时秒数
    dismissSeconds: number = 60;
    //是否已经点过同意
    hasAgreed: boolean = false;
    timeLabel: cc.Node = null;
    headNodeMap:any = {};
    constructor() {
        super();
        this.setBindDatas({
            //冒号之前的是预制体中的名字（必须一致），varName是在当前类中的变量名称
            "text_dismiss": { varName: "text_dismiss" },//显示解散内容
            "text_time": { varName: "timeLabel" },//倒计时
            "playerNode": { varName: "playerNode" },//显示头像信息的节点
            "tongyi": { varName: "tongyi" },//同意按钮
            "jvjue": { varName: "jvjue" },//拒绝
        });
        this.setSign(HallDismissViewSign);
        //取数据，判断是否是发起人
        this.checkInvokeUserId();
        if (this.blnInvoke) {
            this.setPrefab("res/prefab/jiesan/jiesan_tips_faqi");
        } else {
            this.setPrefab("res/prefab/jiesan/jiesan_tips_beifaqi");
        }

    }
    //加载view完成
    onPrefabLoaded() {
        if (this.tongyi) {
            this.tongyi.on(cc.Node.EventType.TOUCH_START, function (event) {
                h.log.debug("同意");
                this.sendVote(true);
                this.hasAgreed = true;
                this.tongyi.active = false;
                this.jvjue.active = false;
            }.bind(this));
        }
        if (this.jvjue) {
            this.jvjue.on(cc.Node.EventType.TOUCH_START, function (event) {
                h.log.debug("拒绝");
                this.sendVote(false);
                this.hasAgreed = false;
                this.tongyi.active = false;
                this.jvjue.active = false;
            }.bind(this));
        }
        this.text_dismiss.getComponent(cc.Label).string = this.invoke_tip;
        //把任务头像节点添加进来
        this.addPlayerHeader();
        //刷新UI
        this.refreshUI();
        //启动倒计时
        this.startClock();
    }

    //发送投票 
    sendVote(choosed: boolean) {
        HallController.dissolveVote(function () { }, choosed);
    }

    //添加头像信息
    addPlayerHeader() {
        let dismissData = HallDismissModel.getInstance().getDismissData();
        h.log.debug("添加头像信息dismissData=" + JSON.stringify(dismissData));
        for (let i = 0; i < dismissData.states.length; i++) {
            let playerInfo = dismissData.states[i];
            let playerHeadPrefab = h.resManager.getPrefabByName("res/prefab/jiesan/jiesan_yonghuxinxi");
            let playerHeadNode = cc.instantiate(playerHeadPrefab);

            if (!playerInfo.nickName) {
                playerInfo.nickName = this.getPlayerData(playerInfo.uid).nickname;
            }
            if (!playerInfo.headIcon) {
                playerInfo.headIcon = this.getPlayerData(playerInfo.uid).headimgurl
            }
            this.updateHeadInfo(playerHeadNode, playerInfo);
            this.headNodeMap[playerInfo.uid] = playerHeadNode;
            this.playerNode.addChild(playerHeadNode);
        }
    }

    getPlayerData(uid){
        return null;
    }

    updateHeadInfo(node, playerInfo) {
        let bindDatas = {
            nicheng: { varName: "nickName" }, //名字   
            head: { varName: "playerHead" },//头像
            cuo: { varName: "chooseStatus" },//状态
            waiting: { varName: "waiting" },
        }
        HallUIUtil.bind(bindDatas, node);
        if (playerInfo.headIcon) {
            HallUIUtil.urlSprite(playerInfo.headIcon, node.playerHead);
            //HallGameUtil.log("用户头像=" + playerInfo.headIcon);
            // cc.loader.load(playerInfo.headIcon, function (err, texture) {
            //     var frame = new cc.SpriteFrame(texture);
            //     self.playerHead.spriteFrame = frame;
            // });
        }
        node.nickName.string = playerInfo.nickName;
        let yxzPlist = h.resManager.getAtlasByName("res/images/atlas/youxizhong");
        cc.log("playerInfo.state=" + playerInfo.state);
        switch (playerInfo.state) {
            case HallConstant.DismissStatus.agreed:
                cc.log("agreed...");
                node.waiting.active = false;
                node.chooseStatus.active = true;
                node.chooseStatus.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('doudizhu_jiesan_tongyi') ;
                break;
            case HallConstant.DismissStatus.refused:
                cc.log("refused...");
                node.waiting.active = false;
                node.chooseStatus.active = true;
                //node.chooseStatus.spriteFrame.setTexture( yxzPlist.getSpriteFrame('doudizhu_jiesan_jujue') );
                node.chooseStatus.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('doudizhu_jiesan_jujue') ;
                break;
            case HallConstant.DismissStatus.waiting:
                cc.log("waiting....");
                node.chooseStatus.active = false;
                node.waiting.active = true;
                break;

        }
    }

    updatePlayerInfo() {
        let dismissData = HallDismissModel.getInstance().getDismissData();
        h.log.debug("添加头像信息dismissData=" + JSON.stringify(dismissData));
        for (let i = 0; i < dismissData.states.length; i++) {
            let playerInfo = dismissData.states[i];
            if (!playerInfo.nickName) {
                playerInfo.nickName = this.getPlayerData(playerInfo.uid).nickname;
            }
            if (!playerInfo.headIcon) {
                playerInfo.headIcon = this.getPlayerData(playerInfo.uid).headimgurl;
            }
            let headNode = this.headNodeMap[playerInfo.uid];
            this.updateHeadInfo(headNode, playerInfo);
        }
    }

    //检测发起人
    checkInvokeUserId() {
        let dismissData = HallDismissModel.getInstance().getDismissData();
        this.dismissSeconds = dismissData.seconds;
        //uid 是发起人id

        if (dismissData.uid) {
            this.invokeUserId = dismissData.uid;
        }

        if (dismissData.dissolveId) {
            this.invokeUserId = dismissData.dissolveId;
        }

        if (HallUserModel.getInstance().getUserID() == this.invokeUserId) {
            this.blnInvoke = true;
        } else {
            this.blnInvoke = false;
        }
        //取发起人昵称
        h.log.debug("检测到发起人 dismissData.states.length=" + dismissData.states.length);
        for (let i = 0; i < dismissData.states.length; i++) {
            let playerInfo = dismissData.states[i];
            h.log.debug("playerInfo" + JSON.stringify(playerInfo));
            //检测到发起人
            if (playerInfo.uid == this.invokeUserId) {
                h.log.debug("playerInfo.uid=" + playerInfo.uid);
                h.log.debug("this.invokeUserId=" + this.invokeUserId);
                // this.invoke_nick_name = this.getPlayerData(playerInfo.uid).nickname;
                this.invoke_tip = '玩家【' + this.invoke_nick_name + '】申请解散房间,请等待其它玩家选择（超过' + this.dismissSeconds + '秒未做选择，则默认同意）';
                break;
            }
        }

    }

    //显示解散面板
    refreshUI() {
        let dismissData = HallDismissModel.getInstance().getDismissData();
        this.updatePlayerInfo();
    }

    //刷新投票结果
    refreshData() {
        this.refreshUI();
    }

    //处理解散结果
    dealDismissResult() {
        //添加拒绝人的昵称
        let dismissData = HallDismissModel.getInstance().getDismissData();
        h.log.debug("处理解散结果--->" + JSON.stringify(dismissData));
        if (dismissData.result) {
            //解散成功
            this.removeUI();
            let agreedNickName = '';
            for (let i = 0; i < dismissData.states.length; i++) {
                let playerInfo = dismissData.states[i];
                if (playerInfo.state == HallConstant.DismissStatus.agreed) {
                    agreedNickName += this.getPlayerData(playerInfo.uid).nickname;
                    agreedNickName += ',';
                }
            }
            let douInex = agreedNickName.lastIndexOf(',');
            agreedNickName = agreedNickName.substring(0, douInex);
            // DZGameController.getInstance().dismissDeal();
            HallAlert.show("经玩家" + agreedNickName + "同意,房间解散成功", this.btnOk.bind(this));
        } else {
            //解散失败
            this.removeUI();
            let refusedNickName = '';
            for (let i = 0; i < dismissData.states.length; i++) {
                let playerInfo = dismissData.states[i];
                if (playerInfo.state == HallConstant.DismissStatus.refused) {
                    refusedNickName += this.getPlayerData(playerInfo.uid).nickname;
                }
            }
            HallAlert.show("由于玩家【" + refusedNickName + "】拒绝,房间解散失败,游戏继续");
        }
    }

    //点击确定
    btnOk() {
        h.viewManager.removeView(this);
    }

    //更新数字
    updateTime() {
        this.dismissSeconds -= 1;
        this.timeLabel.getComponent(cc.Label).string = String(this.dismissSeconds);
        if (this.dismissSeconds <= 0) {
            //时间到，默认发送同意
            h.log.debug("时间到，默认发送同意...");
            if (!this.blnInvoke) {
                if (!this.hasAgreed) {
                    //已经点过同意的时间到了不用发默认同意了
                    this.sendVote(true);
                }
            }
            this.stopClock();
        }
    }
    /**
     * 启动脑中
     */
    startClock() {
        this.hasAgreed = false;
        if (this.timeLabel) {
            HallUtil.schedule(this.updateTime.bind(this), this.timeLabel, 1, true);
        }
    }

    //停止闹钟
    stopClock() {
        if (this.timeLabel) {
            this.timeLabel.stopAllActions();
        }
    }



    //
    removeUI() {
        h.viewManager.removeView(this);
    }
}
