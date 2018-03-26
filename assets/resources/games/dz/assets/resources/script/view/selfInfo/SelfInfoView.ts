/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示个人资料界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {BindPhoneController} from "../bindPhone/BindPhoneController";
import {RealNameController} from "../realName/RealNameController";
import {DZGameRuleController} from "../gameRule/DZGameRuleController";
import {DZZhanjiController} from "../zhanji/DZZhanjiController";
import {DZBattleReportController} from "../battleReport/DZBattleReportController";
import {DZOnlineCustomerController} from "../onlineCustomer/DZOnlineCustomerController";
import {DZChatCommonController} from "../chatCommon/DZChatCommonController";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {HallLoginController} from "../../../../../../../script/view/login/HallLoginController";
import {HallUIUtil} from "../../../../../../../script/util/HallUIUtil";
import {HallAlert, HallAlertType} from "../../../../../../../script/common/HallAlert";
import {DZAlert} from "../../../../../../sz/assets/resources/script/view/common/SZAlert";
import {HallController} from "../../../../../../../script/view/hall/HallController";

 export class SelfInfoView extends HallBaseView {
     private playerName: any;
     private m_playerId: any;
     private m_playerIp: any;
     private m_playerGps: any;
     private m_head:any;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            bangdingshouji:{callback:this.bindPhoneCallBack.bind(this)},
            shimingrenzheng:{callback:this.realNameCallBack.bind(this)},
            qiehuanzhanghao:{callback:this.changeAsscountCallBack.bind(this)},
            nickName:{varName : "playerName"},
            playerId:{varName : "m_playerId"},
            playerIp:{varName : "m_playerIp"},
            playerGps:{varName : "m_playerGps"},
            head:{varName:'m_head'},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/selfInfo/gerenziliao");
    }

    onPrefabLoaded(){
        let nameLabel = this.playerName.getComponent(cc.Label);
        let idLabel = this.m_playerId.getComponent(cc.Label);
        let ipLabel = this.m_playerIp.getComponent(cc.Label);
        let gpsLabel = this.m_playerGps.getComponent(cc.Label);
        nameLabel.string = HallUserModel.getInstance().getName();
        idLabel.string = HallUserModel.getInstance().getShortID();
        ipLabel.string = HallUserModel.getInstance().getIp();
        gpsLabel.string = HallUserModel.getInstance().getGpsDesc();
        HallUIUtil.urlSprite(HallUserModel.getInstance().getHeadUrl(), this.m_head)
    }

    bindPhoneCallBack(){
        BindPhoneController.showBindPhoneView();
        // DZGameRuleController.showGameRuleView();
        // DZChatCommonController.showChatCommonView();
    }

     realNameCallBack(){
         RealNameController.showRealNameView();
         // DZBattleReportController.showBattleReportView();
         // DZOnlineCustomerController.showOnlineCustomerView();

     }

     changeAsscountCallBack() {
         let alert: DZAlert = DZAlert.show('是否切换账号?', function () {

         }, function () {
             HallLoginController.showLoginView();
         });
         alert.setType(HallAlertType.twoButton);
         alert.setCancelText("确定");
         alert.setRightConfirmText("取消");
     }

    closeCallback(){
        h.viewManager.removeView(this);
    }
 }
