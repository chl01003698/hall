/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-16 13:45:46 
 * @Desc: 登录
 */

import { HallBaseView } from "../../common/HallBaseView";
import { HallConfig } from "../../config/HallConfig";
import { HallUserModel } from "./HallUserModel";
import { HallNetConfig } from "../../net/HallNetConfig";
import { h } from "../../common/H";
import { HallLoginController } from "./HallLoginController";
import { HallAlert, HallAlertType } from "../../common/HallAlert";
import { HallHotUpdateController } from "../hotupdate/HallHotUpdateController";
import { HallHotUpdateEvent } from "../../manager/HallHotUpdateManager";
import { HallSDKConstant } from "../../sdk/HallSDKConstant";
import { HallController } from "../hall/HallController";

export class HallLoginView extends HallBaseView {
    private routeEB:cc.Node;
    private paramEB:cc.Node;
    private idEB:cc.Node;
    private signupBtn:cc.Node;
    private hostEB:cc.Node;
    private urlEB:cc.Node;
    private portEB:cc.Node;

    constructor() {
        super();
        this.setBindDatas({
            loginBtn: { varName: "loginBtn", callback: this.loginCallback.bind(this) },
            wxLoginBtn: { varName: "wxLoginBtn", callback: this.wxLoginCallback.bind(this)},
            socketBtn: {callback:this.socketCallback.bind(this)},
            idEB:{varName:"idEB"},
            routeEB:{varName:"routeEB"},
            paramEB:{varName:"paramEB"},
            signupBtn:{callback:this.signupCallback.bind(this)},
            tryplayBtn:{callback: this.tryPlayCallback.bind(this)},
            hostEB:{varName:"hostEB"},
            urlEB:{varName:"urlEB"},
            portEB:{varName:"portEB"},
            updateBtn:{callback:this.updateCallback.bind(this)},
            cleanupBtn:{callback:this.cleanupUpdateCallback.bind(this)},
            uiNode_debug:{varName:"debugNode"},
        });
        this.setPrefab("res/prefab/login/login");
    }
    onPrefabLoaded() {
        //if(HallConfig.isDebug()){
        //    this.debugNode.active = false;
        //}
        this.idEB.getComponent(cc.EditBox).string = HallUserModel.getInstance().getLocalSortID();
        this.hostEB.getComponent(cc.EditBox).string = HallNetConfig.host;
        this.portEB.getComponent(cc.EditBox).string = HallNetConfig.port;
        this.urlEB.getComponent(cc.EditBox).string = HallNetConfig.hallURL;
    }
    
    test(){
        HallNetConfig.host = this.hostEB.getComponent(cc.EditBox).string;
        HallNetConfig.port = this.portEB.getComponent(cc.EditBox).string;
        HallNetConfig.hallURL = this.urlEB.getComponent(cc.EditBox).string;
        h.http.setBaseURL(HallNetConfig.hallURL);
    }

    loginCallback() {
        this.test();
        // HallController.showHallView();
        // return;
        let sortID:string = this.idEB.getComponent(cc.EditBox).string;
        HallUserModel.getInstance().setLocalSortID(sortID);
        HallLoginController.getUserDataBySortID(function(){
            HallController.updateConfig(null);
            h.net.initPomelo(HallNetConfig.host, HallNetConfig.port, function(){
                HallLoginController.login(function(){
                    HallController.checkMwurl();
                    let startView = h.viewManager.getGameStartView();
                    if(!startView){
                        h.log.debug("%%%登陆成功...显示大厅");
                        HallController.showHallView();
                    }
                }, HallUserModel.getInstance().getToken());
            });
        }, sortID);
    }

    wxLoginCallback() {
        if(!HallConfig.isDebug()){
            this.login();
            return;
        }
        if(HallConfig.isDebug()){
            h.hotUpdateManager.setManifestUrl(cc.url.raw("resources/res/config/debug_project.manifest"));
        }else{
            h.hotUpdateManager.setManifestUrl(cc.url.raw("resources/res/config/release_project.manifest"));
        }
        h.hotUpdateManager.checkUpdate();
        // this.test();
        h.eventManager.addListenerOnce(HallHotUpdateEvent.ALREADY_UP_TO_DATE, function(){
            this.login();
        }, this);
        h.eventManager.addListenerOnce(HallHotUpdateEvent.NEW_VERSION_FOUND, function(){
            let alert:HallAlert = HallAlert.show("发现新版本,您是否需要更新?", function(){
                HallHotUpdateController.showHotUpdateView();
                h.hotUpdateManager.hotUpdate();
            });
            alert.setType(HallAlertType.twoButton);
            alert.setRightConfirmText("更新");
        }, this);

        // HallController.showHallView();
        // HallLoginController.getUserData(function () {
        //     h.net.initPomelo(HallNetConfig.host, HallNetConfig.port, function(){
        //     });
        //     h.viewManager.removeView(this);
        //     HallController.showHallView();
        // }.bind(this), HallUserModel.getInstance().getLocalUserID());
    }

    login(){
        h.commonSDK.login(function(data){
            HallLoginController.signup(function(data){
                let sortID:string = HallUserModel.getInstance().getShortID();
                HallLoginController.getUserDataBySortID(function(){
                    HallController.updateConfig(null);
                    h.net.initPomelo(HallNetConfig.host, HallNetConfig.port, function(){
                        HallLoginController.login(function(){
                            HallController.showHallView();
                        }, HallUserModel.getInstance().getToken());
                    });
                }, sortID);
            }, data.code, HallSDKConstant.LoginType.wx);
        });
    }


    socketCallback() {
        let route:string = this.routeEB.getComponent(cc.EditBox).string;
        let param = null;
        try{
            param = JSON.parse(this.paramEB.getComponent(cc.EditBox).string);
        }catch(e){
            h.log.debug(e.message);
            return;
        }
        h.net.sendData(route, null, param);
       
    }
        
    cleanupUpdateCallback(){
        jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + "update");
        jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + "update_temp");
    }

    /**
     * 更新
     */
    updateCallback(){
        if(!HallConfig.isDebug()){
            this.login();
            return;
        }
        h.hotUpdateManager.setManifestUrl(cc.url.raw("resources/res/config/project.manifest"));
        h.hotUpdateManager.checkUpdate();
        h.eventManager.addListenerOnce(HallHotUpdateEvent.ALREADY_UP_TO_DATE, function(){
            HallAlert.show("已经是最新版本");
        }, this);
        h.eventManager.addListenerOnce(HallHotUpdateEvent.NEW_VERSION_FOUND, function(){
            let alert:HallAlert = HallAlert.show("发现新版本,您是否需要更新?", function(){
                HallHotUpdateController.showHotUpdateView();
                h.hotUpdateManager.hotUpdate();
            });
            alert.setType(HallAlertType.twoButton);
            alert.setRightConfirmText("更新");
        }, this);
    }

    /**
     * 登录
     */
    signupCallback(){
        this.test();
        HallLoginController.signup((data)=> {
            this.idEB.getComponent(cc.EditBox).string = data.data.shortId;
            HallAlert.show("新用户: " + data.data.shortId);
            h.log.debug("%%%登陆成功"+ JSON.stringify(data));
        }, "create test", "company");
    }
    
    /**
     * 试玩
     */
    tryPlayCallback(){
        this.test();
        h.log.debug('test tryPlayCallback')
        HallLoginController.signup((data) => {
            this.idEB.getComponent(cc.EditBox).string = '' + data.data.shortId
            this.loginCallback()
        }, "create test", "company");
    }
}