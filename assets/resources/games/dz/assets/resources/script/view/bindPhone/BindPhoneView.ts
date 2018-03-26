/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示绑定手机界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {BindPhoneModel} from "./BindPhoneModel";
import {BindPhoneController} from "./BindPhoneController";
import {DZAlert} from "../common/DZAlert";

 export class BindPhoneView extends HallBaseView {
     private m_bind: any = null;
     private m_yifasong:any = null;
     private m_huoquyanzhengma:any = null;
     private m_haveSendTime:any = null;
     private m_haveSendTimeLabel:any = null;

     constructor() {
         super();
         this.setBindDatas({
             x: {callback: this.closeCallback.bind(this)},
             yifasong:{varName:'m_yifasong'},
             huoquyanzhengma:{varName:'m_huoquyanzhengma'},
             time:{varName:'m_haveSendTime'},
         });
         this.showMaskView(true);
         this.setPrefab("res/prefab/selfInfo/bangdingshouji");
     }

    onPrefabLoaded(){
        this.m_bind =this.getPrefabNode().getComponent('DZBindPhone');

        this.m_bind.time = BindPhoneModel.getInstance().getBindDataTime();
        this.m_bind.sendSucess = BindPhoneModel.getInstance().getBindDataSendSucess();
        this.m_bind.phoneNumber.string = BindPhoneModel.getInstance().getBindDataPhoneNumber();
        this.m_haveSendTimeLabel = this.m_haveSendTime.getComponent(cc.Label);

        if(this.m_bind.sendSucess){
            this.m_yifasong.active = true;
            this.m_huoquyanzhengma.active = false;
            this.m_haveSendTimeLabel.string = this.m_bind.time.toString() + 's';
        }else{
            this.m_yifasong.active = false;
            this.m_huoquyanzhengma.active = true;
        }
        this.m_bind.sendPhoneNumber = function (phoneNumber) {
            BindPhoneController.requsetVerityCode(this.FN_GetVerityCallBack,phoneNumber)
            this.m_yifasong.active = true;
            this.m_huoquyanzhengma.active = false;
        }.bind(this);
        this.m_bind.sendTime = function (time) {
            if(time <= 0){
                this.m_yifasong.active = false;
                this.m_huoquyanzhengma.active = true;
            }else{
                this.m_haveSendTimeLabel.string = time.toString() + 's';
            }
        }.bind(this);
        this.m_bind.bindPhone = function (phoneNumber,verityNumber) {
            cc.log('ceshi ===================4' + phoneNumber + "," + verityNumber);
            // self._gameProxy.bindPhone(verityNumber,cc.qp.userinfo.id,phoneNumber,Constants.BindPhoneState.bindphone_putcode_sus,Constants.BindPhoneState.bindphone_putcode_defeat);
            BindPhoneController.requsetBindPhone(this.FN_GetBindPhoneCallBack.bind(this),phoneNumber,verityNumber);
        }.bind(this);

    }
    closeCallback(){
        h.viewManager.removeView(this);
        BindPhoneModel.getInstance().saveBindData(this.m_bind.time,this.m_bind.sendSucess,this.m_bind.phoneNumber.string);
    }
    //获取验证码回调
     private FN_GetVerityCallBack(data){
         DZAlert.show('验证码已发送');
         cc.log('验证码 ==== ' + JSON.stringify(data));
         BindPhoneModel.getInstance().setSmsVerCode(data.data.smscode);
     }
     //绑定手机回调
     private FN_GetBindPhoneCallBack(){
         DZAlert.show('绑定成功',this.ok.bind(this));
     }

     ok(){
         h.viewManager.removeView(this);
     }
 }
