/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-23 12:03:14 
 * @Desc: 文件描述
 */

import { HallFriendViewFromType, HallFriendView } from "./HallFriendView";
import { h } from "../../common/H";
import { HallFriendModel } from "./HallFriendModel";
import { HallStringUtil } from "../../util/HallStringUtil";
import { HallAlert, HallAlertType } from "../../common/HallAlert";
import { HallController } from "../hall/HallController";

export class HallFriendController {

    static showFriendView(fromType: HallFriendViewFromType = HallFriendViewFromType.normal) {
        this.getFriend(function () {
            let view = new HallFriendView(fromType);
            h.viewManager.pushView(view);
        });
    }

    /////////////service//////////////////////
    // 好友列表
    static getFriend(callback: Function) {
        h.net.sendData("user.friendHandler.getFriends", function (data) {
            HallFriendModel.getInstance().setFriendDatas(data.data);
            if (callback) {
                callback(data);
            }
        });
    }

    // 新好友列表
    static getPendingFriend(callback: Function) {
        h.net.sendData("user.friendHandler.getPendings", function (data) {
            HallFriendModel.getInstance().setNewFriendDatas(data.data);
            if (callback) {
                callback(data)
            }
        })
    }

    // 添加好友
    static addFriend(callback: Function, shortId: number) {
        let param: any = {
            shortId: shortId
        }
        h.net.sendData("user.friendHandler.addFriend", function (data) {
            HallFriendModel.getInstance().addFriendData(data.data);
            if (callback) {
                callback(data)
            }
        }, param);
    }

    // 同意添加
    static agree(callback: Function, shortId: number) {
        let param: any = {
            shortId: shortId
        }
        h.net.sendData("user.friendHandler.agree", function (data) {
            let newFriendData: any = HallFriendModel.getInstance().removeNewFriendDataByShortId(shortId);
            HallFriendModel.getInstance().addFriendData(newFriendData);
            if (callback) {
                callback(data)
            }
        }, param);
    }

    // 删除好友
    static removeFriend(callback: Function, shortId: number) {
        let param: any = {
            shortId: shortId
        }
        h.net.sendData("user.friendHandler.removeFriend", function (data) {
            HallFriendModel.getInstance().removeFriendData(shortId);
            if (callback) {
                callback(data)
            }
        }, param);
    }

    // 邀请好友进入房间
    static inviteJoinGame(callback: Function, shortId: number) {
        let param: any = {
            shortId: shortId
        }
        h.net.sendData("user.friendHandler.inviteJoinGame", function (data) {
            if (callback) {
                callback(data);
            }
        }, param);
    }

    static getUserDetail(callback:Function, shortId:number){
        let param:any = {
            shortId:shortId
        }
        h.net.sendData("user.friendHandler.getUserDetail", function(data){
            if(callback){
                callback(data);
            }
        }, param);
    }

    // 拒绝邀请
    static refuseInvite(callback: Function, shortId: number) {
        let param: any = {
            shortId: shortId
        }
        h.net.sendData("user.friendHandler.refuseInvite", function (data) {
            if (callback) {
                callback(data);
            }
        }, param);
    }

    // 进入好友牌桌
    static joinFriendGame(callback:Function, shortId:number){
        let param:any = {
            shortId:shortId
        }
        h.net.sendData("user.friendHandler.joinFriendGame", function(data){
            if(callback){
                callback(data);
            }
        }, param);
    }

    // 同意好友进桌
    static agreeJoinGame(callback:Function, shortId:number){
        let param:any = {
            shortId:shortId
        }
        h.net.sendData("user.friendHandler.agreeJoinGame", function(data){
            if(callback){
                callback(data);
            }
        }, param);
    }

    // 拒绝好友加入自己的牌桌
    static refuseJoinGame(callback:Function, shortId:number){
        let param:any = {
            shortId:shortId
        }
        h.net.sendData("user.friendHandler.refuseJoinGame", function(data){
            if(callback){
                callback(data);
            }
        }, param);
    }
    
    // 申请添加好友的推送
    static onAddFriend(callback: Function) {
        h.net.regPush("onAddFriend", function (data) {
            HallFriendModel.getInstance().addNewFriendData(data);
        });
    }

    // 被邀请进桌的推送
    static onInviteJoinGame(callback: Function) {
        h.net.regPush("onInviteJoinGame", function (data) {
            let tip = HallStringUtil.format("{0}邀请你加入房间", data.nickname);
            let alert: HallAlert = HallAlert.show(tip, function () {
                HallController.join(function () {

                }, data.roomId)
            }, function () {
                HallFriendController.refuseInvite(function () {

                }, data.shortId);
            });
            alert.setType(HallAlertType.twoButton);
            alert.setCancelText("拒绝");
            alert.setRightConfirmText("同意")
        });
    }

    // 拒绝邀请的推送
    static onRefuseInvite(callback: Function) {
        h.net.regPush("onRefuseInvite", function (data) {
            let tip = HallStringUtil.format("{0}拒绝了你的邀请", data.nickname);
            let alert: HallAlert = HallAlert.show(tip);
        });
    }

    // 好友申请加入牌桌的邀请
    static onJoinFriendGame(callback:Function){
        h.net.regPush("onJoinFriendGame", function(data){
            let tip = HallStringUtil.format("好友{0}申请加入您所在的牌桌", data.nickname);
            let alert:HallAlert = HallAlert.show(tip, function(){
                HallFriendController.agreeJoinGame(null, data.shortId);
            }, function(){
                h.log.debug("拒绝=========");
                HallFriendController.refuseJoinGame(null, data.shortId);
            });
            alert.setType(HallAlertType.twoButton);
            alert.setCancelText("拒绝");
            alert.setRightConfirmText("同意");
        })
    }

    // 被同意加入牌桌
    static onAgreeJoinGame(callback:Function){
        h.net.regPush("onAgreeJoinGame", function(data){
            HallController.join(null, data.roomId);
        })
    }

    // 被拒绝加入牌桌
    static onRefuseJoinGame(callback:Function){
        h.net.regPush("onRefuseJoinGame", function(data){
            HallAlert.show(HallStringUtil.format("{0}拒绝了您的加入", data.nickname))
        })
    }
}