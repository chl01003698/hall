/*
 * @Author: lijian
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 绑定手机数据
 */


import {HallBaseModel} from "../../../../../../../script/common/HallBaseModel";

export class BindPhoneModel extends HallBaseModel {
    private saveTime: any = 60;
    private saveSendSucess: any = false;
    private savePhoneNumber:any =  '';
    private saveSms:any;
    private static instance: BindPhoneModel = null;
    static getInstance(): BindPhoneModel {
        if (this.instance == null) {
            this.instance = new BindPhoneModel();
        }
        return this.instance;
    }
    saveBindData(time,sendSucess,phoneNumber) {
        this.saveTime = time;
        this.saveSendSucess = sendSucess;
        this.savePhoneNumber = phoneNumber;
    }
   public getBindDataTime () {
        return  this.saveTime;
    }
    public getBindDataSendSucess () {
        return  this.saveSendSucess;
    }
    public getBindDataPhoneNumber () {
        return  this.savePhoneNumber;
    }

    public setSmsVerCode(code){
        this.saveSms = code;
    }

    public getSmsVerCode():any{
        return this.saveSms;
    }
}