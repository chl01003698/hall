/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-16 13:50:36 
 * @Desc: 登录
 */

import { HallLoginView } from "./HallLoginView";
import { HallUserModel } from "./HallUserModel";
import { h } from "../../common/H";
import { HallNetHandler } from "../../net/HallNetHandler";
import { HallAlert } from "../../common/HallAlert";
import { HallNetConfig } from "../../net/HallNetConfig";
import { DZPlaySound } from "../../../games/dz/assets/resources/script/view/game/sound/DZPlaySound";
import { HallUIUtil } from "../../util/HallUIUtil";
import { CreateController } from "../../../games/dz/assets/resources/script/createTable/DZCreateController";
import { HallUtil } from "../../util/HallUtil";
import { HallFriendController } from "../friend/HallFriendController";

export class HallLoginController {

    static showLoginView() {
        let view: HallLoginView = new HallLoginView();
        h.viewManager.pushView(view);
    }

    // service/////////////////////////////////////
    static signup(callback: Function, code: string, platform: string) {
        let param:any = {
            code: code,
            platform: platform,
            device: h.os,
        }
        let mwurl:string = h.commonSDK.getMwurl();
        h.log.debug("mwurl:", mwurl);
        let paramDict = HallUtil.getUrlParams(mwurl);
        if(paramDict && paramDict.tag == HallNetConfig.shareTag.inviteGiftCard){
            param.shortId = paramDict.shortId;
        }
        h.http.post("/public/v1/users/", function (data) {
            HallUserModel.getInstance().setUserData(data.data);
            HallUserModel.getInstance().setToken(data.data.token);
            if (callback) {
                callback(data);
            }
        }, param);
    }

    static getUserData(callback: Function, uid: string) {
        h.http.get("/api/v1/users/" + uid + "?device=" + h.os, function () {
            if (callback) {
                callback();
            }
        });
    }

    static getUserDataBySortID(callback: Function, sortID: string) {
        h.http.get("/api/v1/users/shortId/" + sortID + "?device=" + h.os, function (data) {
            //shortId登陆时服务器不返回token
            HallUserModel.getInstance().setToken(data.data.token);
            if (callback) {
                callback();
            }
        });
    }

    static checkUser(callback: Function, code: string, platform: string) {
        let param: any = {
            code: code,
            platform: platform
        }
        h.http.post("/api/v1/users", function (data) {
            HallUserModel.getInstance().setUserData(data.data);
            if (callback) {
                callback();
            }
        }, param);
    }

    static login(callback: Function, token: string) {
        let param = {
            token: token
        }
        h.net.sendData(HallNetHandler.connector.entryHandler.login, function (data) {
            data.data.user.ip = data.ip;
            HallUserModel.getInstance().setUserData(data.data.user);
            this.preRequest(callback);
        }.bind(this), param);
        h.http.getFile(HallNetConfig.ipUrl, function (data) {
            var regExp = new RegExp("{.*}");
            let result: RegExpExecArray = regExp.exec(data);
            let jsonData = JSON.parse(result[0]);
            HallUserModel.getInstance().setIp(jsonData.cip);
        });
    }

    static preRequest(callback: Function) {
        CreateController.getTableInfo(null);
        HallFriendController.getFriend(null);
        HallFriendController.getPendingFriend(function () {
            if (callback) {
                callback();
            }
        });
    }
}
